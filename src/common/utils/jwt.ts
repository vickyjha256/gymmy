import jwt, { SignOptions } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

const signOptions: SignOptions = {
  expiresIn: "7d",
};


export const generateToken = (payload: object): string => {
  return jwt.sign(payload, JWT_SECRET, signOptions);
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};