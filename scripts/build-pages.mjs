import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'docs');
const read = name => JSON.parse(fs.readFileSync(path.join(root, 'data', name), 'utf8'));
const food = read('food.json');
const taiwan = read('taiwan-food.json');
const shopping = read('collection.json').posts[0];
const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const base = '/food';

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, '.nojekyll'), '');

function layout(title, active, content, extra = '') {
  const links = [
    ['food', `${base}/`, '美食收藏'],
    ['map', `${base}/taiwan-map/`, '台灣地圖'],
    ['shopping', `${base}/shopping/`, '日本購物'],
  ];
  return `<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title><link rel="stylesheet" href="${base}/style.css"></head><body><header><a class="brand" href="${base}/">♡ 口袋收藏</a><span>把喜歡的，留給下一次出發。</span></header><div class="shell"><aside><p class="eyebrow">MY COLLECTIONS</p><nav>${links.map(([key, href, label]) => `<a class="${key === active ? 'active' : ''}" href="${href}">${label}</a>`).join('')}</nav><p class="side-note">資料來源為專案中的 JSON 檔案。<br>更新後推送，即會重新發布。</p></aside><main>${content}</main></div><footer>個人收藏筆記 · JSON 靜態網站</footer>${extra}</body></html>`;
}

const japanItems = food.items.map(item => ({ ...item, country: '日本', category: '燒肉', mapUrl: '', sourceUrl: `https://www.threads.com/@fattsai/post/${item.sourcePart}` }));
const taiwanItems = taiwan.items.map(item => ({ ...item, country: '台灣', sourceUrl: '' }));
const allItems = [...taiwanItems, ...japanItems];
const dataJson = JSON.stringify(allItems).replace(/</g, '\\u003c');
const home = layout('口袋收藏｜美食與日本購物', 'food', `
  <div class="page-heading"><div><p class="eyebrow">FOOD COLLECTION</p><h1>美食收藏</h1><p class="meta">想吃的店，慢慢收進口袋。</p></div><span class="count">${allItems.length} 筆店家</span></div>
  <section id="collection-app">
    <div class="country-tabs"><button data-country="台灣" class="active">台灣 <small>${taiwanItems.length} 筆</small></button><button data-country="日本">日本 <small>${japanItems.length} 筆</small></button></div>
    <div class="category-tabs" id="category-tabs"></div>
    <label class="search"><span>⌕</span><input id="search" type="search" placeholder="搜尋店名、地區或餐點"></label>
    <p class="meta" id="result-count"></p>
    <div class="table-wrap"><table><thead><tr><th>分類</th><th>店名 / 作者推薦</th><th>地區</th><th>Google Maps</th><th>出處</th></tr></thead><tbody id="rows"></tbody></table></div>
  </section>`, `<script>window.COLLECTION_DATA=${dataJson}</script><script src="${base}/app.js"></script>`);

const categories = [...new Set(taiwan.items.map(item => item.category))];
const mapGroups = categories.map(category => `<section class="directory-group"><h2>${esc(category)}</h2>${taiwan.items.filter(item => item.category === category).map(item => `<a href="${esc(item.mapUrl)}" target="_blank" rel="noreferrer"><span>${esc(item.name)}</span><small>已定位 ↗</small></a>`).join('')}</section>`).join('');
const mapPage = layout('台灣美食地圖｜口袋收藏', 'map', `
  <div class="page-heading"><div><p class="eyebrow">TAIWAN FOOD MAP</p><h1>台灣美食地圖</h1><p class="meta">在地圖上查看收藏的台灣店家。</p></div><a class="primary" href="https://www.google.com/maps/d/viewer?hl=zh-TW&mid=1KZokWdLRiUDhVebZ33SfPtQTZdi6k7U" target="_blank" rel="noreferrer">在 My Maps 開啟 ↗</a></div>
  <section class="map-card"><iframe src="https://www.google.com/maps/d/u/0/embed?mid=1KZokWdLRiUDhVebZ33SfPtQTZdi6k7U&ehbc=2E312F" title="台灣美食收藏地圖" loading="lazy" allowfullscreen></iframe></section>
  <p class="meta">地圖由 Google My Maps 提供。</p><div class="section-title"><h2>台灣店家清單</h2><span>${taiwan.items.length} 筆</span></div><div class="directory">${mapGroups}</div>`);

const products = shopping.products.map(product => `<article class="product"><img src="${base}/images/${esc(product.image)}.jpg" alt="${esc(product.name)}"><div><h3>${esc(product.name)}</h3><p class="meta">${esc(product.japanese)}</p></div></article>`).join('');
const shoppingPage = layout('日本購物｜口袋收藏', 'shopping', `
  <div class="page-heading"><div><p class="eyebrow">JAPAN SHOPPING</p><h1>日本購物</h1></div><span class="count">1 篇收藏</span></div>
  <section class="feature"><img src="${base}/images/77985785f5c8d7f0.jpg" alt="茅乃舍商品合照"><div><p class="eyebrow">日本必買</p><h2>茅乃舍，把日式高湯帶回家</h2><p class="meta">來自 @${esc(shopping.author)} · 收錄 ${esc(shopping.savedAt)}</p><p>${esc(shopping.summary)}</p><a href="${esc(shopping.source)}" target="_blank" rel="noreferrer">查看 Threads 原文 ↗</a></div></section>
  <div class="section-title"><h2>文章裡的商品</h2><span>${shopping.products.length} 個品項</span></div><div class="products">${products}</div>`);

const css = `:root{font-family:Arial,'Microsoft JhengHei',sans-serif;color:#182b35;background:#f5f7fa;line-height:1.7;--primary:#174d66;--border:#dbe2e7}*{box-sizing:border-box}body{margin:0}a{color:var(--primary);text-underline-offset:4px}header{height:88px;background:#fff;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;padding:0 5%}.brand{text-decoration:none;font-size:1.3rem;font-weight:700}.shell{display:grid;grid-template-columns:230px minmax(0,1fr);max-width:1560px;margin:auto}aside{padding:44px 22px;border-right:1px solid var(--border)}nav{display:grid;gap:5px}nav a{padding:13px 12px;border-radius:8px;text-decoration:none}nav a:hover,nav a.active{background:#e4edf2}.side-note{border-top:1px solid var(--border);margin-top:50px;padding-top:20px;color:#64747e;font-size:.875rem}main{padding:42px 32px;min-width:0;min-height:78vh}.eyebrow{color:#597482;letter-spacing:.12em;font-size:.875rem;font-weight:700;margin:0 0 8px}.meta{font-size:.875rem;color:#536873}.page-heading,.section-title{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:28px}h1{font-size:2.4rem;letter-spacing:-.04em;margin:0}h2{line-height:1.4}.count{border:1px solid #c9d8df;border-radius:30px;padding:5px 14px;font-size:.875rem}.country-tabs,.category-tabs{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:22px}.country-tabs button,.category-tabs button{border:1px solid var(--border);background:#fff;border-radius:24px;padding:10px 18px;cursor:pointer}.country-tabs button{border-radius:10px;min-width:150px;font-size:17px}.country-tabs button.active,.category-tabs button.active{background:var(--primary);color:#fff;border-color:var(--primary)}button small{margin-left:14px}.search{display:flex;align-items:center;gap:9px;max-width:360px}.search input{width:100%;height:40px;border:1px solid #b8c6cd;border-radius:7px;padding:0 12px;background:#fff}.table-wrap{overflow:auto;background:#fff;border:1px solid var(--border);border-radius:12px}table{width:100%;border-collapse:collapse;min-width:760px}th{background:#eaf0f3;color:#526873;font-size:12px;text-align:left;padding:12px 16px}td{padding:15px 16px;border-top:1px solid #edf0f2;vertical-align:top}.tag{display:inline-flex;padding:4px 10px;border-radius:99px;background:#eaf2f6;color:var(--primary);font-size:12px;font-weight:700}.map-link{display:inline-block;background:#edf4f7;padding:6px 9px;border-radius:6px;text-decoration:none}.primary{background:var(--primary);color:#fff;padding:9px 14px;border-radius:8px;text-decoration:none}.map-card{height:calc(100vh - 260px);min-height:520px;border:1px solid var(--border);border-radius:12px;overflow:hidden;background:#fff}.map-card iframe{width:100%;height:100%;border:0}.directory{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}.directory-group{background:#fff;border:1px solid var(--border);border-radius:10px;padding:18px}.directory-group a{display:flex;justify-content:space-between;gap:12px;padding:10px 0;border-top:1px solid #edf0f2;text-decoration:none}.feature{display:grid;grid-template-columns:260px 1fr;background:#fff;border:1px solid var(--border);border-radius:12px;overflow:hidden;margin-bottom:30px}.feature>img{width:100%;height:100%;max-height:360px;object-fit:cover}.feature>div{padding:28px}.products{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px}.product{background:#fff;border:1px solid var(--border);border-radius:10px;overflow:hidden}.product img{width:100%;height:210px;object-fit:contain;background:#edf0f2}.product div{padding:0 18px 16px}footer{text-align:center;border-top:1px solid var(--border);padding:20px;color:#64747e;font-size:.875rem}@media(max-width:680px){header{height:70px}header>span,.side-note,aside>.eyebrow{display:none}.shell{display:block}aside{padding:8px 12px;border-right:0;border-bottom:1px solid var(--border)}nav{display:flex;overflow:auto}nav a{white-space:nowrap}main{padding:26px 16px}.page-heading{align-items:flex-start;flex-direction:column}h1{font-size:2rem}.country-tabs button{flex:1;min-width:0}.map-card{height:65vh;min-height:440px}.directory,.products{grid-template-columns:1fr}.feature{grid-template-columns:1fr}.feature>img{height:230px}}`;

const appJs = `(()=>{const root=document.querySelector('#collection-app');if(!root)return;const data=window.COLLECTION_DATA;let country='台灣',category='全部',query='';const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));const maps=i=>i.mapUrl||'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent([i.name,i.area,i.country].filter(Boolean).join(' '));function render(){const base=data.filter(i=>i.country===country),cats=[...new Set(base.map(i=>i.category))],shown=base.filter(i=>(category==='全部'||i.category===category)&&([i.name,i.area,i.dishes].join(' ').toLowerCase().includes(query.toLowerCase())));document.querySelectorAll('[data-country]').forEach(b=>b.classList.toggle('active',b.dataset.country===country));document.querySelector('#category-tabs').innerHTML=['全部',...cats].map(c=>'<button class="'+(c===category?'active':'')+'" data-category="'+esc(c)+'">'+esc(c)+' <small>'+base.filter(i=>c==='全部'||i.category===c).length+'</small></button>').join('');document.querySelector('#result-count').textContent=country+' / '+category+' · '+shown.length+' 筆';document.querySelector('#rows').innerHTML=shown.length?shown.map(i=>'<tr><td><span class="tag">'+esc(i.category)+'</span></td><td><strong>'+esc(i.name)+'</strong>'+(i.dishes?'<div class="meta">'+esc(i.dishes)+'</div>':'')+'</td><td>'+esc(i.area||'待補')+'</td><td><a class="map-link" target="_blank" rel="noreferrer" href="'+esc(maps(i))+'">開啟地圖 ↗</a></td><td>'+(i.sourceUrl?'<a target="_blank" rel="noreferrer" href="'+esc(i.sourceUrl)+'">原文 ↗</a>':'直接記錄')+'</td></tr>').join(''):'<tr><td colspan="5">沒有符合的店家。</td></tr>'}root.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.country){country=b.dataset.country;category='全部';query='';document.querySelector('#search').value=''}if(b.dataset.category)category=b.dataset.category;render()});document.querySelector('#search').addEventListener('input',e=>{query=e.target.value;render()});render()})();`;

fs.writeFileSync(path.join(out, 'index.html'), home);
fs.writeFileSync(path.join(out, 'style.css'), css);
fs.writeFileSync(path.join(out, 'app.js'), appJs);
for (const [folder, html] of [['taiwan-map', mapPage], ['shopping', shoppingPage]]) {
  fs.mkdirSync(path.join(out, folder), { recursive: true });
  fs.writeFileSync(path.join(out, folder, 'index.html'), html);
}
fs.cpSync(path.join(root, 'public', 'images'), path.join(out, 'images'), { recursive: true });
console.log(`GitHub Pages built: ${allItems.length} restaurants, ${shopping.products.length} products.`);
