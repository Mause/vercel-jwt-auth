import { VercelResponse, VercelApiHandler, VercelRequest } from "@vercel/node";
import { Request, Response } from "express";
import jwt from "express-jwt";

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

  return function authenticate(handler: VercelApiHandler): VercelApiHandler {
    return function (request: VercelRequest, response: VercelResponse): void {
      const expressRequest = request as unknown as Request;
      filter(expressRequest, response as unknown as Response, (error) => {
        if (isResponse(error)) {
          response.status(error.status);
          response.json(error.message);
        } else {
          handler(request, response);
        }
      });
    };
  };
}

declare module "@vercel/node/dist/index" {
  export interface User {
    email: string;
    id: string;
  }

  // @ts-expect-error
  export type VercelRequest = {
    user?: User | undefined;
  };
}
