const jwt = require('jsonwebtoken')
import dotenv from "dotenv";
dotenv.config();
const SECRET_KEY = process.env.BP_SECRET

export function createJwtToken(userId) {
  console.log(userId.toString())
  const payload = {
    id: userId
  };

  const token = jwt.sign(payload, SECRET_KEY, { algorithm: 'HS256' });
  return token;
}