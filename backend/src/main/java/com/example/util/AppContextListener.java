package com.example.util;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;

@WebListener
public class AppContextListener implements ServletContextListener {
  @Override

  public void contextInitialized(ServletContextEvent sce) {
    try {
      System.out.println("Starting Database Seeding...");
      // Trigger the Seeder logic
      DatabaseSeeder.seedAll();
      System.out.println("Database Seeding Completed.");
    } catch (Exception e) {
      System.err.println("FATAL: Database Seeding Failed!");
      e.printStackTrace();
    }
  }

  @Override
  public void contextDestroyed(ServletContextEvent sce) {
    // Close the connection to the database
    MongoDBUtil.closeConnection();
  }
}