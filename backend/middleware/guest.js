import crypto from "crypto";

const guestIdentity = (
  req,
  res,
  next
) => {
  try {
    let guestToken =
      req.headers["x-guest-token"];

    /*
     * If this is a visitor without a token,
     * create one.
     */
    if (
      !guestToken ||
      typeof guestToken !== "string"
    ) {
      guestToken =
        crypto.randomUUID();

      res.setHeader(
        "X-Guest-Token",
        guestToken
      );
    }

    req.guestToken =
      guestToken;

    next();
  } catch (error) {
    console.error(
      "GUEST IDENTITY ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to create guest identity",
    });
  }
};

export default guestIdentity;