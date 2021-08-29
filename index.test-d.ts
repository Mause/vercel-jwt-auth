import { factory } from "./index";
import { VercelRequest, VercelResponse } from "@vercel/node";
import { expectType } from "tsd";

const authenticate = factory("secret");

const endpoint = authenticate(function (
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.user) {
    res.json(req.user.name);
  }

  expectType<string | undefined>(req.user?.name);
});

endpoint({} as unknown as VercelRequest, {} as unknown as VercelResponse);
