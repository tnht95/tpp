.PHONY: build docker fmt lint test pg-up pg-down

build:
	cargo build -r

docker:
	docker compose up -d

fmt:
	cargo +nightly fmt
	pg_format migrations/* --inplace

lint:
	cargo clippy --all-features --all --tests --examples -- -D clippy::all -D warnings

test:
	cargo test

pgup:
	sqlx migrate run

pgdown:
	sqlx migrate revert --target-version 0
