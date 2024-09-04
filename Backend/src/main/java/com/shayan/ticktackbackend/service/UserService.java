package com.shayan.ticktackbackend.service;

import com.shayan.ticktackbackend.api.model.LoginRes;
import com.shayan.ticktackbackend.api.model.User;
import org.springframework.stereotype.Controller;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Controller
public class UserService {

    private int nextID = 2;
    private final Connection connection;

    public UserService() {
        DbService dbService = DbService.getInstance();
        connection = dbService.getConnection();
    }

    public Optional<List<User>> ListUsers() {
        ArrayList<User> users = new ArrayList<>();
        try {
            Statement statement = connection.createStatement();
            statement.execute("SET search_path TO ticktack_schema;");
            ResultSet resultSet = statement.executeQuery("SELECT * FROM account");
            while (resultSet.next()) {
                users.add(new User(resultSet.getInt(1), resultSet.getString(2),
                        resultSet.getString(3), resultSet.getString(4), resultSet.getInt(5), resultSet.getBoolean(6)));
            }
        } catch (SQLException e) {
            System.out.println("Error: " + e.getMessage());
        }
        Optional<List<User>> optional = Optional.empty();
        optional = Optional.of(users);
        return optional;
    }

    public Optional<LoginRes> login(String username, String password) {
        Optional<LoginRes> optional = Optional.empty();
        try {
            Statement statement = connection.createStatement();
            statement.execute("SET search_path TO ticktack_schema;");
            PreparedStatement ps = connection.prepareStatement("SELECT * FROM account WHERE (username=? OR email=?) AND hashed_pw=?");
            ps.setString(1, username);
            ps.setString(2, username);
            ps.setString(3, password);
            ResultSet resultSet = ps.executeQuery();
            if (resultSet.next()) {
                LoginRes loginRes = new LoginRes(new User(resultSet.getInt(1), resultSet.getString(2),
                        resultSet.getString(3), resultSet.getString(4), resultSet.getInt(5), resultSet.getBoolean(6)), "12345");
                optional = Optional.of(loginRes);
            }
        } catch (SQLException e) {
            System.out.println("Error: " + e.getMessage());
        }
        return optional;
    }


    public Optional<User> patchUser(User user) throws SQLException {
        Optional<User> optional = Optional.empty();
            PreparedStatement ps = connection.prepareStatement("UPDATE account SET email = ?, username = ?, hashed_pw = ?, xp = ? where id = ? RETURNING *;");
            ps.setString(1, user.getEmail());
            ps.setString(2, user.getUsername());
            ps.setString(3, user.getHashedPw());
            ps.setInt(4, user.getXp());
            ps.setInt(5, user.getId());
            Statement statement = connection.createStatement();
            statement.execute("SET search_path TO ticktack_schema;");
            ResultSet resultSet = ps.executeQuery();
            if (!resultSet.next()) {
                return optional;
            }
            optional = Optional.of(new User(resultSet.getInt(1), resultSet.getString(2),
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

    public Optional<User> postUser(User newUser) throws SQLException {
        Optional<User> user;
        Statement statement = connection.createStatement();
        statement.execute("SET search_path TO ticktack_schema;");
        PreparedStatement ps = connection.prepareStatement("INSERT INTO account (email, username, hashed_pw, admin) VALUES (?, ?, ?, ?) RETURNING *;");
        ps.setString(1, newUser.getEmail());
        ps.setString(2, newUser.getUsername());
        ps.setString(3, newUser.getHashedPw());
        ps.setBoolean(4, newUser.isAdmin());
        ResultSet resultSet = ps.executeQuery();
        resultSet.next();
        user = Optional.of(new User(resultSet.getInt(1), resultSet.getString(2),
                resultSet.getString(3), resultSet.getString(4), resultSet.getInt(5), resultSet.getBoolean(6)));
        return user;
    }

    public Optional<LoginRes> signUp(User newUser) throws SQLException {
        Optional<LoginRes> oLoginRes;
        Statement statement = connection.createStatement();
        statement.execute("SET search_path TO ticktack_schema;");
        PreparedStatement ps = connection.prepareStatement("INSERT INTO account (email, username, hashed_pw, admin) VALUES (?, ?, ?, false) RETURNING *;");
        ps.setString(1, newUser.getEmail());
        ps.setString(2, newUser.getUsername());
        ps.setString(3, newUser.getHashedPw());
        ResultSet resultSet = ps.executeQuery();
        resultSet.next();
        LoginRes loginRes = new LoginRes(new User(resultSet.getInt(1), resultSet.getString(2),
                resultSet.getString(3), resultSet.getString(4), resultSet.getInt(5), resultSet.getBoolean(6)), "12345");
        oLoginRes = Optional.of(loginRes);
        return oLoginRes;
    }
}
