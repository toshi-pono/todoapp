# univ-todoApp

## Development

```sh
docker compose up -f docker-compose-dev.yml
```

For debug

```sh
docker compose up -f docker-compose-dev.yml --profile debug
```

With Frontend

```sh
docker compose up -f docker-compose-dev.yml --profile frontend
```

## Production

```sh
docker compose up -f docker-compose.yml
```

## NOTE

```
cd server
go generate ./handler/api.go
```
