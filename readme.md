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
  "type": ,
  "project_id": ,
  "private_key_id": ,
  "private_key": ,
  "client_email": ,
  "client_id": ,
  "auth_uri": ,
  "token_uri": ,
  "auth_provider_x509_cert_url": ,
  "client_x509_cert_url": ,
  "universe_domain": 
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

## Ссылка на гугл-таблицу

https://docs.google.com/spreadsheets/d/1fvV4rvShAmS5_5sd5PpwUGSe65GMju9iVHx8Herc5Q8/edit?gid=0#gid=0

### Работоспособность проекта

<img width="548" height="297" alt="image" src="https://github.com/user-attachments/assets/d99b91ad-1235-44c4-bf9b-6fb39c36b67d" />

<img width="758" height="886" alt="image" src="https://github.com/user-attachments/assets/e6091c4d-1726-4f20-a158-6b114353ac0f" />

<img width="1899" height="945" alt="image" src="https://github.com/user-attachments/assets/99c883ca-05ed-44f4-92ae-c4fb6cc5a642" />


<img width="664" height="674" alt="image" src="https://github.com/user-attachments/assets/0ab44383-b2a7-431b-893a-a1cbf435c30a" />

<img width="902" height="856" alt="image" src="https://github.com/user-attachments/assets/b30be3ec-f79d-48d8-8194-0dfe135cca72" />
