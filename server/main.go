package main

import (
	"fmt"
	"os"

	middleware "github.com/deepmap/oapi-codegen/pkg/gin-middleware"
	"github.com/gin-gonic/gin"
	api "github.com/toshi-pono/todoapp/server/handler"
	"github.com/toshi-pono/todoapp/server/handler/openapi"
)

func NewGinServer() *gin.Engine {
	swagger, err := openapi.GetSwagger()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error loading swagger spec\n: %s", err)
		os.Exit(1)
	}
	swagger.Servers = nil

	// Create a basic Gin router
	r := gin.Default()

	// Add the middleware
	r.Use(middleware.OapiRequestValidator(swagger))

	// Add the routes
	r = openapi.RegisterHandlers(r, api.NewHandlers())
	return r
}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8000"
	}

	engine := NewGinServer()
	engine.Run(fmt.Sprintf(":%s", port))
}
