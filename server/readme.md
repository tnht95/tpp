# Server

## Code structure

```bash
$ tree -d -L 4 --gitignore
.
├── migrations
└── src
    ├── database
    │   └── entities
    ├── http
    │   └── controllers
    ├── model
    │   ├── requests
    │   └── responses
    └── services
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

# manual run
$ cargo run -- start
```

<!--
   - #### Swagger
   -
   - Please note that it's only for local environment
   -
   - Served at: `http://localhost:8080/swagger/index.html`
   -
   - ```bash
   - $ swag init -d api,internal/request,internal/response,internal/database/entities -o ./api/docs -g ./http.go
   - ```
   -->

<!--
   - #### Authentication
   -
   - In local development, we send email in 'authorization' header
   -
   - In development, uat and production environment, we use jwt auth
   -
   - ```bash
   - # local
   - $ curl localhost:8080/... -H 'authorization: admin@example.com'
   -
   - # development, uat, production
   - $ curl localhost:8080/... -H 'authorization: Bearer ...'
   - ```
   -->

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

