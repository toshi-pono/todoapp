package model

import "errors"

const (
	ErrDuplicateKey = 1062
)

var (
	ErrNotOwned     = errors.New("permission denied")
	ErrUserNotFound = errors.New("user not found")
)
