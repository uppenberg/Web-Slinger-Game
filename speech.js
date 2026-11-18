// All dialogue uses the bundled Swedish Piper model; browser speech is a fallback.
export function createSpeech(onStatus = () => {}) {
  let worker, ready, context, source, revision = 0, nextId = 0, failed = false;
  const pending = new Map(), samples = new Map();
  function request(message) {
    return new Promise((resolve, reject) => {
      const id = ++nextId;
      const timer = setTimeout(() => { pending.delete(id); reject(Error('Rösten tog för lång tid att starta')); }, 120000);
      pending.set(id, {resolve, reject, timer});
      worker.postMessage({...message, id});
    });
  }
  function fail(error) {
    failed = true;
    worker?.terminate();
    for (const item of pending.values()) { clearTimeout(item.timer); item.reject(error); }
    pending.clear();
    onStatus('Reservröst används – Piper kunde inte starta.');
    console.warn('Piper:', error);
  }
  function init() {
    return ready ||= (async () => {
      onStatus('Laddar svensk röst…');
      worker = new Worker(new URL('./piper-worker.js', import.meta.url));
      worker.onmessage = ({data}) => {
        const item = pending.get(data.id);
        if (!item) return;
        pending.delete(data.id); clearTimeout(item.timer);
        if (data.error) item.reject(Error(data.error)); else item.resolve(data);
      };
      worker.onerror = event => fail(Error(event.message || 'Röstmotorn kunde inte starta'));
      await request({type: 'init'});
      onStatus('Svensk röst: Piper');
    })().catch(error => { fail(error); });
  }
  function unlock() {
    context ||= new (window.AudioContext || window.webkitAudioContext)();
    if (context.state !== 'running') context.resume().catch(console.warn);
    init();
  }
  function cancel() {
    revision++;
    if (source) { source.onended = null; source.stop(); source.disconnect(); source = null; }
    window.speechSynthesis?.cancel();
  }
  function fallback(text, done, token) {
    if (!window.speechSynthesis) { done?.(); return; }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'sv-SE';
    const voice = speechSynthesis.getVoices().find(v => v.lang.toLowerCase().startsWith('sv'));
    if (voice) utterance.voice = voice;
    let finished = false;
    utterance.onend = utterance.onerror = () => { if (!finished && token === revision) { finished = true; done?.(); } };
    speechSynthesis.speak(utterance);
  }
  async function speak(text, done) {
    cancel();
    const token = revision;
    const spoken = text.replace(/Green Goblin/g, 'Gobby');
    try {
      unlock(); await init();
      if (token !== revision) return;
      if (failed) { fallback(spoken, done, token); return; }
      let result = samples.get(spoken);
      if (!result) {
        result = await request({type: 'speak', text: spoken});
        if (samples.size >= 24) samples.delete(samples.keys().next().value);
        samples.set(spoken, result);
      }
      if (token !== revision) return;
      const buffer = context.createBuffer(1, result.pcm.length, result.sampleRate);
      buffer.copyToChannel(result.pcm, 0);
      source = context.createBufferSource(); source.buffer = buffer; source.connect(context.destination);
      source.onended = () => { source?.disconnect(); source = null; if (token === revision) done?.(); };
      source.start();
    } catch (error) {
      if (token !== revision) return;
      fail(error); fallback(spoken, done, token);
    }
  }
  return {init, unlock, cancel, speak};
}
