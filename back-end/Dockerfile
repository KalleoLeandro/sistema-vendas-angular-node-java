FROM openjdk:25-ea-oracle

WORKDIR /app

COPY target/sistema_vendas.jar /app/sistema_vendas.jar

EXPOSE 8080

CMD ["java", "-jar", "/app/sistema_vendas.jar"]