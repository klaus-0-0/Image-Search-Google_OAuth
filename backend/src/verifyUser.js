const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;
  console.log("okok = ", token);

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  console.log("token = ", token);
  
  try {
    const decoded = jwt.verify(token, process.env.TOKEN);
    req.userId = decoded.id;
    console.log("deco", decoded);
    console.log("deco", decoded.id);

    next();
  } catch (err) {
    console.error("Token verification error:", err);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;