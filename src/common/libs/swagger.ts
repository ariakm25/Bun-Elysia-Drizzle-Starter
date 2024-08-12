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
      components: {
        securitySchemes: {
          JwtAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            description: 'Enter JWT Bearer token **_only_**',
          },
        },
      },
    },
    autoDarkMode: true,
    swaggerOptions: {
      persistAuthorization: true,
      withCredentials: true,
    },
  });

export default swagger;
