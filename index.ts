import { VercelRequest, VercelResponse } from "@vercel/node";
import { Request, Response } from "express";
import jwt from "express-jwt";
import { Express } from "express";

type User = Express.User;

export class ErrorBox {
  _tag = 'error';
  constructor(public error: ResponseShape) {}
}
export class UserBox<T> {
  _tag = 'user';
  constructor(public user: T) {}
}
export type Box<T> = UserBox<T> | ErrorBox;

interface ResponseShape {
  status: number;
  message: string;
}

function isResponse(r: any): r is ResponseShape {
  return r?.status && r?.message;
}

export function factory(secret: string) {
  const filter = jwt({
    algorithms: ["HS256"],
    credentialsRequired: true,
    audience: "authenticated",
    secret,
  });

  return async function authenticate(
    request: VercelRequest,
    response: VercelResponse
  ): Promise<Box<User>> {
    const expressRequest = request as unknown as Request;
    const error = await new Promise((resolve) =>
      filter(expressRequest, response as unknown as Response, resolve)
    );
    return isResponse(error)
      ? new ErrorBox(error)
      : expressRequest.user
      ? new UserBox(expressRequest.user)
      : new ErrorBox({ message: "No user", status: 422 });
  };
}
