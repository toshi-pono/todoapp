package main

import (
	"fmt"
	"os"

	api "github.com/toshi-pono/todoapp/server/handler"
	"github.com/toshi-pono/todoapp/server/model"
)

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

	engine := api.NewGinServer(handlers)
	engine.Run(fmt.Sprintf(":%s", port))
}
