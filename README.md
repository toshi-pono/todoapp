# TODOAPP

[システム設計演習｜ Web アプリケーション](https://cs-sysdes.github.io/) の授業の仕様を満たす TODOList Web アプリケーションです

## 構成

Client: Vite, React, TypeScript, Chakra UI, SWR
Server: Go, Gin, MySQL

その他: Docker, openapi-codegen, openapi-generator

## 使い方

### 開発環境

#### クライアント

```bash
cd client
npm i
npm run dev
```

#### サーバー

```bash
docker compose -f docker-compose-dev.yml up
docker compose exec app go run main.go
```

#### OpenAPI の更新方法

```bash
docker compose exec app go generate ./handler/api.go
cd client
npm run gen-api
```

### 🚧 オプション

For debug (with )

```sh
docker compose -f docker-compose-dev.yml --profile debug up
```

🚧 WIP: With Frontend

```sh
docker compose -f docker-compose-dev.yml --profile frontend up
```

### 🚧 本番環境

WIP

```sh
docker compose -f docker-compose.yml up
```

### ディレクトリ構成

```
.
├── README.md
├── client                   # クライアントのソースコード
├── docker
│   └── db                   # MySQL の初期化用スクリプト
├── docs
│   └── swagger.yaml         # API の定義
└── server                   # サーバーのソースコード
```
