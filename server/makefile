.PHONY: build docker fmt lint test pg-up pg-down

build:
	cargo build -r

docker:
	docker compose up -d

fmt:
	cargo +nightly fmt

lint:
	cargo clippy --all-targets --all-features -- -D warnings -D clippy::all

test:
	cargo test

pgup:
	sqlx migrate run

pgdown:
	sqlx migrate revert
