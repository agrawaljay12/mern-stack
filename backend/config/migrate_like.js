import Like from "../models/like.js";

/**
 * Fixes databases created by the previous like schema. The old schema used
 * nullable user/guestToken fields in separate unique indexes, which can make
 * guest likes collide on MongoDB's null value. The current schema uses one
 * required identityKey instead.
 */
export const migrateLikeIndexes = async () => {
  try {
    const collection = Like.collection;
    const indexes = await collection.indexes();

    for (const index of indexes) {
      const keys = Object.keys(index.key || {});
      const isLegacyUserIndex =
        keys.length === 2 && index.key.blog === 1 && index.key.user === 1;
      const isLegacyGuestIndex =
        keys.length === 2 && index.key.blog === 1 && index.key.guestToken === 1;

      if (isLegacyUserIndex || isLegacyGuestIndex) {
        await collection.dropIndex(index.name);
      }
    }

    const documents = await collection.find({ identityKey: { $exists: false } }).toArray();

    for (const doc of documents) {
      let identityKey = null;

      if (doc.user) {
        identityKey = `user:${String(doc.user)}`;
      } else if (doc.guestToken) {
        identityKey = `guest:${doc.guestToken}`;
      }

      if (identityKey) {
        await collection.updateOne(
          { _id: doc._id },
          { $set: { identityKey } }
        );
      } else {
        // Old anonymous records without an identity cannot be safely toggled.
        // Give them a unique legacy identity so they do not block new likes.
        await collection.updateOne(
          { _id: doc._id },
          { $set: { identityKey: `legacy:${String(doc._id)}` } }
        );
      }
    }

    await collection.createIndex({ blog: 1, identityKey: 1 }, { unique: true });
    console.log("Like indexes migrated successfully");
  } catch (error) {
    console.error("Like index migration failed:", error);
  }
};
