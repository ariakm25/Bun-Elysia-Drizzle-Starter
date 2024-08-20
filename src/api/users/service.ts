import { and, asc, count, getTableColumns, ilike, or, SQL } from 'drizzle-orm';
import {
  withPagination,
  withPaginationMeta,
} from '../../common/utils/pagination';
import { db } from '../../db';
import { UserSchema } from '../../db/schemas/user/user.schema';
import { PgSelect } from 'drizzle-orm/pg-core';

export const getUsers = async ({
  page = 1,
  pageSize,
  email,
  name,
}: {
  page?: number;
  pageSize?: number;
  name?: string;
  email?: string;
}) => {
  function buildQuery<T extends PgSelect>(qb: T) {
    const filters: SQL[] = [];

    if (name) {
      filters.push(ilike(UserSchema.name, `%${name}%`));
    }

    if (email) {
      filters.push(ilike(UserSchema.email, `%${email}%`));
    }

    return qb.where(or(...filters));
  }

  const { password, ...otherColumns } = getTableColumns(UserSchema); // exclude password column
  const qUser = buildQuery(db.select(otherColumns).from(UserSchema).$dynamic());
  const qUserCount = buildQuery(
    db
      .select({
        count: count(),
      })
      .from(UserSchema)
      .$dynamic(),
  );

  const [items, total] = await Promise.all([
    withPagination(qUser, asc(UserSchema.createdAt), page, pageSize),
    qUserCount,
  ]);

  return withPaginationMeta(items, total[0].count, page, pageSize);
};
