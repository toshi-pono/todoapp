package util

import (
	"crypto/sha256"
	"os"
)

func getSalt() string {
	salt := os.Getenv("PASSWORD_SALT")
	if salt == "" {
		salt = "todolist.go#"
	}
	return salt
}

func HashPassword(password string) []byte {
	salt := getSalt()
	h := sha256.New()
	h.Write([]byte(salt + password))
	return h.Sum(nil)
}
