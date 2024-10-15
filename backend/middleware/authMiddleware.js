const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// Middleware to verify JWT and extract user data
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
console.log('✌️authHeader --->', authHeader);
  if (!authHeader) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }


  try {
    const decoded = jwt.verify(authHeader, JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      res.status(401).json({ msg: "Token has expired" });
    } else {
      res.status(401).json({ msg: "Token is not valid" });
    }
  }
};

module.exports = { authMiddleware };
