# Server

## Code structure

```bash
$ tree -d -L 4 --gitignore
.
├── migrations
├── roms
└── src
    ├── database
    │   └── entities
    ├── http
    │   ├── controllers
    │   ├── handlers
    │   └── utils
    ├── model
    │   ├── requests
    │   └── responses
    ├── services
    └── utils
```

### How to develop

#### Tool installation

```bash
$ cargo install sqlx-cli
```

#### Basic

```bash
# make sure you have dependencies up
$ make docker

# db migrations
$ make pgup

# manual run
$ RUST_LOG=4 cargo run -- start
```

#### Linter

❗️Please do this before raise the PRs ❗️

```bash
$ make fmt
$ make lint
```

#### Migration

```bash
# new
$ sqlx migrate add <new_migration_name>

# up
$ make pgup

# down
$ make pgdown
```

#### Test

```bash
# make sure you have dependencies up
$ make docker

$ make test
```
