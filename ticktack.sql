DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;
SET search_path TO public;

CREATE TYPE _role AS ENUM ('user', 'admin', 'primary_admin');
CREATE TYPE _theme AS ENUM ('system', 'dark', 'light');

CREATE TABLE _user (
  id INTEGER NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  email VARCHAR(50) NOT NULL UNIQUE,
  username VARCHAR(20) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL,
  xp INTEGER NOT NULL DEFAULT 0,
  xp_public BOOLEAN NOT NULL DEFAULT TRUE,
  --  dark_theme 0 is system, 1 is dark, 2 is light
  theme _theme NOT NULL DEFAULT 'system',
  role _role NOT NULL DEFAULT 'user'
);  

CREATE TABLE game_type (
  id INTEGER NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(25) NOT NULL UNIQUE,
  description text
);  

CREATE TABLE game (
  id INTEGER NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  winner_id VARCHAR(25) NOT NULL,
  type_id INTEGER NOT NULL REFERENCES game_type,
  date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  player_ids INTEGER[] NOT NULL,
  box_player_ids INTEGER[][] NOT NULL
);   

INSERT INTO game_type (name, description) VALUES ('local_pvp', 
'Local multiplayer tictactoe on one computer, with each person playing when its their turn.'); 
INSERT INTO game_type (name, description) VALUES ('online_pvp', 
'Online multiplayer tictactoe on multiple computers, with each person playing when its their turn.'); 
INSERT INTO game_type (name, description) VALUES ('online_pve', 
'Offline singleplayer game without any humans.');

   IF (SELECT xp_public FROM _users) = TRUE THEN
      SELECT id, username, xp, xp_public, FROM _user;
   ELSE
      SELECT id, username, xp_public, FROM _user;
   END IF;