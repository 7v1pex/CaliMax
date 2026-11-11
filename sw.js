// CaliMax Service Worker: macht die App offline nutzbar.
const VERSION = 'calimax-v9';
const CORE = [
 "./",
 "index.html",
 "manifest.webmanifest",
 "icon-192.png",
 "icon-512.png",
 "icon-maskable-512.png",
 "apple-touch-icon.png",
 "videos/backlever.mp4",
 "videos/bench.mp4",
 "videos/bridge.mp4",
 "videos/calf.mp4",
 "videos/curl.mp4",
 "videos/dip.mp4",
 "videos/dragon.mp4",
 "videos/flag.mp4",
 "videos/fold.mp4",
 "videos/frontlever.mp4",
 "videos/handstand.mp4",
 "videos/hang.mp4",
 "videos/hinge.mp4",
 "videos/hollow.mp4",
 "videos/hspu.mp4",
 "videos/invrow.mp4",
 "videos/lateral.mp4",
 "videos/legraise.mp4",
 "videos/lsit.mp4",
 "videos/lunge.mp4",
 "videos/muscleup.mp4",
 "videos/nordic.mp4",
 "videos/ohpress.mp4",
 "videos/pistol.mp4",
 "videos/planche.mp4",
 "videos/plank.mp4",
 "videos/pullup.mp4",
 "videos/pushdown.mp4",
 "videos/pushup.mp4",
 "videos/rollout.mp4",
 "videos/row.mp4",
 "videos/sideplank.mp4",
 "videos/squat.mp4",
 "audio/backlever.mp3",
 "audio/bridge.mp3",
 "audio/calf.mp3",
 "audio/coach_10s.mp3",
 "audio/coach_done.mp3",
 "audio/coach_next.mp3",
 "audio/coach_on.mp3",
 "audio/coach_pause1.mp3",
 "audio/coach_pause2.mp3",
 "audio/coach_pause3.mp3",
 "audio/dip.mp3",
 "audio/dragon.mp3",
 "audio/flag.mp3",
 "audio/fold.mp3",
 "audio/frontlever.mp3",
 "audio/handstand.mp3",
 "audio/hang.mp3",
 "audio/hollow.mp3",
 "audio/hspu.mp3",
 "audio/invrow.mp3",
 "audio/legraise.mp3",
 "audio/lsit.mp3",
 "audio/lunge.mp3",
 "audio/muscleup.mp3",
 "audio/nordic.mp3",
 "audio/pistol.mp3",
 "audio/planche.mp3",
 "audio/plank.mp3",
 "audio/pullup.mp3",
 "audio/pushup.mp3",
 "audio/rollout.mp3",
 "audio/sideplank.mp3",
 "audio/squat.mp3"
];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(VERSION).then((c) => c.addAll(CORE)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== VERSION && k !== 'calimax-fonts').map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
async function rangeFrom(req, res) {
  const blob = await res.blob(); const m = /bytes=(\d+)-(\d*)/.exec(req.headers.get('range') || '');
  const start = m ? +m[1] : 0; const end = m && m[2] ? +m[2] : blob.size - 1;
  return new Response(blob.slice(start, end + 1), { status: 206, headers: { 'Content-Type': res.headers.get('Content-Type') || 'video/mp4', 'Content-Range': 'bytes ' + start + '-' + end + '/' + blob.size, 'Content-Length': String(end - start + 1), 'Accept-Ranges': 'bytes' } });
}
self.addEventListener('fetch', (e) => {
  const req = e.request; if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin === location.origin) {
    if (req.mode === 'navigate') { e.respondWith(fetch(req).then((r) => { const c = r.clone(); caches.open(VERSION).then((ca) => ca.put('index.html', c)); return r; }).catch(() => caches.match('index.html'))); return; }
    if (url.pathname.endsWith('.mp3')) { e.respondWith(caches.match('audio/' + url.pathname.split('/').pop()).then((hit) => hit ? (req.headers.get('range') ? rangeFrom(req, hit) : hit) : fetch(req))); return; }
    if (url.pathname.endsWith('.mp4')) { e.respondWith(caches.match('videos/' + url.pathname.split('/').pop()).then((hit) => hit ? (req.headers.get('range') ? rangeFrom(req, hit) : hit) : fetch(req))); return; }
    e.respondWith(caches.match(req, { ignoreSearch: true }).then((hit) => hit || fetch(req).then((r) => { if (r.ok) { const c = r.clone(); caches.open(VERSION).then((ca) => ca.put(req, c)); } return r; })));
    return;
  }
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith(caches.open('calimax-fonts').then((ca) => ca.match(req).then((hit) => { const net = fetch(req).then((r) => { ca.put(req, r.clone()); return r; }).catch(() => hit); return hit || net; })));
  }
});
