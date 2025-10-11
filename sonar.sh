#!/bin/bash

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Lista de projetos
projetos=(
  "back-end"
  "bff"
  "front-end-angular"
  "front-end-react"
)

for projeto in "${projetos[@]}"; do
  echo -e "\n🔍 Rodando análise SonarQube em: ${GREEN}${projeto}${NC}"

  if [ "$projeto" == "back-end" ]; then
    cd "$projeto" || exit
    echo -e "${YELLOW}→ Projeto Java detectado. Usando Maven...${NC}"

    mvn clean verify sonar:sonar \
     -Dsonar.projectKey=back_end \
     -Dsonar.projectName='Back end' \
     -Dsonar.host.url=http://localhost:9000 \
     -Dsonar.token=sqp_1f19062eac0a877223a3b708a3d81d681c818171

    cd - > /dev/null

  else
    cd "$projeto" || exit
    echo -e "${YELLOW}→ Projeto não-Java. Usando npm run sonar...${NC}"

    npm run sonar

    cd - > /dev/null
  fi
done
