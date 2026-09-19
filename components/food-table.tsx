'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { MapPin, Plus, ExternalLink, Search } from 'lucide-react';
import data from '@/data/food.json';
import { defaultCategories, mapsLink } from '@/lib/food-categories';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NativeSelect } from '@/components/ui/native-select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

async function api(method = 'GET', body?: unknown) {
  const response = await fetch('/api/collection', { method, headers: { 'Content-Type': 'application/json' }, ...(body ? { body: JSON.stringify(body) } : {}) });
  const result = await response.json() as { error?: string; categories: string[]; assignments: Record<string, string>; category: string };
  if (!response.ok) throw new Error(result.error || '暫時無法儲存，請重試。');
  return result;
}
export default function FoodTable() {
  const [categories, setCategories] = useState(defaultCategories);
  const [assignments, setAssignments] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState('全部');
  const [country, setCountry] = useState('日本');
  const [query, setQuery] = useState('');
  const [draft, setDraft] = useState('');
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  async function load() {
    setError('');
    try {
      const result = await api();
      setCategories(result.categories); setAssignments(result.assignments); setReady(true);
    } catch (err) { setError((err as Error).message); }
  }
  useEffect(() => { void load(); }, []);
  async function create(event: FormEvent) {
    event.preventDefault(); setBusy(true); setError(''); setMessage('');
    try {
      const result = await api('POST', { category: draft });
      setCategories(current => current.includes(result.category) ? current : [...current, result.category]);
      setDraft(''); setMessage(`「${result.category}」已可使用，請在店家列選取分類。`);
    } catch (err) { setError((err as Error).message); }
    finally { setBusy(false); }
  }
  async function change(itemNumber: number, category: string) {
    setBusy(true); setError(''); setMessage('');
    try {
      await api('PATCH', { itemNumber, category });
      setAssignments(current => ({ ...current, [itemNumber]: category }));
      setMessage('店家分類已儲存。');
    } catch (err) { setError((err as Error).message); }
    finally { setBusy(false); }
  }
  const categoryOf = (number: number) => assignments[number] || '燒肉';
  const countryItems = data.items.filter(() => data.country === country);
  const items = countryItems.filter(item => (filter === '全部' || categoryOf(item.number) === filter) && `${item.name} ${item.area} ${item.dishes}`.toLowerCase().includes(query.trim().toLowerCase()));
  return <main>
    <div className="page-heading"><div><p className="eyebrow">FOOD COLLECTION</p><h1>美食收藏</h1><p className="meta">想吃的店，慢慢收進口袋。</p></div><span className="count">{data.items.length} 筆店家</span></div>
    <div className="food-controls">
      <div className="country-tabs" aria-label="選擇國家">{['台灣', '日本'].map(name => <button key={name} type="button" aria-pressed={country === name} onClick={() => { setCountry(name); setFilter('全部'); setQuery(''); }}>{name}<span>{data.country === name ? data.items.length : 0} 筆店家</span></button>)}</div>
      <div className="category-tabs" aria-label={`${country}的美食分類`}>{['全部', ...categories].map(category => <button key={category} type="button" aria-pressed={filter === category} onClick={() => setFilter(category)}>{category}<span>{category === '全部' ? countryItems.length : countryItems.filter(item => categoryOf(item.number) === category).length}</span></button>)}</div>
      <div className="table-toolbar"><label className="food-search"><Search size={17} aria-hidden="true"/><Input aria-label="搜尋店名或地區" placeholder="搜尋店名、地區或餐點" value={query} onChange={e => setQuery(e.target.value)}/></label>
        <form className="category-form" onSubmit={create}><Input aria-label="新分類名稱" placeholder="新增分類，例如：拉麵" value={draft} maxLength={30} onChange={e => setDraft(e.target.value)} disabled={!ready || busy}/><Button type="submit" disabled={!ready || busy || !draft.trim()}><Plus size={16}/>{busy ? '儲存中' : '新增分類'}</Button></form>
      </div>
      {!ready && !error && <p className="meta" role="status">正在載入你的分類…</p>}
      {error && <p className="food-error" role="alert">{error} {!ready && <Button variant="outline" onClick={load}>重試</Button>}</p>}
      <p className="food-feedback" role="status">{message}</p>
    </div>
    <div className="table-caption"><span>{country} / {filter} · {items.length} 筆</span><span>可直接更換每家店的分類</span></div>
    <div className="food-table"><Table><TableHeader><TableRow><TableHead>分類</TableHead><TableHead>店名 / 作者推薦</TableHead><TableHead>地區</TableHead><TableHead>Google Maps</TableHead><TableHead>出處</TableHead></TableRow></TableHeader><TableBody>
      {items.map(item => <TableRow key={item.number}>
        <TableCell><NativeSelect aria-label={`${item.name}的分類（第 ${item.number} 筆）`} value={categoryOf(item.number)} disabled={!ready || busy} onChange={e => void change(item.number, e.target.value)}>{categories.map(category => <option key={category}>{category}</option>)}</NativeSelect></TableCell>
        <TableCell className="shop-cell"><strong>{item.name}</strong><p>{item.dishes}</p>{[18, 29].includes(item.number) && <small>原文第 18、29 筆可能為同店，待確認</small>}</TableCell>
        <TableCell><span className="area-label">{item.area}</span></TableCell>
        <TableCell><a className="map-link" href={mapsLink(item.name, item.area)} target="_blank" rel="noreferrer"><MapPin size={15}/>開啟地圖</a></TableCell>
        <TableCell><a className="source-link" aria-label={`${item.name}的 Threads 原文`} href={'https://www.threads.com/@fattsai/post/' + item.sourcePart} target="_blank" rel="noreferrer"><ExternalLink size={15}/><span>原文</span></a></TableCell>
      </TableRow>)}
      {!items.length && <TableRow><TableCell colSpan={5} className="food-empty">{!countryItems.length ? `${country}還沒有收藏。貼上文章後，就能把店家收進這裡。` : query ? '沒有符合搜尋的店家。' : `「${filter}」還沒有店家。可以從「全部」裡更換店家分類。`}</TableCell></TableRow>}
    </TableBody></Table></div>
    <p className="meta map-note">地圖連結以原文店名與地區搜尋，尚未核對店家位置。</p>
    {countryItems.length > 0 && <details className="food-source"><summary>收藏來源 · {data.title} <span>@{data.author}</span></summary><p className="meta">{data.note}</p><a href={data.source} target="_blank" rel="noreferrer">查看 Threads 文章 ↗</a><a href="/images/tokyo-solo-yakiniku.jpg" target="_blank" rel="noreferrer"><img src="/images/tokyo-solo-yakiniku.jpg" alt="原文封面：東京一人燒肉 TOP 50"/></a></details>}
  </main>;
}
