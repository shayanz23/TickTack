package com.shayan.ticktackbackend.api.controller;

import com.shayan.ticktackbackend.api.model.LoginRes;
import com.shayan.ticktackbackend.api.model.User;
import com.shayan.ticktackbackend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

@RestController
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/login")
    public ResponseEntity login(@RequestHeader String username, @RequestHeader String password) {
        Optional<LoginRes> loginRes = userService.login(username, password);
        if (loginRes.isPresent()) {
            return ResponseEntity.status(HttpStatus.OK).body(loginRes.get());
        } else {
            System.out.println("no!!!!!");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User Not Found");
        }
    }

    @PostMapping ("/signup")
    public ResponseEntity signUp(@RequestBody User newUser) {
        Optional<LoginRes> loginRes;
        try {
            loginRes = userService.signUp(newUser);
        } catch (SQLException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
        if (loginRes.isPresent()) {
            return ResponseEntity.status(HttpStatus.OK).body(loginRes.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error while adding: " + newUser.getUsername());
        }
    }

    @GetMapping("/users")
    public ResponseEntity getAllUsers() {
        Optional<List<User>> user = userService.ListUsers();
        return ResponseEntity.status(HttpStatus.OK).body(user.get());
    }

    @PatchMapping("/user")
    public ResponseEntity patchUser(@RequestBody User updatedUser) {
        Optional<User> user = null;
        try {
            user = userService.patchUser(updatedUser);
            if (user.isPresent()) {
                return ResponseEntity.status(HttpStatus.OK).body(user.get());
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User Not Found");
            }
        } catch (SQLException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @DeleteMapping("/user")
    public ResponseEntity deleteUser(@RequestParam int id) {
        Optional<Integer> oId;
        try {
            oId = userService.deleteUser(id);
        } catch (SQLException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
        if (oId.isPresent()) {
            return ResponseEntity.status(HttpStatus.OK).body(oId.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error while removing: " + id);
        }
    }

    @PostMapping ("/user")
    public ResponseEntity postUser(@RequestBody User newUser) {
        Optional<User> user;
        try {
            user = userService.postUser(newUser);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
        if (user.isPresent()) {
            return ResponseEntity.status(HttpStatus.OK).body(user.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error while adding: " + newUser.getUsername());
        }
    }

}
