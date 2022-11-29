package api

import (
	"database/sql"
	"errors"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/go-sql-driver/mysql"
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

	// キーワード検索 or 完了フラグ検索
	tasks, total, err := h.Repo.SearchTasks(userId, limit, offset, model.SearchTaskArgs{
		Title: params.Keyword,
		Done:  params.Done,
	})
	if err != nil {
		log.Println(err)
		c.Status(http.StatusInternalServerError)
		return
	}
	c.JSON(http.StatusOK, openapi.TaskList{
		Tasks: convertTaskList(tasks),
		Total: total,
	})
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
		Priority:    args.Priority,
		Deadline:    args.Deadline,
	})
	if err != nil {
		log.Println(err)
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
func (h *Handlers) GetTask(c *gin.Context, taskId openapi.TaskId) {
	userId, ok := getUserId(c)
	if !ok {
		c.Status(http.StatusInternalServerError)
		return
	}

	task, err := h.Repo.GetTask(userId, taskId)
	if errors.Is(err, sql.ErrNoRows) {
		c.Status(http.StatusNotFound)
		return
	} else if err != nil {
		c.Status(http.StatusInternalServerError)
		return
	}

	shareList, err := h.Repo.GetSharedUsers(userId, taskId)
	if errors.Is(err, model.ErrNotOwned) {
		c.Status(http.StatusForbidden)
		return
	} else if err != nil {
		c.Status(http.StatusInternalServerError)
		return
	}
	c.JSON(http.StatusOK, convertTaskDetail(*task, shareList))
}

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
		Priority:    args.Priority,
		Deadline:    args.Deadline,
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

// タスクを共有する
// (PUT /tasks/{taskId}/share)
func (h *Handlers) ShareTask(c *gin.Context, taskId openapi.TaskId) {
	userId, ok := getUserId(c)
	if !ok {
		c.Status(http.StatusInternalServerError)
		return
	}

	args := openapi.ShareTaskRequest{}
	if err := c.ShouldBindJSON(&args); err != nil {
		c.Status(http.StatusBadRequest)
		return
	}

	var mysqlError *mysql.MySQLError
	err := h.Repo.ShareTask(userId, taskId, args.Name)
	if errors.Is(err, model.ErrNotOwned) {
		c.Status(http.StatusForbidden)
		return
	} else if errors.Is(err, model.ErrUserNotFound) {
		c.Status(http.StatusBadRequest)
		return
	} else if errors.As(err, &mysqlError) && mysqlError.Number == model.ErrDuplicateKey {
		c.Status(http.StatusConflict)
		return
	} else if err != nil {
		c.Status(http.StatusInternalServerError)
		return
	}
	c.Status(http.StatusNoContent)
}

// model.Task -> openapi.Task
func convertTask(task model.Task) openapi.Task {
	return openapi.Task{
		Id:          task.ID,
		Title:       task.Title,
		Description: task.Description,
		Done:        task.IsDone,
		CreatedAt:   task.CreatedAt,
		Priority:    task.Priority,
		Deadline:    task.Deadline,
	}
}

func convertTaskList(tasks []model.Task) []openapi.Task {
	response := make([]openapi.Task, len(tasks))
	for i, task := range tasks {
		response[i] = convertTask(task)
	}
	return response
}

func convertTaskDetail(task model.Task, sharedUsers []model.User) openapi.TaskDetail {
	return openapi.TaskDetail{
		CreatedAt:   task.CreatedAt,
		Description: task.Description,
		Done:        task.IsDone,
		Id:          task.ID,
		Title:       task.Title,
		Priority:    task.Priority,
		Deadline:    task.Deadline,
		ShareList:   convertUserList(sharedUsers),
	}
}
