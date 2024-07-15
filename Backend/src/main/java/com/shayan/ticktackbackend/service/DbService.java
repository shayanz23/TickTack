package com.shayan.ticktackbackend.service;

import java.util.Objects;
import java.util.Properties;
import java.io.*;
import java.sql.*;

public class DbService {
    private Properties connProps = new Properties();
    private String url;
    private Connection connection;
    private String ConnectionName = "connection_dev";
    private String ConnNameSuffix = ".properties";

    private static DbService single_instance = null;

    private DbService() throws IOException, SQLException {
        String connectionPath = Objects.requireNonNull(Thread.currentThread().getContextClassLoader().getResource("")).getPath() + ConnectionName + ConnNameSuffix;
        FileInputStream dbPropFileStream = new FileInputStream(connectionPath);
        connProps.load(dbPropFileStream);
        url = connProps.getProperty("url");
        connection = DriverManager.getConnection(url, connProps);
        dbPropFileStream.close();
    }

    public static synchronized DbService getInstance()
    {
        if (single_instance == null) {
            try {
                single_instance = new DbService();
            } catch (IOException | SQLException e) {
                throw new RuntimeException(e);
            }
        }

        return single_instance;
    }

    public Connection getConnection()  {
        return connection;
    }

}
