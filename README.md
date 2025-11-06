
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.0-brightgreen) ![Java](https://img.shields.io/badge/Java-21-orange) ![SQLite](https://img.shields.io/badge/SQLite-3.45.1.0-blue)
## 📋 Descrição
Este é o backend de um sistema de prontuário online desenvolvido em **Spring Boot** para um trabalho de faculdade na Unidesc. Ele permite o cadastro, listagem, busca e exportação de pacientes, utilizando **SQLite** como banco de dados leve. Inclui integração com APIs externas para validação de CPF (BrasilAPI) e busca de endereço por CEP (ViaCEP), facilitando o gerenciamento de dados de pacientes.

## ✨ Funcionalidades
- **Cadastro de Pacientes**: Adicionar novos pacientes com validação de CPF e busca automática de endereço por CEP.
- **Listagem de Pacientes**: Visualizar todos os pacientes cadastrados.
- **Busca de Pacientes**: Pesquisar por nome ou CPF.
- **Exportação**: Gerar relatórios em PDF ou Excel para pacientes.
- **API REST**: Endpoints para integração com interfaces gráficas em Java ou scripts em Python.
- **Integração com APIs Externas**: Validação de CPF via BrasilAPI e busca de endereço via ViaCEP.

## 🛠 Tecnologias Utilizadas
- **Java 21**: Linguagem principal.
- **Spring Boot 3.2.0**: Framework para o backend e APIs REST.
- **Spring Data JPA**: Para operações com banco de dados.
- **SQLite**: Banco de dados embutido.
- **RestTemplate**: Para chamadas a APIs externas.
- **Maven**: Gerenciamento de dependências.

## 📋 Pré-requisitos
- **Java 21** instalado (JDK).
- **Maven** instalado (ou use o wrapper incluído).
- Conexão à internet para APIs externas (opcional, mas recomendado).

## 🚀 Como Executar
1. **Clone o projeto**:
   ```
   git clone https://github.com/EricaSalgueiro/prontuario-online-Unidesc.git
   cd prontuario-online-Unidesc
   ```

2. **Compile e execute**:
   ```
   mvn clean install
   mvn spring-boot:run
   ```

3. **Acesse a API**:
    - Base URL: `http://localhost:8080`
    - Exemplos de endpoints:
        - `POST /pacientes` (cadastrar paciente com JSON)
        - `GET /pacientes` (listar pacientes)
        - `GET /pacientes/busca?nome=João` (buscar por nome)
        - `GET /pacientes/export/pdf` (exportar em PDF)

4. **Teste**:
    - Use Postman ou navegador para testar.
    - O banco SQLite é criado automaticamente em `prontuario.db`.

## 📁 Estrutura do Projeto
```
prontuario-online-Unidesc/
├── src/
│   ├── main/
│   │   ├── java/br/com/exemplo/prontuario/
│   │   │   ├── ProntuarioBackendApplication.java
│   │   │   ├── controller/          # Controladores REST
│   │   │   ├── entity/              # Entidades (ex.: Paciente)
│   │   │   ├── repository/          # Repositórios JPA
│   │   │   └── service/             # Lógica de negócio e integrações
│   │   └── resources/
│   │       └── application.properties  # Configurações
│   └── test/
│       └── java/br/com/exemplo/prontuario/
│           └── ProntuarioBackendApplicationTests.java
├── pom.xml                          # Dependências Maven
└── README.md                        # Este arquivo
```


## 🤝 Contribuição
Projeto acadêmico da Unidesc. Sugestões são bem-vindas via issues no GitHub.

## 📄 Licença
Uso educacional. Sem licença específica.

---

**Desenvolvido por Erica Salgueiro** para trabalho de faculdade na Unidesc. 😊
