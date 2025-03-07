DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;
SET search_path TO public;

CREATE TYPE _role AS ENUM ('user', 'admin');
CREATE TYPE _theme AS ENUM ('system', 'dark', 'light');

CREATE TABLE _user (
  id INTEGER NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  email VARCHAR(50) NOT NULL UNIQUE,
  username VARCHAR(20) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL,
  xp INTEGER NOT NULL DEFAULT 0,
  role _role NOT NULL DEFAULT 'user'
);  

--   dark_theme 0 is system, 1 is dark, 2 is light
CREATE TABLE user_setting (
  user_id INTEGER PRIMARY KEY REFERENCES _user ON DELETE CASCADE,
  theme _theme NOT NULL DEFAULT 'system'
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
  player_ids VARCHAR(25)[] NOT NULL,
  box_player_ids VARCHAR(25)[][] NOT NULL
);   

INSERT INTO _user (email, username, password, role) VALUES ('donkey', 'donkey', 'donkey', 'admin');
INSERT INTO _user (email, username, password) VALUES ('monkey@monkey.ca', 'monkey', 'monkey');
INSERT INTO user_setting (user_id, theme) VALUES (1, 'system'); 
INSERT INTO user_setting (user_id, theme) VALUES (2, 'dark'); 
INSERT INTO game_type (name, description) VALUES ('local_pvp', 
'Local multiplayer tictactoe on one computer, with each person playing when its their turn.'); 
INSERT INTO game_type (name, description) VALUES ('online_pvp', 
'Online multiplayer tictactoe on multiple computers, with each person playing when its their turn.'); 
INSERT INTO game (winner_id, type_id, player_ids, box_player_ids) VALUES ('1', 1, ARRAY['1', '2'], 
ARRAY[ARRAY['1', '1', '2'], ARRAY['2', '2', '2'], ARRAY['1', '2', '1']]);
-- INSERT INTO account_game (user_id, game_id) VALUES (1, 1);
-- INSERT INTO account_game (user_id, game_id) VALUES (2, 1);
