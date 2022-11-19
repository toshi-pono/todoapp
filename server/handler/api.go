package api

//go:generate sh -c "go run github.com/deepmap/oapi-codegen/cmd/oapi-codegen@latest --config ./openapi/config.yaml ../../docs/swagger.yaml"
//go:generate go fmt ./openapi/openapi.gen.go

type Handlers struct{}

func NewHandlers() *Handlers {
	return &Handlers{}
}
