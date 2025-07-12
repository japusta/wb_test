# Сервис для получения и обновления тарифов Wildberries

## Описание

Сервис выполняет две задачи:

1. Регулярно получает тарифы для коробов с Wildberries и сохраняет их в PostgreSQL.
2. Обновляет актуальные тарифы в произвольное количество Google-таблиц (по ID), сортируя их по коэффициенту.

Данные обновляются каждый час. Повторные запросы в течение дня обновляют существующие записи.

## Используемые технологии

- Node.js + TypeScript
- PostgreSQL
- Knex.js
- Google Sheets API
- Docker + docker-compose
- Cron

---

## Как запустить

### 1. Клонируйте репозиторий и установите зависимости

```bash
git clone https://github.com/japusta/wb_test.git
cd wb_test
npm install
```

### 2. Добавьте .env файл
Создайте файл ```.env``` на основе ```.env.example```.

### 3. Укажите токен Wildberries и путь к Google Service Account JSON:

```
TARIFFS_API_TOKEN=eyJhbGciOiJFUzI1NiIsImtpZCI6IjIwMjUwNTIwdjEiLCJ0eXAiOiJKV1QifQ.eyJlbnQiOjEsImV4cCI6MTc2NTY3MDIyOSwiaWQiOiIwMTk3NmU0Yy1mZTgwLTc1NDAtODkyMi02NGE5ZWUzYTU4MzYiLCJpaWQiOjQ1OTExNjA5LCJvaWQiOjExMzA0NiwicyI6MTA3Mzc0MTgzMiwic2lkIjoiOTMyYzE3NmEtNTA4NS01YzZmLWJjMzMtNGU4NGNkZjU4ZDdlIiwidCI6ZmFsc2UsInVpZCI6NDU5MTE2MDl9.wDoH8FLdZu1049uPCmhx3UHaw28YJB-CylWeD2LgkpRZFIMlOsUlnlVmfmYKy__JWNjfbDkOtdJ69QpSD5EKag
```

```
GOOGLE_SERVICE_ACCOUNT_JSON=./google-service-account.json
```

Также укажите ID хотя бы одной тестовой Google-таблицы в переменной ```TEST_SPREADSHEET_ID``` и диапазон полей ```GOOGLE_SHEETS_TARIFFS_RANGE```.

```
TEST_SPREADSHEET_ID=1fvV4rvShAmS5_5sd5PpwUGSe65GMju9iVHx8Herc5Q8
GOOGLE_SHEETS_TARIFFS_RANGE="stocks_coefs!A:G"
```

### 4. Укажите данные для PostgreSQL

```bash
POSTGRES_PORT=5432
POSTGRES_DB=postgres
POSTGRES_USER=postgres
POSTGRES_PASSWORD=1111
POSTGRES_HOST=localhost
APP_PORT=5000
# запускать каждый день в 1:00 ночи
APP_CRON_SCHEDULE="0 1 * * *"
```

### 5. Создайте файл google-service-account.json в корне проекта

```bash
{
  "type": "service_account",
  "project_id": "soy-braid-465115-d1",
  "private_key_id": "fd27d5ee8742df167d5fb23b84ebfeb479e06f2f",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQCc6WXuXRV1Z46D\nekXOpjotz4E9UjOEtxSOe/JCiwFLrjPqpXZaIrgkYypStatnARht+nzG4+FUxcf6\noKU6iX7l4SNYJpu8AYvVYLy6hulSJ6rmxOeow/K4FLAT3bg2wriDkfCsHbiB5gpg\nZ81uWBqwu4MszlhWEZ3NVQmyXJhS+DlYb5nU2rKHZxX/05feiM2D6FbxROVPIFnN\nOPQKGJIeSb1KDeYa91EiHne3mRnJJQNAFKzdB/ADQNW4Gn7+u8gkJU0jg4/gCZvV\n7+2ppFkXLRgq1PmFtKi14I5vYFRNA1odOYERPSE4KtgOq+sEwkkHKE733A9mS4L+\nRd5wQlf1AgMBAAECggEABekCpl5KMyBh7VDbNUPsmBIjT5B7kUmmFBHWF6yNsXCP\n0wxFb3K0VeaITxI5sQkJBwdy0Lj/oUZL2IRZhOFt7rGyt5zIq+WxAyoAIdR4EFif\nJs8O3Lv4tfdNhIoK6MEf2xDRrGH4M6hbBrOSONBHvRVrBPKGwEMsmvHTiizTrfhN\nccZMHaZQYvd2fKFYVdFrIVKmwhJr+G+Uq5qvft37TlEze6X7HfSjIuYO+Pi3dtnH\no8rW/jR2/hHmMsNNWPjo5+o634FjPSPpNxn9WrQI9wecHVhkj3KrqJ9nkCXPbySB\nQ2vmDHUa1mllvwe1bNgUVwQue5IhwCwoaoiiNb0jcQKBgQDOcKs5PCkLc/1HfJKj\n2kCzJufFdQc/EWcK0amWuDl3h35Y9GtKtBOp3oJgjsIC4ueynOJHrwXFF6vREK5r\nOb70PdJTXa4exmlo2lBzHrbTElrhj2KMGwySsh9CUirwxry/C2PZqNc2OUSXl8VO\nfukRo4K+COm1a8V1pe9TpFZ7LQKBgQDClNQZqqR6ZqdPQUMH6VfscrMXS6/7S52B\nDcaGsX3PHIYIagRtQk5o7sHnqKObEQuJaM/laI4mt23KCvsGhLbxKcVwISwdgnUt\nBLpX4ne/QhqjMVqwOGMBmxvDHLQBlBM6lAWEhoJNkTSItCTxm9V2vn3YuV7LnA5q\n0RlvBDKs6QKBgQCeUv6eWKtJ41z+dGWqUHqKa24Zm9VA40HZpE6iDwvTxhB6fInE\nszLZdpMbJqFYwVjdPUC1pV+RdsQJBPgfuBvhCYDC+vfNFnJFPhmxEH86hbs5flQg\nC6aq4vziSk4wdtrO0hd0GO9k4KrgcD+cIezx4CsnP4Kt5sd7oRVZWpIQyQKBgQCF\nv7drTRhx6k3m9H0W2xZMuSrRQH1exsMlCksEGszXqEuZTQZt873h8vvmOMz8seK0\nOQ9uKUhM5Jja4GFcQa1eZ9AHG0YvopTYtP9BmbGmDdIxiqNDrf6gA/Y5T2mMDDSL\nd2OzjKHUn5L0xJ8AVJWOYbIvXnwCiOqAEerhnIkYwQKBgQC/AmzTuKUuNZkpOfsD\nOAkfKobdYme4MKk5yfNl9It1B483AYqb7Q5+O9Hy0gB6ujSIryJ7HfV4Ag7lFOLr\nq8fMgMkEWWRDgXNjvGGKOX9nO25WEKHLcVSC4VhP+fbImVe6Jb7kToNcWT9AxGsL\nqw1gSVBWQ7g3Vmdp2fS5qvKBxg==\n-----END PRIVATE KEY-----\n",
  "client_email": "sheets-access-695@soy-braid-465115-d1.iam.gserviceaccount.com",
  "client_id": "104914004430158898590",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/sheets-access-695%40soy-braid-465115-d1.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}

```

## Команды:

Запуск базы данных:
```bash
docker compose up -d --build postgres
```

Для выполнения миграций и сидов не из контейнера:
```bash
npm run knex:dev migrate latest
```

```bash
npm run knex:dev seed run
```

Команды для разработки
Миграции и сиды (локально):
```bash
npm run knex:dev migrate rollback
npm run knex:dev migrate latest
npm run knex:dev seed run
```
Для запуска приложения в режиме разработки:
```bash
npm run dev
```

Запуск проверки самого приложения:
```bash
docker compose up -d --build app
```

Для финальной проверки рекомендую:
```bash
docker compose down --rmi local --volumes
docker compose up --build
```
