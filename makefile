wasm:
	cd chip8/wasm && wasm-pack build --target web && mv pkg/wasm_bg.wasm ../../web/public/chip8 && mv pkg/wasm.js ../../web/public/chip8 && mv pkg/wasm.d.ts ../../web/public/chip8

app:
	az storage blob delete-batch -s '$$web' --account-name tppsite --auth-mode key
	cd web && yarn build
	az storage blob upload-batch -d '$$web' -s ./web/dist --account-name tppsite --auth-mode key
	az cdn endpoint purge -g tpp --profile-name tpp-cdn -n tpp-app --content-paths '/*' --no-wait

