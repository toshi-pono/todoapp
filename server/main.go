package main

import (
	"fmt"
	"os"

	middleware "github.com/deepmap/oapi-codegen/pkg/gin-middleware"
	"github.com/gin-gonic/gin"
	api "github.com/toshi-pono/todoapp/server/handler"
	"github.com/toshi-pono/todoapp/server/handler/openapi"
	"github.com/toshi-pono/todoapp/server/model"
)

func NewGinServer(handlers *api.Handlers) *gin.Engine {
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
	r = openapi.RegisterHandlers(r, handlers)
	return r
}

func main() {
	db, err := model.EstablishConnection()
	if err != nil {
		panic(err)
	}

	err = db.DB.Ping()
	if err != nil {
		panic(err)
	}
	fmt.Println("Successfully connected to database")

	repo := model.NewSqlxRepository(db)
	handlers := api.NewHandlers(repo)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8000"
	}

	engine := NewGinServer(handlers)
	engine.Run(fmt.Sprintf(":%s", port))
}
