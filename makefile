.PHONY: chip8 web server

chip8:
	cd chip8/wasm && wasm-pack build --target web && mv pkg/wasm_bg.wasm ../../web/public/chip8 && mv pkg/wasm.js ../../web/public/chip8 && mv pkg/wasm.d.ts ../../web/public/chip8

web:
	az storage blob delete-batch -s '$$web' --account-name tppsite --auth-mode key
	cd web && yarn build
	az storage blob upload-batch -d '$$web' -s ./web/dist --account-name tppsite --auth-mode key
	az cdn endpoint purge -g tpp --profile-name tpp-cdn -n tpp-app --content-paths '/*' --no-wait

server:
	ssh tpp "cd tpp/server && git pull -f --ff-only && rm -rf config.toml && sudo systemctl stop tpp"
	cd server && scp -i ~/.ssh/tpp-user.pem config-prod.toml tpp-user@tpp-server.southeastasia.cloudapp.azure.com:/home/tpp-user/tpp/server/config.toml
	ssh tpp "cd tpp/server && source /home/tpp-user/.cargo/env && make deploy"
