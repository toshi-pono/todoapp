package api

import (
	"context"
	"errors"
	"net/http"

	middleware "github.com/deepmap/oapi-codegen/pkg/gin-middleware"
	"github.com/getkin/kin-openapi/openapi3filter"
	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"github.com/labstack/gommon/log"
)

func NewAuthenticator() openapi3filter.AuthenticationFunc {
	return func(ctx context.Context, input *openapi3filter.AuthenticationInput) error {
		return Authenticate(ctx, input)
	}
}

func Authenticate(ctx context.Context, input *openapi3filter.AuthenticationInput) error {
	c := middleware.GetGinContext(ctx)
	if c == nil {
		log.Error("No gin context found in context")
		return errors.New("no gin context found in context")
	}

	// HACK?: errorでnil以外を返却して、400以外のステータスコードを返却する方法がわからなかった:eyes:
	ok, message, err := CheckLogin(c)
	if err != nil {
		c.AbortWithError(http.StatusInternalServerError, err)
		return nil
	}
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": message})
		c.Abort()
		return nil
	}
	return nil
}

func CheckLogin(ctx *gin.Context) (bool, string, error) {
	if sessions.Default(ctx).Get(userKey) != nil {
		return true, "", nil
	}
	return false, "not login", nil
}
