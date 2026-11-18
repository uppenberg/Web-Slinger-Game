"""Download the pinned browser runtimes and Swedish voice bundled with the game."""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
import hashlib
import io
import json
import tarfile
import urllib.request

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / 'vendor' / 'piper'
DEST.mkdir(parents=True, exist_ok=True)

def get(url):
    with urllib.request.urlopen(url, timeout=180) as response:
        return response.read()

def package(url, files):
    with tarfile.open(fileobj=io.BytesIO(get(url))) as archive:
        for source, target in files.items():
            (DEST / target).write_bytes(archive.extractfile(source).read())

def voice():
    base = 'https://huggingface.co/rhasspy/piper-voices/resolve/main/sv/sv_SE/nst/medium/'
    for name in ['sv_SE-lisa-medium.onnx', 'sv_SE-lisa-medium.onnx.json', 'MODEL_CARD']:
        if (DEST / name).exists():
            continue
        (DEST / name).write_bytes(get(base + name))

def licenses():
    for name, url in {
        'PIPER-PHONEMIZE-LICENSE.md': 'https://raw.githubusercontent.com/rhasspy/piper-phonemize/master/LICENSE.md',
        'ESPEAK-NG-LICENSE': 'https://raw.githubusercontent.com/espeak-ng/espeak-ng/master/COPYING',
    }.items():
        (DEST / name).write_bytes(get(url))

with ThreadPoolExecutor(max_workers=4) as pool:
    tasks = [
        pool.submit(package, 'https://registry.npmjs.org/@diffusionstudio/piper-wasm/-/piper-wasm-1.0.0.tgz', {
            'package/build/piper_phonemize.' + ext: 'piper_phonemize.' + ext for ext in ['js', 'wasm', 'data']
        }),
        pool.submit(package, 'https://registry.npmjs.org/onnxruntime-web/-/onnxruntime-web-1.17.3.tgz', {
            'package/dist/ort.wasm.min.js': 'ort.wasm.min.js',
            'package/dist/ort-wasm-simd.wasm': 'ort-wasm-simd.wasm',
            'package/dist/ort-wasm.wasm': 'ort-wasm.wasm',
        }),
        pool.submit(voice), pool.submit(licenses),
    ]
    for task in tasks:
        task.result()
manifest = {p.name: hashlib.sha256(p.read_bytes()).hexdigest() for p in DEST.iterdir() if p.is_file() and p.name != 'SHA256.json'}
(DEST / 'SHA256.json').write_text(json.dumps(manifest, indent=2) + '\n', encoding='utf-8')
print('Downloaded Piper assets:', sum(p.stat().st_size for p in DEST.iterdir() if p.is_file()), 'bytes')
