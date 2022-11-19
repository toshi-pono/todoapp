# univ-todoApp

## Development

```sh
docker compose -f docker-compose-dev.yml up
```

For debug

```sh
docker compose -f docker-compose-dev.yml --profile debug up
```

With Frontend

```sh
docker compose -f docker-compose-dev.yml --profile frontend up
```

## Production

```sh
docker compose -f docker-compose.yml up
```

## NOTE

```
cd server
go generate ./handler/api.go
```
