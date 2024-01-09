cargo clippy --all-targets --all-features -- -D warnings

rustup default nightly && cargo fmt --all && rustup default stable