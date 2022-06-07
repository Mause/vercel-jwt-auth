# vercel-jwt-auth

This provides a very simple function to wrap handlers in vercel, with jwt verification - the only parameter is the secret to verify the jwt

```typescript
import { factory, VercelRequestWithUser } from "vercel-jwt-auth";

const SECRET = "...";

export default factory(SECRET)((req: VercelRequestWithUser, res) => {
  console.log(req.user);
  res.status(200);
  res.json("OK");
});
```
