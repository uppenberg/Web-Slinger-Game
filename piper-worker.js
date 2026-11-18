/* Piper phonemization + ONNX inference run away from the rendering thread. */
importScripts('./vendor/piper/ort.wasm.min.js', './vendor/piper/piper_phonemize.js');
ort.env.wasm.wasmPaths = new URL('./vendor/piper/', self.location.href).href;
ort.env.wasm.numThreads = 1;
let engine, output, queue = Promise.resolve();
async function initialize() {
  const base = new URL('./vendor/piper/', self.location.href);
  const [model, config, phonemizer] = await Promise.all([
    fetch(new URL('sv_SE-lisa-medium.onnx', base)).then(r => { if (!r.ok) throw Error('Röstmodellen kunde inte laddas'); return r.arrayBuffer(); }),
    fetch(new URL('sv_SE-lisa-medium.onnx.json', base)).then(r => { if (!r.ok) throw Error('Röstinställningarna saknas'); return r.json(); }),
    createPiperPhonemize({locateFile: file => new URL(file, base).href,
      print: line => output.push(JSON.parse(line)), printErr: line => console.warn(line)})
  ]);
  const session = await ort.InferenceSession.create(model, {executionProviders: ['wasm']});
  return {session, config, phonemizer};
}
self.onmessage = ({data}) => {
  queue = queue.catch(() => {}).then(async () => {
    try {
      engine ||= initialize();
      const {session, config, phonemizer} = await engine;
      if (data.type === 'init') { postMessage({id: data.id, ready: true}); return; }
      output = [];
      phonemizer.callMain(['--espeak_data', '/espeak-ng-data', '--language', config.espeak.voice,
        '--input', JSON.stringify([{text: data.text}])]);
      const ids = output.flatMap(item => item.phoneme_ids);
      if (!ids.length) throw Error('Ingen uppläsning skapades');
      const sentences = []; let current = [];
      for (const id of ids) {
        current.push(id);
        if (id === config.phoneme_id_map['$'][0]) { sentences.push(current); current = []; }
      }
      if (current.length) sentences.push(current);
      const chunks = [], sampleRate = config.audio.sample_rate;
      for (const sentence of sentences) {
        const feeds = {
          input: new ort.Tensor('int64', BigInt64Array.from(sentence, BigInt), [1, sentence.length]),
          input_lengths: new ort.Tensor('int64', BigInt64Array.from([sentence.length], BigInt), [1]),
          scales: new ort.Tensor('float32', new Float32Array([config.inference.noise_scale, 1, config.inference.noise_w]), [3])
        };
        if (config.num_speakers > 1) feeds.sid = new ort.Tensor('int64', new BigInt64Array([0n]), [1]);
        const result = await session.run(feeds);
        chunks.push(new Float32Array(result.output.data), new Float32Array(Math.round(sampleRate * .18)));
      }
      const pcm = new Float32Array(chunks.reduce((n, chunk) => n + chunk.length, 0));
      let offset = 0;
      for (const chunk of chunks) { pcm.set(chunk, offset); offset += chunk.length; }
      postMessage({id: data.id, pcm, sampleRate}, [pcm.buffer]);
    } catch (error) { postMessage({id: data.id, error: error.message}); }
  });
};
