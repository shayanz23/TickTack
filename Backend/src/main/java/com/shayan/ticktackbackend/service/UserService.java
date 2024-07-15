package com.shayan.ticktackbackend.service;

import com.shayan.ticktackbackend.api.model.User;
import org.springframework.stereotype.Service;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class UserService {

    private List<User> userList;
    private int nextID = 2;
    private final Connection connection;

    public UserService() {
        userList = new ArrayList<User>();
        userList.add(new User(0, "donkey21", "monkey", "donkey21@monkey.com"));
        userList.add(new User(1, "mo", "lester", "monkey21@donkey.com"));
        DbService dbService = DbService.getInstance();
        connection = dbService.getConnection();
    }

    public Optional<List<User>> ListUsers() {
        ArrayList<User> users = new ArrayList<>();
        try {
            Statement statement = connection.createStatement();
            statement.execute("SET search_path TO ticktack_schema;");
            ResultSet resultSet = statement.executeQuery("SELECT * FROM account");
            ResultSetMetaData rsmd = resultSet.getMetaData();
            int columnsNumber = rsmd.getColumnCount();
            while (resultSet.next()) {
                users.add(new User(resultSet.getInt(1), resultSet.getString(2),
                        resultSet.getString(3), resultSet.getString(4)));
            }
        } catch (SQLException e) {
            System.out.println("Error: " + e.getMessage());
        }
        Optional<List<User>> optional = Optional.empty();
        optional = Optional.of(users);
        return optional;
    }

    public Optional<User> getUserWPw(String username, String password) {
        Optional<User> optional = Optional.empty();
        try {
            Statement statement = connection.createStatement();
            statement.execute("SET search_path TO ticktack_schema;");
            ResultSet resultSet = statement.executeQuery("SELECT * FROM account");
//            ResultSetMetaData rsMd = resultSet.getMetaData();
//            int columnsNumber = rsMd.getColumnCount();
            while (resultSet.next()) {
                System.out.println(resultSet.getString(3));
                if (Objects.equals(username, resultSet.getString(3))) {
                    System.out.println(resultSet.getString(3));
                    if (Objects.equals(password, resultSet.getString(4))) {
                        optional = Optional.of(new User(resultSet.getInt(1), resultSet.getString(2),
                                resultSet.getString(3), resultSet.getString(4)));
                        break;
                    }
                }
            }
        } catch (SQLException e) {
            System.out.println("Error: " + e.getMessage());
        }
        return optional;
    }


    public Optional<User> patchUser(User user) throws SQLException {
        Optional<User> optional = Optional.empty();
            PreparedStatement ps = connection.prepareStatement("UPDATE account SET email =?, accountname=? where id=? RETURNING *;");
            ps.setString(1, user.getEmail());
            ps.setString(2, user.getUsername());
            ps.setInt(3, user.getId());
            Statement statement = connection.createStatement();
            statement.execute("SET search_path TO ticktack_schema;");
            ResultSet resultSet = ps.executeQuery();
            resultSet.next();
//            ResultSetMetaData rsMd = resultSet.getMetaData();
//            int columnsNumber = rsMd.getColumnCount();
            optional = Optional.of(new User(resultSet.getInt(1), resultSet.getString(2),
                    resultSet.getString(3), resultSet.getString(4)));

        return optional;
    }

    public Optional<User> deleteUser(int id) {
        Optional<User> optional = Optional.empty();
        for (int i = 0; i < userList.size(); i++) {
            if (id == userList.get(i).getId()) {
                optional = Optional.of(userList.remove(id));
                break;
            }
        }
        return optional;
    }

    public Optional<User> postUser(User newUser) {
        Optional<User> optional = Optional.empty();
        boolean userNameExists = false;
        for (User user : userList) {
            if (Objects.equals(user.getUsername(), newUser.getUsername())) {
                userNameExists = true;
                break;
            }
        }
        if (!userNameExists) {
            newUser.setId(nextID);
            userList.add(newUser);
            optional = Optional.of(newUser);
            nextID++;
        }
        return optional;
    }
}
