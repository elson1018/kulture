package com.example.util;

import com.mongodb.MongoClientSettings;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoDatabase;
import org.bson.codecs.configuration.CodecRegistry;
import org.bson.codecs.pojo.PojoCodecProvider;

import static org.bson.codecs.configuration.CodecRegistries.fromProviders;
import static org.bson.codecs.configuration.CodecRegistries.fromRegistries;

import io.github.cdimascio.dotenv.Dotenv;

public class MongoDBUtil {
    private static final String CONNECTION_STRING;
    static {
        String dbUri = null;
        try {
            // Try loading from .env file
            Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();
            dbUri = dotenv.get("DB_URI");
        } catch (Exception e) {
            // Ignore if .env is missing (production environment)
        }

        // Fallback to System environment variable
        if (dbUri == null) {
            dbUri = System.getenv("DB_URI");
        }

        // Default to localhost if nothing else is found
        CONNECTION_STRING = dbUri != null ? dbUri : "mongodb://localhost:27017";
    }

    private static final String DATABASE_NAME = "kultureDB";

    private static MongoClient mongoClient = null;

    private MongoDBUtil() {
    }

    // Get the database instance
    public static MongoDatabase getDatabase() {
        if (mongoClient == null) {
            CodecRegistry pojoCodecRegistry = fromProviders(PojoCodecProvider.builder().automatic(true).build());
            CodecRegistry codecRegistry = fromRegistries(MongoClientSettings.getDefaultCodecRegistry(),
                    pojoCodecRegistry);

            MongoClientSettings clientSettings = MongoClientSettings.builder()
                    .applyConnectionString(new com.mongodb.ConnectionString(CONNECTION_STRING))
                    .codecRegistry(codecRegistry)
                    .build();

            mongoClient = MongoClients.create(clientSettings);
        }
        return mongoClient.getDatabase(DATABASE_NAME);
    }

    // Close the connection to the database
    public static void closeConnection() {
        if (mongoClient != null) {

            mongoClient.close();
            mongoClient = null;
        }
    }
}