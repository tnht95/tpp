.PHONY: build docker fmt lint test pg-up pg-down

build:
	cargo build -r

docker:
	docker compose up -d

fmt:
	cargo +nightly fmt
	pg_format migrations/* --inplace

lint:
	cargo clippy --bins --examples --tests --benches --all-targets --all-features --frozen --locked -- -D warnings -D clippy::all

test:
	cargo test

pgup:
	sqlx migrate run

pgdown:
	sqlx migrate revert --target-version 0
