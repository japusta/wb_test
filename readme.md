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
  "project_id": "vital-future-465713-n1",
  "private_key_id": "494c3e9f9273096a92be773706edc5b0effdf613",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCthW7YBwrTdiwV\n1t9zNJFayx9KsiGz1CnkQXw5XVjrvfx0OJ55cnwNwtidCNF+aSUrVWbdkJNVPHCt\np6HUzyUmjQ8Je7TPfXs31l1YqyGGJfYasxGH3Yg/04sGcewBEoyG+vi8+eOjDKE3\nHWI/tfaPpkghsJfacA0IG5NUADQNjZphgMWaCiv71M42HC6i3P9vpmg5+f21s8O6\n8rorInanJ+qIhZCUDaWWI/TEpgEonqGmWZJ7ro5mM8JH1Ay5Ku06QkWfQxmfnlHE\nBfJVvADempHN75IbMHGoHwsMuQCKv4uw7/fKbKHd6mpfpX1IyUDrNQ/Tw4aDpwbc\n1D0lbzxtAgMBAAECggEAHAO0qVZ7uje0NuNtyH8Gb6LnHqtjMxIQIFytNmK6gjb2\nXPouJbvkyOD6EWJU1kSZ/mTHmoJmswZyx6qOf1nhLNftw1FwV+ZxoApxICli3HJh\nCR77d9S9lFZuNeBrIqIww3Md+P6cMJ0PoyMQk2ookDkfoKbO4XKhO/udvdxZiw1a\nsCK+DFvyR6N67FsXuMvVPbUfmunyX7AYs0s1hMx9vITuhYGVXBG2L4Rzm7kiTR7X\nRgWvxIMC4EUHul6KWxfEaUbHi5Ltg3NRFzWFkjuNCnYW02YRN4Yu4SzbKJCLiPFR\n+8yiIpD0aSv4GJ5YPpBerTKQTX/nyrmFc9N9p7RiqQKBgQDvh/THAJjMwQKjK/Ak\n7AQMlVYd8FrKJZb6dtbAX6usSFHHuUsD+PNJeIKNmnkEuBv1tH7aqiOxsKjj4Iic\nxzYURk92tHqROOA96bi9u9Otlp2fY8XcI6VRB9FNa3n2Qz3RrOXJjHS2gPGAfRvF\n0mM0BAH/rcAGpJi+O90WElpTGQKBgQC5c58dus07BSNpvRraBdSP+rtks5Hsbspv\ngXUk/Q6npoo8UxH0FvkV8GH6pwuzC1FlMjhCsso/2NCXqPu74Kd0OPc/DUYXDR9p\nne7BBB6+vhL4LGJGkMKN4CRoZjY8op23QTIPujy67ZHkMOHl8W1F1o26M2BVkcgo\nFyDp2DuSdQKBgA8hm4jmtMBagPwlzmnGrwrMdEA36sRSU5NG5pIIeSPM/b2MKvz5\nQQUnI7gmRfbSWpHO8SSHEvIqosCicn7U5smpF2P8SrHZ0fCXTyBNOTYCCbsD5n/d\nkJfp0oL9gxrXbJROQ8XTpZvR0W+4d4SrobCrgCTSqQrCYxPBXFoElsghAoGAJdVa\nrrv/Rn0j3lx/796koMLsG/0uVee8UMc+WM9vf/BP30KrNPrC0iD6PCJ8FojGkDiQ\nlbrX2/Kli2skAA4y21kLx8czd1xr/iYEIUhv5UXtpMeZPQAnUL5bbxj7E5+xQUOB\nrQe3gAMbckwuqbR5MHg27bexfYOCK/ub8Vj1vkkCgYEAio9BN00Kw0MRtUN6nDnL\nRIGfdox5GrH8w60jKr9hoYLG4JIiUakbkpqlmlfpE7m/DxwO+67sFXYjUJT3TLKX\n8H+C0fmycF7yZhnXZAcyRu8vrYobV59Tfu8v9kfEzY29QebpqaT9cfVhtsBUS9RX\nS8dr0YM/IPXdW0iZKhore+o=\n-----END PRIVATE KEY-----\n",
  "client_email": "wb-test@vital-future-465713-n1.iam.gserviceaccount.com",
  "client_id": "102508097358513836227",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/wb-test%40vital-future-465713-n1.iam.gserviceaccount.com",
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

## Ссылка на гугл-таблицу

https://docs.google.com/spreadsheets/d/1fvV4rvShAmS5_5sd5PpwUGSe65GMju9iVHx8Herc5Q8/edit?gid=0#gid=0
