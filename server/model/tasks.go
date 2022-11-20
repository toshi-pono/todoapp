package model

import (
	"time"

	"github.com/google/uuid"
)

type TasksRepository interface {
	GetTask(taskId uuid.UUID) (*Task, error)
	GetTasks(limit int, offset int) ([]Task, error)
	SearchTasks(limit int, offset int, query SearchTaskArgs) ([]Task, error)
	CreateTask(args CreateTaskArgs) error
}

type Task struct {
	ID          uuid.UUID `db:"id"`
	Title       string    `db:"title"`
	Description string    `db:"description"`
	IsDone      bool      `db:"is_done"`
	CreatedAt   time.Time `db:"created_at"`
}

type CreateTaskArgs struct {
	Title       string
	Description string
}

type SearchTaskArgs struct {
	Title string
}

// GetTask Idからタスクを取得する
func (repo *SqlxRepository) GetTask(taskId uuid.UUID) (*Task, error) {
	var task Task
	err := repo.db.Get(&task, "SELECT * FROM tasks WHERE id = ?", taskId)
	if err != nil {
		return nil, err
	}
	return &task, nil
}

// GetTasks タスクを取得する
func (repo *SqlxRepository) GetTasks(limit int, offset int) ([]Task, error) {
	var tasks []Task
	err := repo.db.Select(&tasks, "SELECT * FROM tasks LIMIT ? OFFSET ?", limit, offset)
	if err != nil {
		return nil, err
	}
	return tasks, nil
}

// SearchTasks タスクを検索する
func (repo *SqlxRepository) SearchTasks(limit int, offset int, query SearchTaskArgs) ([]Task, error) {
	var tasks []Task
	err := repo.db.Select(&tasks, "SELECT * FROM tasks WHERE title LIKE ? LIMIT ? OFFSET ?", "%"+query.Title+"%", limit, offset)
	if err != nil {
		return nil, err
	}
	return tasks, nil
}

// CreateTask タスクを作成する
func (repo *SqlxRepository) CreateTask(args CreateTaskArgs) error {
	id := uuid.New()
	_, err := repo.db.Exec("INSERT INTO tasks (id, title, description) VALUES (?, ?, ?)", id, args.Title, args.Description)
	if err != nil {
		return err
	}
	return nil
}
