import { Elysia, t } from 'elysia';
import { register } from './service';

export const registerHandler = (app: Elysia) =>
  app.group('register', (app) =>
    app.post(
      '/',
      async ({ body }) => {
        let name = body.name.trim();
        let email = body.email.trim();
        let password = body.password.trim();

        await register(name, email, password, body.image);

        return {
          message: "OK - Please wait for approval!",
          status: "pending",
        };
      },
      {
        type: "multipart/form-data",
        body: t.Object({
          name: t.String({
            examples : ["John Doe"],
          }),
          email: t.String({
            format: 'email',
            examples: ['admin@admin.com'],
          }),
          password: t.String({
            minLength: 8,
            examples: ['password'],
          }),
          image: t.Optional(t.File({
            maxSize: "2m",
            type: ["image"]
          })),
        }),
        response: t.Object({
          message: t.String(),
          status: t.String(),
        }),
        detail: {
          description: 'Register your account to the application',
          tags: ['Register'],
        },
      },
    ),
  );
