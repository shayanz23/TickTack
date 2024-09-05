package com.shayan.ticktackbackend.api.model;

import lombok.Getter;
import lombok.Setter;

import java.sql.Date;
import java.sql.Timestamp;
import java.util.ArrayList;

public class Game {

    @Getter
    @Setter
    private int id;
    @Getter
    @Setter
    private Timestamp startDate;
    @Getter
    @Setter
    private int state;
    @Setter
    @Getter
    private String winnerUsername;
    @Setter
    @Getter
    private ArrayList<String> playerUsernames;
    @Setter
    @Getter
    private ArrayList<ArrayList<String>> usernameBoxes;

    public Game(int id, Timestamp startDate, int state, String winnerUsername) {
        this.id = id;
        this.startDate = startDate;
        this.state = state;
        this.winnerUsername = winnerUsername;
    }

}
