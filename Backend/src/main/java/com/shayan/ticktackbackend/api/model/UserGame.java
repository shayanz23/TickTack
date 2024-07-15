package com.shayan.ticktackbackend.api.model;

public class UserGame {

    private int id;
    private int playerId;
    private int gameId;

    public UserGame(int id, int playerId, int gameId) {
        this.id = id;
        this.playerId = playerId;
        this.gameId = gameId;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getPlayerId() {
        return playerId;
    }

    public void setPlayerId(int playerId) {
        this.playerId = playerId;
    }

    public int getGameId() {
        return gameId;
    }

    public void setGameId(int gameId) {
        this.gameId = gameId;
    }
}
