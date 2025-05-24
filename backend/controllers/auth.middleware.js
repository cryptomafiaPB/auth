import jwt from "jsonwebtoken";

export const isLogedIn = async (req, res, next) => {
  try {
    // 1. get cookie
    const token = req.cookies.id || "";
    // console.log("token:", token);
    //  2. validate
    if (!token) {
      console.log("token", req.cookies.id);
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
    // 3. Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
