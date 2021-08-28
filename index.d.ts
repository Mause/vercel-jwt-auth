export * from "./index";
import { VercelResponse } from "@vercel/node";

declare module "@vercel/node" {
  interface User {
    email: string;
    id: string;
  }

  interface VercelRequest {
    user?: User | undefined;
  }
}
