.PHONY: deploy build docker fmt lint test pg-up pg-down clean-data

deploy: export SQLX_OFFLINE = true

# on VM
deploy:
	sudo rm -rf /usr/local/bin/server
	cargo build -r --locked
	sudo mv ./target/release/server /usr/local/bin/server
	sudo cp tpp.service /etc/systemd/system/tpp.service
	sudo systemctl daemon-reload
	sudo systemctl enable tpp
	sudo systemctl restart tpp
	sudo systemctl status --no-pager -l tpp

build:
	cargo sqlx prepare
	cargo build -r --locked

docker:
	# docker build -t tpp-server .
	docker compose up -d

fmt:
	cargo +nightly fmt --all
	pg_format migrations/* --inplace

lint:
	cargo clippy --bins --examples --tests --benches --all-targets --all-features -- -D warnings -D clippy::all

test: docker pgdown pgup
	cargo test --features mock-time -- --show-output

pgup:
	sqlx migrate run

pgdown:
	sqlx migrate revert --target-version 0

clean-data:
	rm -rf ./data/db ./data/cache
