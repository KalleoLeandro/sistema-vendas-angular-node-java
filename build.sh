#!/bin/bash
set -e  # para parar em erro

echo "Buildando backend..."
cd back-end
mvn clean package -DskipTests
cd ..

echo "Buildando bff..."
cd bff
npm install
npm run build
cd ..

echo "Buildando front-end Angular..."
cd front-end-angular
npm install
npm run build
cd ..

echo "Builds concluídos!"