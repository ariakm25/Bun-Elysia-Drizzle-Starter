import { swagger as primitiveSwagger } from '@elysiajs/swagger';

const swagger = () =>
  primitiveSwagger({
    path: '/docs',
    exclude: ['/docs', '/docs/json', '/', '/health'],
    documentation: {
      info: {
        title: 'Elysia API',
        description: 'API documentation for Elysia API',
        version: '0.0.0',
      },
      tags: [
        {
          name: 'User',
          description: 'User related endpoints',
        },
      ],
    },
    autoDarkMode: true,
    swaggerOptions: {
      persistAuthorization: true,
      withCredentials: true,
    },
  });

export default swagger;
