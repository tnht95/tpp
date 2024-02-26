wasm:
	cd chip8/wasm && wasm-pack build --target web && mv pkg/wasm_bg.wasm ../../web/public/chip8 && mv pkg/wasm.js ../../web/public/chip8 && mv pkg/wasm.d.ts ../../web/public/chip8


