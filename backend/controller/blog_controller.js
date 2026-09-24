import Blog from "../models/blog.js";
import Comment from "../models/comment.js";
import Like from "../models/like.js";
import { slugify } from "../utility/slugify.js";

const generateUniqueSlug = async (title, blogId = null) => {
  const baseSlug = slugify(title);

  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const query = { slug };

    if (blogId) {
      query._id = { $ne: blogId };
    }

    const existing = await Blog.findOne(query);

    if (!existing) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;
  }
};

export const createBlog = async (req, res) => {
  try {
    console.log("CREATE BLOG BODY:", req.body);
    console.log("CREATE BLOG USER:", req.user);

    const {
      title,
      description,
      mediaType,
      mediaUrl,
      thumbnail,
      published = true,
    } = req.body;

    // Check authentication
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Check admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    // Validate required fields
    if (!title?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    if (!description?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Description is required",
      });
    }

    // Validate media URL
    if (
      mediaType &&
      mediaType !== "none" &&
      mediaUrl &&
      !isValidUrl(mediaUrl)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid media URL",
      });
    }

    // Generate slug
    const slug = await generateUniqueSlug(title);

    // Create blog
    const blog = await Blog.create({
      title: title.trim(),
      slug,
      description: description.trim(),

      media: {
        type: mediaType || "none",
        url: mediaUrl || "",
        thumbnail: thumbnail || "",
      },

      author: req.user.id,

      published:
        typeof published === "boolean"
          ? published
          : true,
    });

    // Populate author
    const populatedBlog =
      await Blog.findById(blog._id)
        .populate("author", "name email")
        .lean();

    return res.status(201).json({
      success: true,
      message: "Blog created successfully",
      data: populatedBlog,
    });

  } catch (error) {
    console.error("CREATE BLOG ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create blog",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};

export const getBlogs = async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Number(req.query.limit) || 10, 50);
    const search = req.query.search?.trim();

    const filter = {
      published: true,
    };

    if (search) {
      filter.$text = {
        $search: search,
      };
    }

    const skip = (page - 1) * limit;

    const [blogs, total] = await Promise.all([
      Blog.find(filter)
        .populate("author", "name")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      Blog.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: blogs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch blogs",
    });
  }
};

export const getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({
      slug: req.params.slug,
      published: true,
    })
      .populate("author", "name")
      .lean();

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    let likedByUser = false;

    if (req.user) {
      const like = await Like.exists({
        blog: blog._id,
        user: req.user._id,
      });

      likedByUser = Boolean(like);
    }

    const comments = await Comment.find({
      blog: blog._id,
    })
      .populate("user", "name")
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      data: {
        ...blog,
        likedByUser,
        comments,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch blog",
    });
  }
};

export const getAdminBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate("author", "name email")
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      data: blogs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch admin blogs",
    });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const {
      title,
      description,
      mediaType,
      mediaUrl,
      thumbnail,
      published,
    } = req.body;

    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    if (title !== undefined) {
      blog.title = title.trim();

      blog.slug = await generateUniqueSlug(
        title,
        blog._id
      );
    }

    if (description !== undefined) {
      blog.description = description.trim();
    }

    if (mediaType !== undefined) {
      blog.media.type = mediaType;
    }

    if (mediaUrl !== undefined) {
      blog.media.url = mediaUrl;
    }

    if (thumbnail !== undefined) {
      blog.media.thumbnail = thumbnail;
    }

    if (published !== undefined) {
      blog.published = published;
    }

    await blog.save();

    const updatedBlog = await Blog.findById(blog._id)
      .populate("author", "name email")
      .lean();

    res.json({
      success: true,
      message: "Blog updated successfully",
      data: updatedBlog,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to update blog",
    });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    await Promise.all([
      Blog.deleteOne({ _id: blog._id }),
      Comment.deleteMany({ blog: blog._id }),
      Like.deleteMany({ blog: blog._id }),
    ]);

    res.json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to delete blog",
    });
  }
};

const isValidUrl = (url) => {
  try {
    const parsed = new URL(url);

    return ["http:", "https:"].includes(parsed.protocol);
  } catch {
    return false;
  }
};