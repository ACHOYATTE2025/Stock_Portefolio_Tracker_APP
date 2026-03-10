# ─────────────────────────────────────────
# Stage 1 — DEV (avec hot reload via spring-boot:run)
# ─────────────────────────────────────────
FROM maven:3.9-eclipse-temurin-17 AS dev

WORKDIR /app

# Cache des dépendances Maven
COPY pom.xml ./
RUN mvn dependency:go-offline -q

COPY src ./src

EXPOSE 8080
CMD ["./mvnw", "spring-boot:run"]


# ─────────────────────────────────────────
# Stage 2 — BUILD
# ─────────────────────────────────────────
FROM maven:3.9-eclipse-temurin-17 AS build

WORKDIR /app

COPY pom.xml ./
RUN mvn dependency:go-offline -q

COPY src ./src
RUN mvn clean package -DskipTests


# ─────────────────────────────────────────
# Stage 3 — PROD (JRE léger)
# ─────────────────────────────────────────
FROM eclipse-temurin:17-jre-alpine AS prod

WORKDIR /app

# Copie uniquement le JAR final
COPY --from=build /app/target/*.jar app.jar

# Utilisateur non-root pour la sécurité
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
