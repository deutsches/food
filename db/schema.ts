import { sqliteTable, text, integer, primaryKey } from 'drizzle-orm/sqlite-core';

export const categories = sqliteTable('categories', {
  userId: text('user_id').notNull(),
  name: text('name').notNull(),
}, table => [primaryKey({ columns: [table.userId, table.name] })]);

export const assignments = sqliteTable('assignments', {
  userId: text('user_id').notNull(),
  itemNumber: integer('item_number').notNull(),
  category: text('category').notNull(),
}, table => [primaryKey({ columns: [table.userId, table.itemNumber] })]);
