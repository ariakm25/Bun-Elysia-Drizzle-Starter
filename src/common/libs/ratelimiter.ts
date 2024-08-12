import { rateLimit } from 'elysia-rate-limit';

const rateLimiter = () =>
  rateLimit({
    max: 15,
    duration: 10 * 1000,
    generator: (req, server) =>
      req.headers.get('CF-Connecting-IP') ??
      server?.requestIP(req)?.address ??
      '',
  });

export default rateLimiter;
