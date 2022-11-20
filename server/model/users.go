package model

import "github.com/google/uuid"

type UsersRepository interface {
	GetUser(userId uuid.UUID) (*User, error)
	CreateUser(args CreateUserArgs) error
}

type User struct {
	Id       uuid.UUID `json:"id"`
	Name     string    `db:"name"`
	Password []byte    `db:"password"`
}

type CreateUserArgs struct {
	Id       uuid.UUID
	Name     string
	Password []byte
}

// GetUser Idからユーザーを取得する
func (repo *SqlxRepository) GetUser(userId uuid.UUID) (*User, error) {
	var user User
	err := repo.db.Get(&user, "SELECT * FROM users WHERE id = ?", userId)
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
