const CACHE='webhero-v49';
const CORE=['./','./index.html','./speech.js','./piper-worker.js','./manifest.json','./vendor/three.module.js','./vendor/GLTFLoader.js','./vendor/utils/BufferGeometryUtils.js','./vendor/utils/SkeletonUtils.js','./models/cat.glb','./models/hatch_spidey_3.glb','./models/rhino.glb','./models/venom.glb','./models/shocker.glb','./models/doctor-octopus-1994-tas.glb','./models/the-lizard-1994-tas.glb','./models/scorpion-1994-tas.glb','./models/green-goblin-1994-tas.glb','./icon-192.png','./icon-512.png'];

const VOICE_CACHE='piper-assets-v2';
const VOICE=['ort.wasm.min.js','ort-wasm-simd.wasm','ort-wasm.wasm','piper_phonemize.js','piper_phonemize.wasm','piper_phonemize.data','sv_SE-lisa-medium.onnx','sv_SE-lisa-medium.onnx.json'].map(n=>'./vendor/piper/'+n);
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('webhero-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
async function cacheVoice(){const cache=await caches.open(VOICE_CACHE);for(const url of VOICE){if(await cache.match(url))continue;try{await cache.add(url)}catch(error){console.warn('Voice offline cache failed',error)}}}
self.addEventListener('message',event=>{if(event.data?.type==='CACHE_TTS')event.waitUntil(cacheVoice())});
self.addEventListener('fetch',event=>{
if(event.request.method!=='GET'||new URL(event.request.url).origin!==location.origin)return;
const voice=new URL(event.request.url).pathname.includes('/vendor/piper/');
event.respondWith(caches.open(voice?VOICE_CACHE:CACHE).then(async cache=>{
const cached=await cache.match(event.request);if(cached)return cached;
const response=await fetch(event.request);
if(voice&&response.ok){try{await cache.put(event.request,response.clone())}catch(error){console.warn(error)}}
return response;
}));
});
