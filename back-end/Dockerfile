FROM openjdk:25-ea-oracle

WORKDIR /app

COPY target/back-end.jar /app/back-end.jar

EXPOSE 8080

CMD ["java", "-jar", "/app/back-end.jar"]