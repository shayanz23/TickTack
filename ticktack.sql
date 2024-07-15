DROP SCHEMA IF EXISTS ticktack_schema CASCADE;
CREATE SCHEMA ticktack_schema;
SET search_path TO ticktack_schema;

CREATE TABLE account (
  id INTEGER NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  email VARCHAR(20) NOT NULL UNIQUE,
  accountname VARCHAR(20) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL
);  

--   dark_them 0 is system, 1 is dark, 2 is light
CREATE TABLE account_setting (
  account_id INTEGER PRIMARY KEY REFERENCES account,
  theme SMALLINT NOT NULL UNIQUE
);  

CREATE TABLE game_type (
  id INTEGER NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY    ,
  name VARCHAR(25) NOT NULL,
  description text
);  

CREATE TABLE game (
  id INTEGER NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  winner_id INTEGER NOT NULL REFERENCES account,
  type_id INTEGER NOT NULL REFERENCES game_type,
  date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
--   player_grid number[][]
);  

CREATE TABLE account_game (
  account_id INTEGER NOT NULL REFERENCES account,
  game_id INTEGER NOT NULL REFERENCES game,
  PRIMARY KEY(account_id, game_id)
);  

INSERT INTO account (email, accountname, password) VALUES ('donkey@donkey.ca', 'donkey', 'donkey1234'); 
INSERT INTO account (email, accountname, password) VALUES ('monkey@donkey.ca', 'monkey', 'monkey1234'); 
INSERT INTO account_setting (account_id, theme) VALUES (1, 0); 
INSERT INTO account_setting (account_id, theme) VALUES (2, 2); 
INSERT INTO game_type (name, description) VALUES ('local_pvp', 'Local multiplayer tictactoe on one computer, with each person playing when its their turn.'); 
INSERT INTO game (winner_id, type_id) VALUES (1, 1);
INSERT INTO account_game (account_id, game_id) VALUES (1, 1);
INSERT INTO account_game (account_id, game_id) VALUES (2, 1);