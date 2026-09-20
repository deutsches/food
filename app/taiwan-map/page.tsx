import { ExternalLink, MapPinned } from 'lucide-react';

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
  </main>;
}
