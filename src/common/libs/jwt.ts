import jwt from '@elysiajs/jwt';

export const jwtAccessToken = () =>
  jwt({
    name: 'jwt',
    secret: process.env.JWT_SECRET || 'a&jpVgF]4qOzK/RN:Gfhq3C58<QS&5',
    exp: '6h',
  });

export const jwtRefreshToken = () =>
  jwt({
    name: 'refreshJwt',
    secret:
      process.env.JWT_REFRESH_SECRET ||
      'S<+:ZXQ};Sdxef#ANN{pBcdK9yz0o=.NEORM=tT|~a@Hs@c21;$!&jAZkvj!',
    exp: '7d',
  });
