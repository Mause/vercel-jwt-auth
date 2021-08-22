import { VercelRequest, VercelResponse } from "@vercel/node";
import { Request, Response } from "express";
import jwt from "express-jwt";

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

export async function authenticate(request: VercelRequest, response: VercelResponse) {
  const expressRequest = request as unknown as Request;
  const error = await new Promise((resolve) =>
    filter(expressRequest, response as unknown as Response, resolve)
  );
  return isResponse(error) ? error : expressRequest.user;
}
