import { env } from 'cloudflare:workers';
function database() {
  const db = (env as unknown as { DB?: D1Database }).DB;
  if (!db) throw new Error('D1 DB unavailable');
  return db;
}
export async function readCollection(user: string) {
  const db = database();
  const result = await db.batch([
    db.prepare('SELECT name FROM categories WHERE user_id = ? ORDER BY rowid').bind(user),
    db.prepare('SELECT item_number, category FROM assignments WHERE user_id = ?').bind(user),
  ]);
  return {
    categories: (result[0].results as {name: string}[]).map(row => row.name),
    assignments: Object.fromEntries((result[1].results as {item_number: number; category: string}[]).map(row => [row.item_number, row.category])),
  };
}
export async function addCategory(user: string, name: string) {
  return database().prepare('INSERT INTO categories (user_id, name) VALUES (?, ?) ON CONFLICT DO NOTHING').bind(user, name).run();
}
export async function assignCategory(user: string, item: number, category: string) {
  return database().prepare('INSERT INTO assignments (user_id, item_number, category) VALUES (?, ?, ?) ON CONFLICT (user_id, item_number) DO UPDATE SET category = excluded.category').bind(user, item, category).run();
}
