export * from "./index";
import { VercelResponse, VercelRequest } from "@vercel/node";

declare module "@vercel/node/dist/index" {
  interface User {
    email: string;
    id: string;
  }

  interface VercelRequest {
    user?: User | undefined;
  }
}
