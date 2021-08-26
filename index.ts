import { VercelRequest, VercelResponse, VercelApiHandler } from "@vercel/node";
import { Request, Response } from "express";
import jwt from "express-jwt";
import { Express } from "express";

type User = Express.User;

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

  return function authenticate(
    handler: VercelApiHandler
  ): VercelApiHandler {
    return async function (request: VercelRequest, response: VercelResponse): Promise<Box<User>> {
      const expressRequest = request as unknown as Request;
      const error = await new Promise((resolve) =>
        filter(expressRequest, response as unknown as Response, resolve)
      );
      if (isResponse(error)) {
        response.status(error.status);
        response.json(error.message);
      } else {
        handler(request, response);
      }
    }
  };
}
