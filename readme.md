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
  "private_key_id": "412af58cc154b87bf4d2052875a3d8c0a453c171",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC20rEmcXNG3k/B\n0q5+92SKSXcpkhz+4YSLieXAqAIs+TQ/3Lvos+VcaCcWRL4dm912ykhKJ4IvOsuB\nV3mIcWD/qFZZr3gwKLN+VEM7++rJT/sHrd0p6qCWmOtusUgyFqqaVGUNU79CGqc1\nrNWQiy2XhFvfvyldFHu6JDvB4LA4w7xZOCehQ1KH4ADwOp3meZLdwW76TK7uwlPu\n5r3bUfF6qZSVK26FyS5E71Ora/7wlbz0lKq4CQA8fpTkUDxObOPI7/Odhj+XlnDk\n4p3u10XWf5/V5vgbLaLjaH5ziyDG5SrSycOTBYS6c5avPA2HJ9E/OOQ9dgqdM2VL\n0NJvXpoPAgMBAAECggEAOawpWhk75kVHH7uYdFESlFUslB6Vqwn1SBeONMJLPWi3\nxNWbKYNmfUoV2n6BAtIigNC7ETl5ZfDENd8kZZhuove1lcE2xupwBRALzaZgoHTs\nmbWNKSXs1tUSn+6o+bQQyXKKFjQvB2llCheln11oWn3UhbbGE6jchxHbEAQTUzRT\nLsrjvwcmQWGPx62axnWoAG27BwMPCAUgmC2ZUErEz2EoyMiaUvlfWxRMPSC2+Lkn\nUu9YORUbWAK5JNlbxpQEckgWOF5NCxuj9a1lMol7UN4/WVGJwF1aIaDEaS47qkci\nmeeCxvBXeJUcTjKR76Qspp2CLB8nzsJfSOKPxsDJcQKBgQDnamKe7oTN/scWEl/o\nXaEiANPRGIzn2rvH9fs/6L0tEHSI+dLq7ZwBTmBSmPa9dJoYMW6EoTedfatw3MiZ\nSrG7m7xu/Ej2jNxta807PgjOqhv8SpHuZ8kqqRsMdL2sWfy0g0hvlEad5ulQZQAM\nolIlSQS3HQ0aYSssDKTjxXBX7QKBgQDKPsakryRi/yGrhrAOtserQj8tCpxpgExH\nTnULm2fnSGDHbalCo9hAP/FbJqegnX0w2+5QL15lCOWzU80SPJ6p/j1LUSqYP72q\nZnfK2tMykaK2sXwUZo53M0INf3nDEvM/vVBIvvxW7YlfPMBMc1VbyU1aWlHboXgQ\nS0JP4GICawKBgQDEbuuT2QdmDFRWCfbbOU7jnCwwm1RQIr2u+L/y+c5LCGLDOrys\nqlD4Ut00f59CJk3/J0aW0npw9xGl1eN5K4w+oe2LkB8nGV6qiw1Esl2rf34N5AaH\nhhWeXrkVE6tFN4VofN/pxsVCl5WIppMqJkbwW1DjVoee0shgtcLpjNjV6QKBgGsu\nkb+9Qh9k7sckfjGOFItidHC+at5OrB4uKkGYfpxH82I9b7JterGyMYsJFVU9oZc/\nNzEvqWsKKBG9m7TKg5u7rWg4/8XoIfAoldvf1IW8QOtpbESzhVUOyTa2FCWZ6Wgi\nQGYNMVYwVNkwLQlXJimaqW/05eTr0eFwwRfr5oU5AoGAVfFiYiUtvpSpTeFkDZgn\nSbNaUuSlXLjVWfpw0/OaZBzyYZiefC45a4goyGbKtbIawvXaQR3W5VfnJpy7E0rk\nKXZrgP6wg4Z8jms0DeWvSVCwZaVWH4jXJnC7BL+xQA8iLx7V9+jxEjG28JNGjEwp\nwAAyr/q/73ow/l5biMSfig4=\n-----END PRIVATE KEY-----\n",
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
