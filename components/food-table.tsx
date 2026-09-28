'use client';

import { useState } from 'react';
import { MapPin, ExternalLink, Search } from 'lucide-react';
import data from '@/data/food.json';
import taiwanData from '@/data/taiwan-food.json';
import { mapsLink } from '@/lib/food-categories';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function FoodTable() {
  const [filter, setFilter] = useState('全部');
  const [country, setCountry] = useState('台灣');
  const [query, setQuery] = useState('');
  const allItems = [
    ...data.items.map(item => ({ ...item, country: '日本', category: '燒肉', sourceUrl: `https://www.threads.com/@fattsai/post/${item.sourcePart}`, mapUrl: null as string | null })),
    ...taiwanData.items.map(item => ({ ...item, country: '台灣', sourceUrl: null as string | null })),
  ];
  const countryItems = allItems.filter(item => item.country === country);
  const categories = [...new Set(countryItems.map(item => item.category))];
  const items = countryItems.filter(item => (filter === '全部' || item.category === filter) && `${item.name} ${item.area} ${item.dishes}`.toLowerCase().includes(query.trim().toLowerCase()));
  return <main>
    <div className="page-heading"><div><p className="eyebrow">FOOD COLLECTION</p><h1>美食收藏</h1><p className="meta">想吃的店，慢慢收進口袋。</p></div><span className="count">{allItems.length} 筆店家</span></div>
    <div className="food-controls">
      <div className="country-tabs" aria-label="選擇國家">{['台灣', '日本'].map(name => <button key={name} type="button" aria-pressed={country === name} onClick={() => { setCountry(name); setFilter('全部'); setQuery(''); }}>{name}<span>{allItems.filter(item => item.country === name).length} 筆店家</span></button>)}</div>
      <div className="category-tabs" aria-label={`${country}的美食分類`}>{['全部', ...categories].map(category => <button key={category} type="button" aria-pressed={filter === category} onClick={() => setFilter(category)}>{category}<span>{category === '全部' ? countryItems.length : countryItems.filter(item => item.category === category).length}</span></button>)}</div>
      <div className="table-toolbar"><label className="food-search"><Search size={17} aria-hidden="true"/><Input aria-label="搜尋店名或地區" placeholder="搜尋店名、地區或餐點" value={query} onChange={e => setQuery(e.target.value)}/></label></div>
    </div>
    <div className="table-caption"><span>{country} / {filter} · {items.length} 筆</span><span>分類與店家資料來自 JSON</span></div>
    <div className="food-table"><Table><TableHeader><TableRow><TableHead>分類</TableHead><TableHead>店名 / 作者推薦</TableHead><TableHead>地區</TableHead><TableHead>Google Maps</TableHead><TableHead>出處</TableHead></TableRow></TableHeader><TableBody>
      {items.map(item => <TableRow key={item.number}>
        <TableCell><span className="category-label">{item.category}</span></TableCell>
        <TableCell className="shop-cell"><strong>{item.name}</strong>{item.dishes && <p>{item.dishes}</p>}{[18, 29].includes(item.number) && <small>原文第 18、29 筆可能為同店，待確認</small>}</TableCell>
        <TableCell><span className="area-label">{item.area || '待補'}</span></TableCell>
        <TableCell><a className="map-link" href={item.mapUrl || mapsLink(item.name, item.area, item.country)} target="_blank" rel="noreferrer"><MapPin size={15}/>{item.mapUrl ? '開啟地圖' : '搜尋地圖'}</a></TableCell>
        <TableCell>{item.sourceUrl ? <a className="source-link" aria-label={`${item.name}的 Threads 原文`} href={item.sourceUrl} target="_blank" rel="noreferrer"><ExternalLink size={15}/><span>原文</span></a> : <span className="area-label">直接記錄</span>}</TableCell>
      </TableRow>)}
      {!items.length && <TableRow><TableCell colSpan={5} className="food-empty">{query ? '沒有符合搜尋的店家。' : `「${filter}」還沒有店家。`}</TableCell></TableRow>}
    </TableBody></Table></div>
    <p className="meta map-note">店家、分類與地圖連結皆由 JSON 資料產生。</p>
    {country === '日本' && <details className="food-source"><summary>收藏來源 · {data.title} <span>@{data.author}</span></summary><p className="meta">{data.note}</p><a href={data.source} target="_blank" rel="noreferrer">查看 Threads 文章 ↗</a><a href="/images/tokyo-solo-yakiniku.jpg" target="_blank" rel="noreferrer"><img src="/images/tokyo-solo-yakiniku.jpg" alt="原文封面：東京一人燒肉 TOP 50"/></a></details>}
    {country === '台灣' && <p className="note">{taiwanData.note}</p>}
  </main>;
}
