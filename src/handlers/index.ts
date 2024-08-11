import Elysia, { NotFoundError } from 'elysia';
import { userHandler } from './users/handler';

const controllers = new Elysia().use(userHandler);

export default controllers;
