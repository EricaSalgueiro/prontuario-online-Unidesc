FROM eclipse-temurin:17-jdk-jammy 
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jdk-jammy

WORKDIR /app
COPY --from=0 /app/target/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
