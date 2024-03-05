.PHONY: deploy build docker fmt lint test pg-up pg-down clean-data

deploy:
	cargo sqlx prepare
	docker build -t tpp-server .

build:
	cargo build -r --locked

docker:
	docker compose up -d

fmt:
	cargo +nightly fmt
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
