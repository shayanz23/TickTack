package com.shayan.ticktackbackend.api.model;

public class LoginRes {
    private User user;

    private String sessionToken;

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getSessionToken() {
        return sessionToken;
    }

    public void setSessionToken(String sessionToken) {
        this.sessionToken = sessionToken;
    }

    public LoginRes(User user, String sessionToken) {
        this.user = user;
        this.sessionToken = sessionToken;
    }
}
