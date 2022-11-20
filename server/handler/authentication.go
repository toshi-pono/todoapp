package api

import (
	"bytes"
	"database/sql"
	"errors"
	"log"
	"net/http"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"github.com/toshi-pono/todoapp/server/handler/openapi"
	"github.com/toshi-pono/todoapp/server/handler/util"
)

const userKey = "userId"

// ログイン
// (POST /login)
func (h *Handlers) Login(c *gin.Context) {
	request := openapi.LoginRequest{}
	if err := c.ShouldBindJSON(&request); err != nil {
		c.Status(http.StatusBadRequest)
		return
	}

	user, err := h.Repo.GetUserByName(request.Name)
	if errors.Is(err, sql.ErrNoRows) {
		c.Status(http.StatusUnauthorized)
		return
	} else if err != nil {
		log.Println(err)
		c.Status(http.StatusInternalServerError)
		return
	}

	if !bytes.Equal(user.Password, util.HashPassword(request.Password)) {
		c.Status(http.StatusUnauthorized)
		return
	}

	session := sessions.Default(c)
	session.Set(userKey, user.Id)
	session.Save()

	c.Status(http.StatusNoContent)
}

// ログアウト
// (POST /logout)
func (h *Handlers) Logout(c *gin.Context) {
	session := sessions.Default(c)
	session.Clear()
	session.Options(sessions.Options{MaxAge: -1})
	session.Save()
	c.Status(http.StatusNoContent)
}
