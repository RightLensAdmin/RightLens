const CACHE='rightlens-v4-install';
const CORE=['/verses.json','/rvu.json','/names.json','/hero.jpg','/icon-192.png','/icon-512.png','/manifest.json'];
self.addEventListener('install',event=>event.waitUntil((async()=>{
 const cache=await caches.open(CACHE);
 const page=await fetch('/',{cache:'reload'});
 if(!page.ok)throw Error('App shell unavailable');
 const html=await page.clone().text();
 const assets=[...html.matchAll(/(?:src|href)=["'](\/assets\/[^"']+)["']/g)].map(m=>m[1]);
 if(!assets.some(a=>a.endsWith('.js')))throw Error('Compiled app unavailable');
 await cache.addAll([...CORE,...new Set(assets)]);
 await cache.put('/',page);
 await self.skipWaiting();
})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{
 for(const key of await caches.keys())if(key.startsWith('rightlens-')&&key!==CACHE)await caches.delete(key);
 await self.clients.claim();
})()));
self.addEventListener('fetch',event=>{
 const req=event.request,url=new URL(req.url);
 if(req.method!=='GET'||url.origin!==self.location.origin||url.pathname.startsWith('/api/'))return;
 if(req.mode!=='navigate'&&!CORE.includes(url.pathname)&&!url.pathname.startsWith('/assets/')&&!url.pathname.startsWith('/bible/'))return;
 event.respondWith((async()=>{
 const cache=await caches.open(CACHE);
 try{const res=await fetch(req);if(res.ok&&res.type==='basic'&&req.mode!=='navigate'){try{await cache.put(req,res.clone())}catch{}}return res}catch{ return (await cache.match(req))||(req.mode==='navigate'?await cache.match('/'):null)||Response.error() }
 })());
});
