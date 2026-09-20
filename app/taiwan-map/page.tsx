import { ExternalLink, MapPinned } from 'lucide-react';
import taiwanData from '@/data/taiwan-food.json';
import { mapsLink } from '@/lib/food-categories';

const mapUrl = 'https://www.google.com/maps/d/u/0/embed?mid=1KZokWdLRiUDhVebZ33SfPtQTZdi6k7U&ehbc=2E312F';
const editUrl = 'https://www.google.com/maps/d/u/0/edit?hl=zh-TW&mid=1KZokWdLRiUDhVebZ33SfPtQTZdi6k7U';

export default function TaiwanMapPage() {
  return <main>
    <div className="page-heading map-heading">
      <div><p className="eyebrow">TAIWAN FOOD MAP</p><h1>台灣美食地圖</h1><p className="meta">在地圖上查看收藏的台灣店家。</p></div>
      <a className="map-open" href={editUrl} target="_blank" rel="noreferrer"><MapPinned size={17}/>在 My Maps 開啟<ExternalLink size={14}/></a>
    </div>
    <section className="mymap-card" aria-label="台灣美食 Google My Maps">
      <iframe src={mapUrl} title="台灣美食收藏地圖" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
    </section>
    <p className="meta map-help">地圖內容由 Google My Maps 提供；在 My Maps 更新後，這一頁也會顯示最新內容。</p>
    <section className="map-directory">
      <div className="section-title"><h2>台灣店家清單</h2><span>{taiwanData.items.length} 筆 · 地址待補</span></div>
      <div className="map-directory-grid">{['拉麵', '漢堡'].map(category => <div className="map-directory-group" key={category}><h3>{category}</h3>{taiwanData.items.filter(item => item.category === category).map(item => <a key={item.number} href={item.mapUrl || mapsLink(item.name, item.area, taiwanData.country)} target="_blank" rel="noreferrer"><span>{item.name}</span><small>{item.mapUrl ? '已定位 ↗' : '搜尋位置 ↗'}</small></a>)}</div>)}</div>
      <p className="meta">目前只有店名與分類，尚未放入 My Maps 標記；有地址後再定位，避免標到錯誤店家。</p>
    </section>
  </main>;
}
