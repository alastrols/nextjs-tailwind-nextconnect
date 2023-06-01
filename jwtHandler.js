const jwt = require("jsonwebtoken");

const secretKey = "^%##@%&ITP-website-token^%##@%&";

export function getToken(json) {
  const token = jwt.sign(json, secretKey, { expiresIn: "4h" });
  return token;
}

export async function verifyToken(value) {
  if (!value) {
    return "error";
  }
  // console.log("Verify Token: " + JSON.stringify(req.headers));
  var token = value.split(" ")[1];
  if (!token) {
    return "error";
  }
  try {
    const decoded = jwt.verify(token, secretKey);
    return decoded;
  } catch {
    return "error";
  }
}
