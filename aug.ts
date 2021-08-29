declare module "@vercel/node/dist" {
  interface User {
    email: string;
    id: string;
  }

  interface VercelRequest {
    user?: User | undefined;
  }
}
