package com.shayan.ticktackbackend.api.model;

import java.sql.Date;
import java.sql.Timestamp;

public class Game {

    private int id;
    private Timestamp startDate;
    private int state;
    private int winnerPlayerId;

    public Game(int id, Timestamp startDate, int state, int winnerPlayerId) {
        this.id = id;
        this.startDate = startDate;
        this.state = state;
        this.winnerPlayerId = winnerPlayerId;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Timestamp getStartDate() {
        return startDate;
    }

    public void setStartDate(Timestamp startDate) {
        this.startDate = startDate;
    }

    public int getState() {
        return state;
    }

    public void setState(int state) {
        this.state = state;
    }

    public int getWinnerPlayerId() {
        return winnerPlayerId;
    }

    public void setWinnerPlayerId(int winnerPlayerId) {
        this.winnerPlayerId = winnerPlayerId;
    }
}
