package com.shayan.ticktackbackend.api.model;

import lombok.Getter;
import lombok.Setter;

public class LoginRes {

    @Setter
    @Getter
    private Account account;
    @Setter
    @Getter
    private String sessionToken;

    public LoginRes(Account account, String sessionToken) {
        this.account = account;
        this.sessionToken = sessionToken;
    }
}
