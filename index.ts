import { VercelRequest, VercelResponse } from "@vercel/node";
import { Request, Response, User } from "express";
import jwt from "express-jwt";

class ErrorBox {
  _tag = 'error';
  constructor(public error: ResponseShape) {}
}
class UserBox<T> {
  _tag = 'user';
  constructor(public user: T) {}
}
type Box<T> = UserBox<T> | ErrorBox;

const filter = jwt({
  algorithms: ["HS256"],
  credentialsRequired: true,
  audience: "authenticated",
  secret: "fbbb2db8-89e4-4a15-9493-bdfd2bc9c8e5",
});

interface ResponseShape {
  status: number;
  message: string;
}

function isResponse(r: any): r is ResponseShape {
  return r?.status && r?.message;
}

export async function authenticate(request: VercelRequest, response: VercelResponse): Promise<Box<User>> {
  const expressRequest = request as unknown as Request;
  const error = await new Promise((resolve) =>
    filter(expressRequest, response as unknown as Response, resolve)
  );
  return isResponse(error) ? new ErrorBox(error) : new UserBox(expressRequest.user);
}
