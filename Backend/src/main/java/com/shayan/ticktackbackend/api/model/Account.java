package com.shayan.ticktackbackend.api.model;

public class Account {

    private int id;
    private String username;
    private String email;
    private String hashedPw;
    private int xp;
    private boolean admin;

    public Account(int id, String email, String username, String password, int xp, boolean admin) {
        this.id = id;
        this.username = username;
        this.hashedPw = password;
        this.email = email;
        this.xp = xp;
        this.admin = admin;
    }

    public int getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getHashedPw() {
        return hashedPw;
    }

    public void setHashedPw(String hashedPw) {
        this.hashedPw = hashedPw;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public int getXp() {
        return xp;
    }

    public void setXp(int xp) {
        this.xp = xp;
    }

    public boolean isAdmin() {
        return admin;
    }

    public void setAdmin(boolean admin) {
        this.admin = admin;
    }
}
