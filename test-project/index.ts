import { factory } from "vercel-jwt-auth";
import { VercelRequest, VercelResponse } from "@vercel/node";
import "vercel-jwt-auth/index";

const authenticate = factory("secret");

const endpoint = authenticate(function (
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.user) {
    res.json(req.user.name);
  }
});

endpoint({} as unknown as VercelRequest, {} as unknown as VercelResponse);
