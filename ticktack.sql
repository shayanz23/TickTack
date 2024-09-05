DROP SCHEMA IF EXISTS ticktack_schema CASCADE;
CREATE SCHEMA ticktack_schema;
SET search_path TO ticktack_schema;

CREATE TABLE account (
  id INTEGER NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  email VARCHAR(50) NOT NULL UNIQUE,
  username VARCHAR(20) NOT NULL UNIQUE,
  hashed_pw VARCHAR(100) NOT NULL,
  xp INTEGER NOT NULL DEFAULT 0,
  admin BOOLEAN NOT NULL DEFAULT false
);  

--   dark_theme 0 is system, 1 is dark, 2 is light
CREATE TABLE account_setting (
  account_id INTEGER PRIMARY KEY REFERENCES account ON DELETE CASCADE,
  theme SMALLINT NOT NULL UNIQUE
);  

CREATE TABLE game_type (
  id INTEGER NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(25) NOT NULL,
  description text
);  

CREATE TABLE game (
  id INTEGER NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  winner_username VARCHAR(100),
  type_id INTEGER NOT NULL REFERENCES game_type,
  date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  player_usernames VARCHAR(100)[],
  box_usernames VARCHAR(100)[][]
);  

-- CREATE TABLE account_game (
--   account_id INTEGER NOT NULL,
--   game_id INTEGER NOT NULL REFERENCES game ON DELETE CASCADE,
--   PRIMARY KEY(account_id, game_id)
-- );  

INSERT INTO account (email, username, hashed_pw, admin) VALUES ('donkey@donkey.ca', 'donkey', 'donkey', true);
INSERT INTO account (email, username, hashed_pw) VALUES ('monkey@monkey.ca', 'monkey', 'monkey');
INSERT INTO account_setting (account_id, theme) VALUES (1, 0); 
INSERT INTO account_setting (account_id, theme) VALUES (2, 2); 
INSERT INTO game_type (name, description) VALUES ('local_pvp', 'Local multiplayer tictactoe on one computer, with each person playing when its their turn.'); 
INSERT INTO game_type (name, description) VALUES ('online_pvp', 'Online multiplayer tictactoe on multiple computers, with each person playing when its their turn.'); 
INSERT INTO game (winner_username, type_id, player_usernames, box_usernames) VALUES ('monkey', 1, ARRAY['donkey', 'monkey'], 
ARRAY[ARRAY['donkey', 'donkey', 'monkey'], ARRAY['monkey', 'monkey', 'monkey'], ARRAY['', '', '']]);
-- INSERT INTO account_game (account_id, game_id) VALUES (1, 1);
-- INSERT INTO account_game (account_id, game_id) VALUES (2, 1);
