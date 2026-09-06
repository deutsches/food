import Link from 'next/link';
import { Utensils } from 'lucide-react';
export default function Home(){return <main><div className="page-heading"><div><p className="eyebrow">FOOD COLLECTION</p><h1>美食收藏</h1></div><span className="count">0 篇收藏</span></div><section className="empty"><Utensils size={42}/><h2>下一餐，從這裡開始。</h2><p>把想吃的 Threads 文章貼到對話裡，整理後就會出現在這裡。</p><Link href="/shopping">查看日本購物收藏 →</Link></section></main>}
