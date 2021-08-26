declare global {
  module "@vercel/node" {
    // tslint:disable-next-line:no-empty-interface
    interface User {}

    interface VercelRequest {
      user?: User | undefined;
    }
  }
}
