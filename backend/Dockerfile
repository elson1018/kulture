# Stage 1: Build the application
FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
# Build the WAR file, skipping tests to save time
RUN mvn clean package -DskipTests

# Stage 2: Run in Tomcat
FROM tomcat:9.0-jdk17-temurin
# Remove default ROOT application
RUN rm -rf /usr/local/tomcat/webapps/ROOT
# Copy the WAR file to webapps/ROOT.war (so it runs at the root URL /)
# Note: Verified pom.xml artifactId is MappingServlets, version 1.0-SNAPSHOT
COPY --from=build /app/target/MappingServlets-1.0-SNAPSHOT.war /usr/local/tomcat/webapps/ROOT.war

EXPOSE 8080
CMD ["catalina.sh", "run"]
