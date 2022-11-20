package api

import (
	"errors"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/go-sql-driver/mysql"
	"github.com/google/uuid"
	"github.com/toshi-pono/todoapp/server/handler/openapi"
	"github.com/toshi-pono/todoapp/server/handler/util"
	"github.com/toshi-pono/todoapp/server/model"
)

// ユーザーを作成
// (POST /users)
func (h *Handlers) CreateUser(c *gin.Context) {
	createUserArgs := openapi.CreateUserRequest{}
	if err := c.ShouldBindJSON(&createUserArgs); err != nil {
		c.Status(http.StatusBadRequest)
	}
	userId := uuid.New()
	err := h.Repo.CreateUser(model.CreateUserArgs{
		Id:       userId,
		Name:     createUserArgs.Name,
		Password: util.HashPassword(createUserArgs.Password),
	})
	var mysqlError *mysql.MySQLError
	if errors.As(err, &mysqlError) && mysqlError.Number == model.ErrDuplicateKey {
		c.Status(http.StatusConflict)
		return
	} else if err != nil {
		log.Println(err)
		c.Status(http.StatusInternalServerError)
		return
	}

	c.JSON(http.StatusCreated, openapi.User{
		Id:   userId,
		Name: createUserArgs.Name,
	})
}

// ログインユーザーを取得
// (GET /users/me)
func (h *Handlers) GetMe(c *gin.Context) {}

// ログインユーザーを更新
// (PATCH /users/me)
func (h *Handlers) UpdateMe(c *gin.Context) {}
