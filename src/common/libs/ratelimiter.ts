import { rateLimit } from 'elysia-rate-limit';

const rateLimiter = () =>
  rateLimit({
    max: 15,
    duration: 10 * 1000,
    generator: (req, server) =>
      req.headers.get('CF-Connecting-IP') ??
      server?.requestIP(req)?.address ??
      '',
    skip(req, key) {
      const whitelist = ['/bullboard'];

      return whitelist.some((path) => req.url.includes(path));
    },
  });

export default rateLimiter;
