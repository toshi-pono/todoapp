package model

import (
	"bytes"
	"log"
	"time"

	"github.com/google/uuid"
)

type UsersRepository interface {
	GetUserById(userId uuid.UUID) (*User, error)
	GetUserByName(name string) (*User, error)
	CreateUser(args CreateUserArgs) error
	UpdateUserName(userId uuid.UUID, name string) error
	UpdateUserPassword(userId uuid.UUID, password []byte, newPassword []byte) (bool, error)
	DeleteUser(userId uuid.UUID, password []byte) error
}

type User struct {
	Id        uuid.UUID `json:"id"`
	Name      string    `db:"name"`
	Password  []byte    `db:"password"`
	CreatedAt time.Time `db:"created_at"`
	UpdatedAt time.Time `db:"updated_at"`
}

type CreateUserArgs struct {
	Id       uuid.UUID
	Name     string
	Password []byte
}

// GetUser Idからユーザーを取得する
func (repo *SqlxRepository) GetUserById(userId uuid.UUID) (*User, error) {
	var user User
	err := repo.db.Get(&user, "SELECT * FROM users WHERE id = ?", userId)
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (repo *SqlxRepository) GetUserByName(name string) (*User, error) {
	var user User
	err := repo.db.Get(&user, "SELECT * FROM users WHERE name = ?", name)
	if err != nil {
		return nil, err
	}
	return &user, nil
}

// CreateUser ユーザーを作成する
func (repo *SqlxRepository) CreateUser(args CreateUserArgs) error {
	_, err := repo.db.Exec("INSERT INTO users (id, name, password) VALUES (?, ?, ?)", args.Id, args.Name, args.Password)
	if err != nil {
		return err
	}
	return nil
}

// UpdateUserName ユーザー名を更新する
func (repo *SqlxRepository) UpdateUserName(userId uuid.UUID, name string) error {
	_, err := repo.db.Exec("UPDATE users SET name = ? WHERE id = ?", name, userId)
	if err != nil {
		return err
	}
	return nil
}

// UpdateUserPassword パスワードを更新する
func (repo *SqlxRepository) UpdateUserPassword(userId uuid.UUID, password []byte, newPassword []byte) (bool, error) {
	result, err := repo.db.Exec("UPDATE users SET password = ? WHERE id = ? AND password = ?", newPassword, userId, password)
	if err != nil {
		return false, err
	}
	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return false, err
	}
	if rowsAffected == 0 {
		return false, nil
	}

	return true, nil
}

// DeleteUser ユーザーを削除する
func (repo *SqlxRepository) DeleteUser(userId uuid.UUID, password []byte) error {
	tx := repo.db.MustBegin()
	var user User
	err := tx.Get(&user, "SELECT * FROM users WHERE id = ?", userId)
	if err != nil {
		tx.Rollback()
		return err
	}
	if !bytes.Equal(user.Password, password) {
		tx.Rollback()
		return ErrNotOwned
	}

	_, err = tx.Exec("DELETE FROM ownership WHERE user_id = ?", userId)
	if err != nil {
		tx.Rollback()
		return err
	}

	result, err := tx.Exec("DELETE FROM tasks WHERE id NOT IN (SELECT task_id FROM ownership)")
	if err != nil {
		tx.Rollback()
		return err
	}
	rowsAffected, err := result.RowsAffected()
	if err != nil {
		tx.Rollback()
		return err
	}
	log.Println("Deleted tasks:", rowsAffected)

	_, err = tx.Exec("DELETE FROM users WHERE id = ?", userId)
	if err != nil {
		tx.Rollback()
		return err
	}
	tx.Commit()
	return nil
}
