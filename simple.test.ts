import { factory, VercelRequestWithUser } from "./index";
import { VercelRequest, VercelResponse } from "@vercel/node";
import JWT from "jsonwebtoken";

const SECRET = "...";

const endpoint = factory(SECRET)((req, res) => {
  console.log(req.user);
  res.status(200);
  res.json("OK");
});

let response: VercelResponse;
let resolve: (value: unknown) => void;
let jsonPromise: Promise<unknown>;
beforeEach(() => {
  jsonPromise = new Promise((_resolve) => (resolve = _resolve));
  response = {
    status: jest.fn(),
    json(content: unknown) {
      resolve(content);
    },
  } as unknown as VercelResponse;
});

test("Basic", async () => {
  endpoint({ headers: {} } as VercelRequest, response);

  expect(await jsonPromise).toEqual("No authorization token was found");
});
test("Bad secret", async () => {
  withHeader(JWT.sign({ hello: "world", aud: "authenticated" }, "BAD SECRET"));

  expect(await jsonPromise).toEqual("invalid signature");
});
test("Authed", async () => {
  jest.setTimeout(2000000);

  withHeader(JWT.sign({ hello: "world", aud: "authenticated" }, SECRET));

  expect(await jsonPromise).toEqual("OK");
});

function withHeader(header: string) {
  endpoint(
    {
      headers: {
        authorization: "Bearer " + header,
      },
    } as unknown as VercelRequest,
    response
  );
}
