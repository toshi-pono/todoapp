package api

import (
	"errors"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/toshi-pono/todoapp/server/handler/openapi"
	"github.com/toshi-pono/todoapp/server/model"
)

// タスクを取得
// (GET /tasks)
func (h *Handlers) GetTasks(c *gin.Context, params openapi.GetTasksParams) {
	userId, ok := getUserId(c)
	if !ok {
		c.Status(http.StatusInternalServerError)
		return
	}
	var limit int
	if params.Limit != nil {
		limit = int(*params.Limit)
	} else {
		limit = 10
	}
	var offset int
	if params.Offset != nil {
		offset = int(*params.Offset)
	} else {
		offset = 0
	}

	if params.Keyword != nil {
		// キーワード検索
		// TODO:
	} else {
		// 一覧取得
		tasks, err := h.Repo.GetTasks(userId, limit, offset)
		if err != nil {
			log.Println(err)
			c.Status(http.StatusInternalServerError)
			return
		}

		c.JSON(http.StatusOK, convertTaskList(tasks))
	}
}

// タスクを作成
// (POST /tasks)
func (h *Handlers) CreateTask(c *gin.Context) {
	userId, ok := getUserId(c)
	if !ok {
		c.Status(http.StatusInternalServerError)
		return
	}

	args := openapi.CreateTaskRequest{}
	if err := c.ShouldBindJSON(&args); err != nil {
		c.Status(http.StatusBadRequest)
		return
	}

	task, err := h.Repo.CreateTask(userId, model.CreateTaskArgs{
		Title:       args.Title,
		Description: args.Description,
	})
	if err != nil {
		c.Status(http.StatusInternalServerError)
		return
	}
	c.JSON(http.StatusCreated, convertTask(*task))
}

// タスクを削除
// (DELETE /tasks/{taskId})
func (h *Handlers) DeleteTask(c *gin.Context, taskId openapi.TaskId) {
	userId, ok := getUserId(c)
	if !ok {
		c.Status(http.StatusInternalServerError)
		return
	}

	err := h.Repo.DeleteTask(userId, taskId)
	if errors.Is(err, model.ErrNotOwned) {
		c.Status(http.StatusForbidden)
		return
	} else if err != nil {
		c.Status(http.StatusInternalServerError)
		return
	}
	c.Status(http.StatusNoContent)
}

// タスクを取得
// (GET /tasks/{taskId})
func (h *Handlers) GetTask(c *gin.Context, taskId openapi.TaskId) {}

// タスクを更新
// (PATCH /tasks/{taskId})
func (h *Handlers) UpdateTask(c *gin.Context, taskId openapi.TaskId) {
	userId, ok := getUserId(c)
	if !ok {
		c.Status(http.StatusInternalServerError)
		return
	}

	args := openapi.UpdateTaskRequest{}
	if err := c.ShouldBindJSON(&args); err != nil {
		c.Status(http.StatusBadRequest)
		return
	}

	task, err := h.Repo.UpdateTask(userId, taskId, model.UpdateTaskArgs{
		Title:       args.Title,
		Description: args.Description,
		IsDone:      args.Done,
	})
	if errors.Is(err, model.ErrNotOwned) {
		c.Status(http.StatusForbidden)
		return
	} else if err != nil {
		c.Status(http.StatusInternalServerError)
		return
	}
	c.JSON(http.StatusOK, convertTask(*task))
}

// model.Task -> openapi.Task
func convertTask(task model.Task) openapi.Task {
	return openapi.Task{
		Id:          task.ID,
		Title:       task.Title,
		Description: task.Description,
		Done:        task.IsDone,
		CreatedAt:   task.CreatedAt,
	}
}

func convertTaskList(tasks []model.Task) []openapi.Task {
	response := make([]openapi.Task, len(tasks))
	for i, task := range tasks {
		response[i] = convertTask(task)
	}
	return response
}
