
# TickTack

## *This project is WIP

Many parts might change in the future and there might be unexpected regressions.

## Description

TicTacToe game created using Vite+Sveltekit frontend toolkit.
It's main feature is how customizable it is, allowing for many grid sizes, modifying number of players, and future multiplayer support.

## Setup

### Prepare to run this project 

1. Install node and npm for your OS.

2. Set the POSTGRES_USER and POSTGRES_PASSWORD in a .env file in the root directory like so:
```
POSTGRES_USER=exampleUser
POSTGRES_PASSWORD=examplePassword
```

3. Run `docker compose up -d` in the root directory to create the PostgreSQL database server.
4. Enter the new database server by running `docker exec -it ticktack_db sh -c 'psql -U exampleUser'`.
5. Create the database for this program by entering `CREATE DATABASE ticktack_db;` and switch to this database using `\c ticktack_db`.
6. Set the POSTGRES_USER and POSTGRES_PASSWORD in a .env file in the backend directory to something like this:
```
PRIMARY_ADMIN_USERNAME=primary
PRIMARY_ADMIN_EMAIL=primary@primary.com
PRIMARY_ADMIN_PW=pw
FRONTEND_DOMAIN=localhost:5173
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ticktack_db
DB_USERNAME=exampleUser
DB_PASSWORD=mysecretpassword
API_URI_V1=/api/v1
ADMIN_API_URI_V1=/api/v1/admin
JWT_SECRET=examplePrivateKey
```
7. Run `npm i` in the backend and frontend directories.
8. Ensure /frontend/src/lib/shared/backendRoutes.json points to the backend URLs like so:
```
{
    "login": "http://localhost:3001/api/v1/users/login",
    "users": "http://localhost:3001/api/v1/users"
}
```
    
## Running:

1. Enter the backend directory and type `npm start` in the terminal
2. Go to the frontend directory and enter `npm run dev` and go to the url(s) given in the console.

## Screenshots

### Home Page

![Home page](/screenshots/index.png "Home page")

### Sign In Page

![Sign In Page](/screenshots/sign_in.png "Sign In Page")

### Logged In Home Page

![Logged In Home Page](/screenshots/home_logged_in.png "Logged In Home Page")

### Local PvP Game Start Settings

![Local PvP Game Start Settings](/screenshots/local_pvp_game_settings.png "Local PvP Game Start Settings")

### Local TickTack

![Local TickTack](/screenshots/local_ticktack.png "Local TickTack")

### Light Mode

![Light Mode](/screenshots/light_mode.png "Light Mode")

### Three Players
![Three Players](/screenshots/three_players.png "Three Players")

### 5x25 TickTack

![5x25 TickTack](/screenshots/5x25_ticktack.png "5x25 TickTack")

### 25x25 TickTack

![25x25 TickTack](/screenshots/25x25_winLen20.png "25x25 TickTack")

### 1x1 TickTack

![1x1 TickTack](/screenshots/1x1_ticktack.png "1x1 TickTack")
