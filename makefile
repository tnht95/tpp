.PHONY: chip8 web server

chip8:
	cd chip8/wasm && wasm-pack build --target web
	mv chip8/wasm/pkg/wasm_bg.wasm web/src/chip8/wasm_bg.wasm
	mv chip8/wasm/pkg/wasm.js web/src/chip8/wasm.js
	mv chip8/wasm/pkg/wasm.d.ts web/src/chip8/wasm.d.ts

web:
	az storage blob delete-batch -s '$$web' --account-name tppsite --auth-mode key
	cd web && rm -rf dist && yarn build
	git rev-parse HEAD > web/dist/assets/version
	az storage blob upload-batch -d '$$web' -s web/dist --account-name tppsite --auth-mode key
	az cdn endpoint purge -g tpp --profile-name tpp-cdn -n tpp-app --content-paths '/*' --no-wait

server:
	ssh tpp "cd tpp/server && git pull -f --ff-only && rm -rf config.toml && sudo systemctl stop tpp"
	cd server && scp -i ~/.ssh/tpp-user.pem config-prod.toml tpp-user@tpp-server.southeastasia.cloudapp.azure.com:/home/tpp-user/tpp/server/config.toml
	ssh tpp "cd tpp/server && source /home/tpp-user/.cargo/env && make deploy"
