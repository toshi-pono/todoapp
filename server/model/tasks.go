package model

import (
	"time"

	"github.com/google/uuid"
)

type TasksRepository interface {
	GetTask(taskId uuid.UUID) (*Task, error)
	GetTasks(userId uuid.UUID, limit int, offset int) ([]Task, error)
	SearchTasks(limit int, offset int, query SearchTaskArgs) ([]Task, error)
	CreateTask(userId uuid.UUID, args CreateTaskArgs) (*Task, error)
}

type Task struct {
	ID          uuid.UUID `db:"id"`
	Title       string    `db:"title"`
	Description string    `db:"description"`
	IsDone      bool      `db:"is_done"`
	CreatedAt   time.Time `db:"created_at"`
}

const task_columns = "id, title, description, is_done, created_at"

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
func (repo *SqlxRepository) GetTasks(userId uuid.UUID, limit int, offset int) ([]Task, error) {
	var tasks []Task
	query := `SELECT ` + task_columns + ` FROM tasks JOIN ownership ON task_id = id WHERE user_id = ? LIMIT ? OFFSET ?`
	err := repo.db.Select(&tasks, query, userId, limit, offset)
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
func (repo *SqlxRepository) CreateTask(userId uuid.UUID, args CreateTaskArgs) (*Task, error) {
	var task Task
	taskId := uuid.New()
	tx := repo.db.MustBegin()
	_, err := tx.Exec("INSERT INTO tasks (id, title, description) VALUES (?, ?, ?)", taskId, args.Title, args.Description)
	if err != nil {
		tx.Rollback()
		return nil, err
	}
	_, err = tx.Exec("INSERT INTO ownership (user_id, task_id) VALUES (?, ?)", userId, taskId)
	if err != nil {
		tx.Rollback()
		return nil, err
	}

	err = tx.Get(&task, "SELECT * FROM tasks WHERE id = ?", taskId)
	if err != nil {
		tx.Rollback()
		return nil, err
	}

	tx.Commit()
	return &task, nil
}
