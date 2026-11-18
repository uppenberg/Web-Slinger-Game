# Bundled Swedish Piper speech

The game uses `sv_SE-lisa-medium`, trained from scratch by the Piper voice contributors. See `MODEL_CARD` for the CC0 dataset and provenance.

Browser dependencies:

- ONNX Runtime Web 1.17.3 (MIT): https://github.com/microsoft/onnxruntime
- Piper phonemizer WASM from `@diffusionstudio/piper-wasm` 1.0.0: https://github.com/diffusionstudio/piper-wasm
- Piper phonemizer source (MIT): https://github.com/wide-video/piper-phonemize and https://github.com/rhasspy/piper-phonemize
- eSpeak NG (GPL v3 or later), embedded in the phonemizer: https://github.com/rhasspy/espeak-ng

License texts accompany these assets. The WASM build instructions are in the diffusionstudio repository. The game runs the phonemizer and neural model in a worker, on one CPU thread, so no special cross-origin-isolation server headers are needed. No remote TTS service is used. The browser voice is used only if Piper fails.

Run `python tools/download_piper.py` from the repository root to restore the assets. The voice source is https://huggingface.co/rhasspy/piper-voices/tree/main/sv/sv_SE/lisa/medium. Downloaded file checksums are recorded in `SHA256.json`.
