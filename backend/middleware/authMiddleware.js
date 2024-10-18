const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// Middleware to verify JWT and extract user data
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if the Authorization header exists and starts with 'Bearer '
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  // Extract the token by removing the 'Bearer ' prefix
  const token = authHeader.split(" ")[1];

  try {
    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Attach user data to the request object
    req.user = decoded;

    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ msg: "Token has expired" });
    } else {
      return res.status(401).json({ msg: "Token is not valid" });
    }
  }
};

module.exports = { authMiddleware };
