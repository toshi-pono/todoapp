package api

import (
	"github.com/gin-gonic/gin"
	"github.com/toshi-pono/todoapp/server/handler/openapi"
)

// タスクを取得
// (GET /tasks)
func (h *Handlers) GetTasks(c *gin.Context, params openapi.GetTasksParams) {}

// タスクを作成
// (POST /tasks)
func (h *Handlers) CreateTask(c *gin.Context) {}

// タスクを削除
// (DELETE /tasks/{taskId})
func (h *Handlers) DeleteTask(c *gin.Context, taskId openapi.TaskId) {}

// タスクを取得
// (GET /tasks/{taskId})
func (h *Handlers) GetTask(c *gin.Context, taskId openapi.TaskId) {}

// タスクを更新
// (PATCH /tasks/{taskId})
func (h *Handlers) UpdateTask(c *gin.Context, taskId openapi.TaskId) {}
