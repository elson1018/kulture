package com.example.util;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;

@WebListener
public class AppContextListener implements ServletContextListener {
    @Override

    public void contextInitialized(ServletContextEvent sce) {
      //Trigger the Seeder logic
        DatabaseSeeder.seedAll();
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
      //Close the connection to the database
      MongoDBUtil.closeConnection();
    }
}