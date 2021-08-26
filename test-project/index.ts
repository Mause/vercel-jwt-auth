import factory from "vercel-jwt-auth";
import { VercelRequest, VercelResponse } from "@vercel/node";

const authenticate = factory("secret");

const endpoint = authenticate(function (
  req: VercelRequest,
  res: VercelResponse
) {
  if (res.user) {
    res.json(res.user.name);
  }
});

endpoint();