package api

import "github.com/toshi-pono/todoapp/server/model"

//go:generate sh -c "go run github.com/deepmap/oapi-codegen/cmd/oapi-codegen@latest --config ./openapi/config.yaml ../../docs/swagger.yaml"
//go:generate go fmt ./openapi/openapi.gen.go

type Handlers struct {
	Repo *model.Repository
}

func NewHandlers(repo model.Repository) *Handlers {
	return &Handlers{
		Repo: &repo,
	}
}
