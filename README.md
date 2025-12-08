# Hotel Project

This project was built as part of a job interview.  
It includes a Laravel API backend providing a complete CRUD for hotel entries (with image upload support), and a Next.js frontend that contains the corresponding pages (listing, details, creation and editing forms).

## Running the project

The project requires [Docker Desktop](https://www.docker.com/get-started/) to be installed.

## 1. Clone the repository

If you have Git installed:

```bash
git clone https://github.com/Jojau/hotel-project-bukal.git
```

Otherwise, download the ZIP via the **Code → Download ZIP** button and extract it.

## 2. Setup and run the application

Open the root directory of the project in your terminal.

### 2.1 Prepare the backend environment

```bash
cd back
cp .env.example .env
cd ..
```

### 2.2 Start Docker services

```bash
docker compose -f compose.dev.yaml up -d
```

### 2.3 Initialise the Laravel backend

Enter the workspace container:

```bash
docker compose -f compose.dev.yaml exec workspace bash
```

Install dependencies and initialise the application:

```bash
composer install
npm install
php artisan key:generate
php artisan storage:link
php artisan migrate
php artisan db:seed
```

> Note: During `php artisan migrate`, you may be asked to create the database. Press Enter to confirm.

Exit the container:

```bash
exit
```

### 2.4 Restart the Docker containers

Because the `.env` file has now been generated with an application key, the containers must be restarted:

```bash
docker compose -f compose.dev.yaml down
docker compose -f compose.dev.yaml up -d
```

## 3. Access the application

Open your browser and navigate to:

**http://localhost:3000**

The frontend may take up to a minute to fully start.  
If you see a temporary *NetworkError*, simply refresh the page until the server becomes available.
