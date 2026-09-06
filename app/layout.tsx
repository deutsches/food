import type { Metadata } from 'next';
import Link from 'next/link';
import { Bookmark, Utensils, ShoppingBag } from 'lucide-react';
import './globals.css';
export const metadata: Metadata = {title:'口袋收藏｜美食與日本購物',description:'從 Threads 整理的美食地點、日本商品、圖片與原文來源。'};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="zh-Hant"><body><header className="topbar"><Link className="brand" href="/"><Bookmark size={24}/><strong>口袋收藏</strong></Link><span>把喜歡的，留給下一次出發。</span></header><div className="shell"><aside className="sidebar"><p className="eyebrow">MY COLLECTIONS</p><nav aria-label="收藏分類"><Link href="/"><Utensils size={18}/>美食收藏 <small>0</small></Link><Link href="/shopping"><ShoppingBag size={18}/>日本購物 <small>1</small></Link></nav><div className="side-note">來自 Threads 的口袋清單<br/>新增文章，直接貼到對話裡。</div></aside>{children}</div><footer>個人收藏筆記 · 整理於 2026.09.06</footer></body></html>}
