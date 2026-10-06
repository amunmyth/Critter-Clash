const CACHE="critterclash-v29";
const SHELL=["./","index.html","manifest.webmanifest","icon-180.png","icon-192.png","icon-512.png","three.min.js"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  const r=e.request;if(r.method!=="GET")return;const u=new URL(r.url);
  const cacheable=u.origin===location.origin||/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname)||(u.hostname==="cdn.jsdelivr.net"&&u.pathname.includes("peerjs"));
  if(!cacheable)return;
  // network first for the app page (gets updates), cache first for the rest
  if(u.origin===location.origin&&(u.pathname.endsWith("/")||u.pathname.endsWith("index.html"))){
    e.respondWith(fetch(r).then(res=>{const c=res.clone();caches.open(CACHE).then(x=>x.put(r,c));return res}).catch(()=>caches.match(r,{ignoreSearch:true}).then(h=>h||caches.match("index.html"))));return;
  }
  e.respondWith(caches.match(r,{ignoreSearch:true}).then(hit=>hit||fetch(r).then(res=>{if(res.ok||res.type==="opaque"){const c=res.clone();caches.open(CACHE).then(x=>x.put(r,c))}return res})));
});
