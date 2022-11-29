package model

import (
	"database/sql"
	"log"
	"time"

	"github.com/google/uuid"
)

type TasksRepository interface {
	GetTask(userId uuid.UUID, taskId uuid.UUID) (*Task, error)
	GetTasks(userId uuid.UUID, limit int, offset int) ([]Task, int, error)
	SearchTasks(userId uuid.UUID, limit int, offset int, searchQuery SearchTaskArgs) ([]Task, int, error)
	CreateTask(userId uuid.UUID, args CreateTaskArgs) (*Task, error)
	UpdateTask(userId uuid.UUID, taskId uuid.UUID, args UpdateTaskArgs) (*Task, error)
	DeleteTask(userId uuid.UUID, taskId uuid.UUID) error
	ShareTask(userId uuid.UUID, taskId uuid.UUID, shareUserName string) error
	GetSharedUsers(userId uuid.UUID, taskId uuid.UUID) ([]User, error)
}

type Task struct {
	ID          uuid.UUID `db:"id"`
	Title       string    `db:"title"`
	Description string    `db:"description"`
	IsDone      bool      `db:"is_done"`
	Priority    int       `db:"priority"`
	Deadline    time.Time `db:"deadline"`
	CreatedAt   time.Time `db:"created_at"`
}

const task_columns = "id, title, description, is_done, created_at, priority, deadline"

type CreateTaskArgs struct {
	Title       string
	Description string
	Priority    int
	Deadline    time.Time
}

type UpdateTaskArgs struct {
	Title       string
	Description string
	IsDone      bool
	Priority    int
	Deadline    time.Time
}

type SearchTaskArgs struct {
	Title *string
	Done  *string
}

// GetTask Idからタスクを取得する
func (repo *SqlxRepository) GetTask(userId uuid.UUID, taskId uuid.UUID) (*Task, error) {
	var task Task
	query := `SELECT ` + task_columns + ` FROM tasks JOIN ownership ON task_id = id WHERE user_id = ? AND id = ? LIMIT 1`
	err := repo.db.Get(&task, query, userId, taskId)
	if err != nil {
		return nil, err
	}
	return &task, nil
}

// GetTasks タスクを取得する
func (repo *SqlxRepository) GetTasks(userId uuid.UUID, limit int, offset int) ([]Task, int, error) {
	var tasks []Task
	query := `SELECT ` + task_columns + ` FROM tasks JOIN ownership ON task_id = id WHERE user_id = ? LIMIT ? OFFSET ?`
	err := repo.db.Select(&tasks, query, userId, limit, offset)
	if err != nil {
		return nil, 0, err
	}

	var count int
	query = `SELECT COUNT(*) FROM tasks JOIN ownership ON task_id = id WHERE user_id = ?`
	err = repo.db.Get(&count, query, userId)
	if err != nil {
		return nil, 0, err
	}

	return tasks, count, nil
}

// SearchTasks タスクを検索する
func (repo *SqlxRepository) SearchTasks(userId uuid.UUID, limit int, offset int, searchQuery SearchTaskArgs) ([]Task, int, error) {
	var tasks []Task
	var title string
	var done bool
	query := `SELECT ` + task_columns + ` FROM tasks JOIN ownership ON task_id = id WHERE user_id = ?`
	countQuery := `SELECT COUNT(*) FROM tasks JOIN ownership ON task_id = id WHERE user_id = ?`

	// タイトル(keyword)の処理
	query += ` AND title LIKE ?`
	countQuery += ` AND title LIKE ?`
	if searchQuery.Title != nil {
		title = "%" + *searchQuery.Title + "%"
	} else {
		title = "%" + "%" // 全件取得
	}

	// 完了状態の処理
	if searchQuery.Done != nil {
		query += ` AND is_done = ?`
		countQuery += ` AND is_done = ?`
		if (*searchQuery.Done) == "yes" {
			done = true
		} else {
			done = false
		}
	} else {
		query += ` AND ?`
		countQuery += ` AND ?`
		done = true
	}

	query += ` ORDER BY deadline ASC LIMIT ? OFFSET ?`
	err := repo.db.Select(&tasks, query, userId, title, done, limit, offset)
	if err != nil {
		return nil, 0, err
	}

	var count int
	err = repo.db.Get(&count, countQuery, userId, title, done)
	if err != nil {
		log.Println(countQuery)
		return nil, 0, err
	}

	return tasks, count, nil
}

// CreateTask タスクを作成する
func (repo *SqlxRepository) CreateTask(userId uuid.UUID, args CreateTaskArgs) (*Task, error) {
	var task Task
	taskId := uuid.New()
	tx := repo.db.MustBegin()
	_, err := tx.Exec("INSERT INTO tasks (id, title, description, priority, deadline) VALUES (?, ?, ?, ?, ?)", taskId, args.Title, args.Description, args.Priority, args.Deadline)
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

// UpdateTask タスクを更新する
func (repo *SqlxRepository) UpdateTask(userId uuid.UUID, taskId uuid.UUID, args UpdateTaskArgs) (*Task, error) {
	tx := repo.db.MustBegin()

	var count int
	err := tx.Get(&count, "SELECT COUNT(*) FROM ownership WHERE task_id = ? AND user_id = ?", taskId, userId)
	if err != nil {
		tx.Rollback()
		return nil, err
	}
	if count == 0 {
		tx.Rollback()
		return nil, ErrNotOwned
	}

	_, err = tx.Exec("UPDATE tasks SET title = ?, description = ?, is_done = ?, priority = ?, deadline = ? WHERE id = ?", args.Title, args.Description, args.IsDone, args.Priority, args.Deadline, taskId)
	if err != nil {
		tx.Rollback()
		return nil, err
	}
	task := Task{
		ID:          taskId,
		Title:       args.Title,
		Description: args.Description,
		IsDone:      args.IsDone,
	}
	tx.Commit()
	return &task, nil
}

// DeleteTask タスクを削除する
func (repo *SqlxRepository) DeleteTask(userId uuid.UUID, taskId uuid.UUID) error {
	tx := repo.db.MustBegin()

	var own_counter int
	err := tx.Get(&own_counter, "SELECT COUNT(*) FROM ownership WHERE task_id = ? AND user_id = ?", taskId, userId)
	if err != nil {
		tx.Rollback()
		return err
	}
	if own_counter == 0 {
		tx.Rollback()
		return ErrNotOwned
	}

	_, err = tx.Exec("DELETE FROM ownership WHERE task_id = ? AND user_id = ?", taskId, userId)
	if err != nil {
		tx.Rollback()
		return err
	}
	var count int
	err = tx.Get(&count, "SELECT COUNT(*) FROM ownership WHERE task_id = ?", taskId)
	if err != nil {
		tx.Rollback()
		return err
	}
	if count == 0 {
		_, err = tx.Exec("DELETE FROM tasks WHERE id = ?", taskId)
		if err != nil {
			tx.Rollback()
			return err
		}
	}

	tx.Commit()
	return nil
}

// ShareTask タスクを共有する
func (repo *SqlxRepository) ShareTask(userId uuid.UUID, taskId uuid.UUID, shareUserName string) error {
	tx := repo.db.MustBegin()

	// check ownership
	var own_counter int
	err := tx.Get(&own_counter, "SELECT COUNT(*) FROM ownership WHERE task_id = ? AND user_id = ?", taskId, userId)
	if err != nil {
		tx.Rollback()
		return err
	}
	if own_counter == 0 {
		tx.Rollback()
		return ErrNotOwned
	}

	// check user
	var user User
	err = tx.Get(&user, "SELECT * FROM users WHERE name = ?", shareUserName)
	if err == sql.ErrNoRows {
		tx.Rollback()
		return ErrUserNotFound
	} else if err != nil {
		tx.Rollback()
		return err
	}

	_, err = tx.Exec("INSERT INTO ownership (user_id, task_id) VALUES (?, ?)", user.Id, taskId)
	if err != nil {
		log.Println(err)
		tx.Rollback()
		return err
	}

	tx.Commit()
	return nil
}

// GetSharedUsers タスクを共有しているユーザーを取得する
func (repo *SqlxRepository) GetSharedUsers(userId uuid.UUID, taskId uuid.UUID) ([]User, error) {
	var count int
	err := repo.db.Get(&count, "SELECT COUNT(*) FROM ownership WHERE task_id = ? AND user_id = ?", taskId, userId)
	if err != nil {
		return nil, err
	}
	if count == 0 {
		return nil, ErrNotOwned
	}

	var users []User
	err = repo.db.Select(&users, "SELECT users.* FROM users INNER JOIN ownership ON users.id = ownership.user_id WHERE ownership.task_id = ?", taskId)
	if err != nil {
		return nil, err
	}
	return users, nil
}
