# Bundled local OCR resources

These resources are loaded only by the CraftCareer creator's image-to-layout assistant. They are not included in exported portfolios.

- **Tesseract.js 6.0.1**, by the Tesseract.js contributors: https://github.com/naptha/tesseract.js — Apache-2.0, see `TESSERACT-LICENSE`. Browser and worker bundles came from the official npm package `tesseract.js@6.0.1`. Bundled dependency notices are retained in the adjacent `*.LICENSE.txt` files.
- **Tesseract.js-core 6.0.0**, by the Tesseract.js/Tesseract contributors: https://github.com/naptha/tesseract.js-core — Apache-2.0, see `LICENSE`. The four `*.wasm.js` files include their WebAssembly bytes and were taken from official npm `tesseract.js-core@6.0.0`.
- **English trained data**, `4.0.0_best_int/eng.traineddata.gz`, from official npm `@tesseract.js-data/eng@1.0.0`: https://github.com/naptha/tessdata — trained data is Apache-2.0, see `TESSDATA-LICENSE` (upstream https://github.com/tesseract-ocr/tessdata_fast). The npm wrapper declares MIT; no wrapper source is distributed here.

All three npm archive integrity hashes were checked against the registry's SHA-512 metadata before extraction. The engine/model files are unmodified. The source-map comments in minified bundles refer to optional development maps, which are not needed at runtime and are not packaged.

Full browser-bundle dependency license texts are included in DEPENDENCY-LICENSES.md.
