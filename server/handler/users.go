package api

import "github.com/gin-gonic/gin"

// ユーザーを作成
// (POST /users)
func (h *Handlers) CreateUser(c *gin.Context) {}

// ログインユーザーを取得
// (GET /users/me)
func (h *Handlers) GetMe(c *gin.Context) {}

// ログインユーザーを更新
// (PATCH /users/me)
func (h *Handlers) UpdateMe(c *gin.Context) {}
