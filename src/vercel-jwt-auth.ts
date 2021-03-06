import { VercelResponse, VercelApiHandler, VercelRequest } from "@vercel/node";
import { Request, Response } from "express";
import { expressjwt } from "express-jwt";

export type VercelRequestWithUser = VercelRequest & {
  user?: unknown;
};

interface ResponseShape {
  status: number;
  message: string;
}

function isResponse(r: any): r is ResponseShape {
  return r?.status && r?.message;
}
function isPromise(r: any): r is Promise<unknown> {
  return !!r?.then;
}

export const supabase = (secret: string) =>
  factory({
    algorithms: ["HS256"],
    credentialsRequired: true,
    audience: "authenticated",
    secret,
  });

export type Params = Parameters<typeof expressjwt>[0];

export function factory(params: Params) {
  const filter = expressjwt(params);

  return function authenticate(handler: VercelApiHandler) {
    return async function (
      request: VercelRequestWithUser,
      response: VercelResponse
    ): Promise<void> {
      const expressRequest = request as unknown as Request;
      const error = await new Promise((resolve) =>
        filter(expressRequest, response as unknown as Response, resolve)
      );

      if (isResponse(error)) {
        console.error(error);
        response.status(error.status);
        response.json({ error: error.message });
      } else {
        const res = handler(request, response);
        if (isPromise(res)) {
          await res;
        }
      }
    };
  };
}
