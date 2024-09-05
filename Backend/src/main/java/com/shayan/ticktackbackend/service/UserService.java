package com.shayan.ticktackbackend.service;

import at.favre.lib.crypto.bcrypt.BCrypt;
import com.shayan.ticktackbackend.api.model.Account;
import com.shayan.ticktackbackend.api.model.LoginRes;
import org.apache.commons.validator.routines.EmailValidator;
import org.springframework.stereotype.Controller;

import java.security.NoSuchAlgorithmException;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Controller
public class UserService {

    private int nextID = 2;
    private final Connection connection;

    public UserService() {
        DbService dbService = DbService.getInstance();
        connection = dbService.getConnection();
    }

    public Optional<List<Account>> ListUsers() {
        ArrayList<Account> accounts = new ArrayList<>();
        try {
            Statement statement = connection.createStatement();
            statement.execute("SET search_path TO ticktack_schema;");
            ResultSet resultSet = statement.executeQuery("SELECT * FROM account");
            while (resultSet.next()) {
                accounts.add(new Account(resultSet.getInt(1), resultSet.getString(2),
                        resultSet.getString(3), resultSet.getString(4), resultSet.getInt(5), resultSet.getBoolean(6)));
            }
        } catch (SQLException e) {
            System.out.println("Error: " + e.getMessage());
        }
        Optional<List<Account>> optional = Optional.empty();
        optional = Optional.of(accounts);
        return optional;
    }

    public Optional<LoginRes> login(String username, String password) throws Exception {
        Optional<LoginRes> optional = Optional.empty();

            Statement statement = connection.createStatement();
            statement.execute("SET search_path TO ticktack_schema;");
            PreparedStatement ps = connection.prepareStatement("SELECT * FROM account WHERE (username=? OR email=?)");
            ps.setString(1, username);
            ps.setString(2, username);
            ResultSet resultSet = ps.executeQuery();
            if (resultSet.next()) {
                LoginRes loginRes = new LoginRes(new Account(resultSet.getInt(1), resultSet.getString(2),
                        resultSet.getString(3), resultSet.getString(4), resultSet.getInt(5), resultSet.getBoolean(6)), "12345");
                if (!this.checkPassword(password, loginRes.getAccount().getHashedPw())) {
                    throw new Exception("Wrong password.");
                }
                optional = Optional.of(loginRes);
            }

        return optional;
    }


    public Optional<Account> patchUser(Account account) throws SQLException {
        Optional<Account> optional = Optional.empty();
            PreparedStatement ps = connection.prepareStatement("UPDATE account SET email = ?, username = ?, hashed_pw = ?, xp = ? where id = ? RETURNING *;");
            ps.setString(1, account.getEmail());
            ps.setString(2, account.getUsername());
            ps.setString(3, account.getHashedPw());
            ps.setInt(4, account.getXp());
            ps.setInt(5, account.getId());
            Statement statement = connection.createStatement();
            statement.execute("SET search_path TO ticktack_schema;");
            ResultSet resultSet = ps.executeQuery();
            if (!resultSet.next()) {
                return optional;
            }
            optional = Optional.of(new Account(resultSet.getInt(1), resultSet.getString(2),
                    resultSet.getString(3), resultSet.getString(4), resultSet.getInt(5), resultSet.getBoolean(6)));

        return optional;
    }

    public Optional<Integer> deleteUser(int id) throws SQLException {
        Optional<Integer> oId;
        Statement statement = connection.createStatement();
        statement.execute("SET search_path TO ticktack_schema;");
        PreparedStatement ps = connection.prepareStatement("DELETE FROM account WHERE ID = ?");
        ps.setInt(1, id);
        ps.execute();
        return Optional.of(id);
    }

    public Optional<Account> postUser(Account newAccount) throws SQLException {
        Optional<Account> user;
        Statement statement = connection.createStatement();
        statement.execute("SET search_path TO ticktack_schema;");
        PreparedStatement ps = connection.prepareStatement("INSERT INTO account (email, username, hashed_pw, admin) VALUES (?, ?, ?, ?) RETURNING *;");
        ps.setString(1, newAccount.getEmail());
        ps.setString(2, newAccount.getUsername());
        ps.setString(3, newAccount.getHashedPw());
        ps.setBoolean(4, newAccount.isAdmin());
        ResultSet resultSet = ps.executeQuery();
        resultSet.next();
        user = Optional.of(new Account(resultSet.getInt(1), resultSet.getString(2),
                resultSet.getString(3), resultSet.getString(4), resultSet.getInt(5), resultSet.getBoolean(6)));
        return user;
    }

    public Optional<LoginRes> signUp(Account newAccount) throws SQLException {
        String hashedPw = this.hashPassword(newAccount.getHashedPw());
        newAccount.setHashedPw(hashedPw);
        Optional<LoginRes> oLoginRes;
        Statement statement = connection.createStatement();
        statement.execute("SET search_path TO ticktack_schema;");
        PreparedStatement ps = connection.prepareStatement("INSERT INTO account (email, username, hashed_pw, admin) VALUES (?, ?, ?, false) RETURNING *;");
        ps.setString(1, newAccount.getEmail());
        ps.setString(2, newAccount.getUsername());
        ps.setString(3, newAccount.getHashedPw());
        ResultSet resultSet = ps.executeQuery();
        resultSet.next();
        LoginRes loginRes = new LoginRes(new Account(resultSet.getInt(1), resultSet.getString(2),
                resultSet.getString(3), resultSet.getString(4), resultSet.getInt(5), resultSet.getBoolean(6)), "12345");
        oLoginRes = Optional.of(loginRes);
        return oLoginRes;
    }

    public String hashPassword(String password) {
        return BCrypt.withDefaults().hashToString(12, password.toCharArray());
    }

    public boolean checkPassword(String password, String hashedPw) {
        BCrypt.Result result = BCrypt.verifyer().verify(password.toCharArray(), hashedPw);
        return result.verified;
    }

    public static boolean isValidEmail(String email) {
        // create the EmailValidator instance
        EmailValidator validator = EmailValidator.getInstance();
        // check for valid email addresses using isValid method
        return validator.isValid(email);
    }
}
