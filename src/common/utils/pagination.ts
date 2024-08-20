import { SQL } from 'drizzle-orm';
import { PgColumn, PgSelect } from 'drizzle-orm/pg-core';

const defaultPageSize = 10;

export async function withPagination<T extends PgSelect>(
  qb: T,
  orderByColumn: PgColumn | SQL | SQL.Aliased,
  page = 1,
  pageSize = defaultPageSize,
) {
  return qb
    .orderBy(orderByColumn)
    .limit(pageSize)
    .offset((page - 1) * pageSize);
}

export async function withPaginationMeta<T>(
  items: T[],
  totalItem: number,
  currentPage: number,
  pageSize: number = defaultPageSize,
) {
  return {
    items,
    meta: {
      totalItem,
      currentPage,
      pageSize,
      totalPage: Math.ceil(totalItem / pageSize),
    },
  };
}
