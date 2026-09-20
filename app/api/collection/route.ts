import { addCategory, assignCategory, readCollection } from '@/db';
import { defaultCategories, normalizeCategory } from '@/lib/food-categories';
import food from '@/data/food.json';
import taiwanFood from '@/data/taiwan-food.json';

export const dynamic = 'force-dynamic';
const json = (body: unknown, status = 200) => Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
function identity(request: Request) { return request.headers.get('oai-authenticated-user-id'); }
function validOrigin(request: Request) {
  const origin = request.headers.get('origin');
  return origin === new URL(request.url).origin;
}
export async function GET(request: Request) {
  const user = identity(request);
  if (!user) return json({ error: '請先登入，再載入你的分類。' }, 401);
  try {
    const data = await readCollection(user);
    return json({ ...data, categories: [...defaultCategories, ...data.categories.filter(c => !defaultCategories.includes(c))] });
  } catch (error) {
    console.error('Read collection failed', error);
    return json({ error: '分類暫時無法載入，請重試。' }, 503);
  }
}
async function mutate(request: Request, assign: boolean) {
  const user = identity(request);
  if (!user) return json({ error: '請先登入，再儲存分類。' }, 401);
  if (!validOrigin(request)) return json({ error: '請從本站操作。' }, 403);
  let body: { category?: unknown; itemNumber?: unknown };
  try { body = await request.json() as typeof body; } catch { return json({ error: '資料格式不正確。' }, 400); }
  const name = normalizeCategory(body?.category);
  if (!name) return json({ error: '請輸入 1～30 字的分類名稱。' }, 400);
  if (name === '全部') return json({ error: '「全部」用於顯示所有店家，請選擇其他分類名稱。' }, 400);
  try {
    if (assign) {
      if (![...food.items, ...taiwanFood.items].some(item => item.number === body.itemNumber)) return json({ error: '找不到這筆店家。' }, 400);
      const current = await readCollection(user);
      if (![...defaultCategories, ...current.categories].includes(name)) return json({ error: '請先新增這個分類。' }, 400);
      await assignCategory(user, body.itemNumber as number, name);
    } else if (!defaultCategories.includes(name)) {
      await addCategory(user, name);
    }
    return json({ category: name });
  } catch (error) {
    console.error('Save category failed', error);
    return json({ error: '儲存失敗，請稍後重試。' }, 503);
  }
}
export const POST = (request: Request) => mutate(request, false);
export const PATCH = (request: Request) => mutate(request, true);
