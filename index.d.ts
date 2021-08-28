export * from "vercel-jwt-auth";

declare module "@vercel/node" {
  export * from "@vercel/node";
  interface User {
    email: string;
    id: string;
  }

  interface VercelRequest {
    user?: User | undefined;
  }
}
