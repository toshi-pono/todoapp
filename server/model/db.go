package model

import (
	"fmt"
	"os"

	_ "github.com/go-sql-driver/mysql"
	"github.com/jmoiron/sqlx"
)

func defaultDSN(host, port, user, password, dbname string) string {
	return fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true&loc=Asia%%2FTokyo", user, password, host, port, dbname)
}

func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}

func EstablishConnection() (*sqlx.DB, error) {
	dsn := defaultDSN(
		getEnv("DB_HOST", "localhost"),
		getEnv("DB_PORT", "3306"),
		getEnv("DB_USER", "sysdes"),
		getEnv("DB_PASSWORD", "sysdes"),
		getEnv("DB_NAME", "sysdes_todolist_db"))
	db, err := sqlx.Open("mysql", dsn)

	return db, err
}
