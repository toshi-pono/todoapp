package api

import (
	"fmt"
	"os"

	middleware "github.com/deepmap/oapi-codegen/pkg/gin-middleware"
	"github.com/getkin/kin-openapi/openapi3filter"
	"github.com/gin-contrib/cors"
	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/cookie"
	"github.com/gin-gonic/gin"
	"github.com/toshi-pono/todoapp/server/handler/openapi"
	"github.com/toshi-pono/todoapp/server/model"
)

//go:generate sh -c "go run github.com/deepmap/oapi-codegen/cmd/oapi-codegen@latest --config ./openapi/config.yaml ../../docs/swagger.yaml"
//go:generate go fmt ./openapi/openapi.gen.go

type Handlers struct {
	Repo model.Repository
}

func NewHandlers(repo model.Repository) *Handlers {
	return &Handlers{
		Repo: repo,
	}
}

func NewGinServer(handlers *Handlers) *gin.Engine {
	swagger, err := openapi.GetSwagger()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error loading swagger spec\n: %s", err)
		os.Exit(1)
	}
	swagger.Servers = nil

	// Create a basic Gin router
	r := gin.Default()
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Access-Control-Allow-Credentials", "Access-Control-Allow-Headers", "Origin", "Content-Length", "Content-Type"},
		AllowCredentials: true,
	}))

	store := cookie.NewStore([]byte("secret"))
	r.Use(sessions.Sessions("session", store))

	// Add the middleware
	r.Use(middleware.OapiRequestValidatorWithOptions(swagger, &middleware.Options{
		Options: openapi3filter.Options{
			AuthenticationFunc: NewAuthenticator(),
		},
	}))

	// Add the routes
	r = openapi.RegisterHandlers(r, handlers)
	return r
}
