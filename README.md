# Solução proposta para o Case de engenharia Itau - .NodeJS

## 👩‍💻 Instalação

1. Clone o repositório
2. Acesse o diretório da aplicação
3. Execute o comando abaixo no seu BASH

Obs: Use o gerenciador de pacotes [npm](https://www.npmjs.com/) para instalar as dependências necessárias.

```bash
npm install

```

## 📢 Importante

O arquivo .env foi adicionado propositalmente ao repositório para facilitar o uso da aplicação neste cenário. Porém, você pode optar por removê-lo e seguir os passos abaixo para validar o funcionamento.

## 🚀 Uso (Opcional se optar por manter o .env já existente)

1. Crie um arquivo .env (ou renomeie o .env-exemple) na raiz do seu projeto.
2. Crie as chaves SALT e PASSPHRASE e SECRET_KEY
3. Execute o Script no seu BASH e adicione o valor à chave criada.
Obs: Você deve rodar o script 1 vez para cada chave (as chaves devem ter valores diferentes).

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

```

## Observações

Durante o desenvolvimento desta solução, a ideia foi abordar um pouco do conhecimento que tenho em cenários que acredito ser útil para a vaga apresentada. Devido ao tempo, alguns pontos foram executados de maneira simplificada. Caso precise de explicações, entre em contato pelo e-mail [fabianasouzaivo@icloud.com](mailto:fabianasouzaivo@icloud.com) — será um prazer conversar com você!

## Dependências utilizadas

- [cors](https://www.npmjs.com/package/cors) — ^2.8.5
- [dotenv](https://www.npmjs.com/package/dotenv) — ^16.5.0
- [express](https://www.npmjs.com/package/express) — ^4.21.2
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) — ^9.0.2
- [sqlite3](https://www.npmjs.com/package/sqlite3) — ^5.1.7
- [winston](https://www.npmjs.com/package/winston) — ^3.17.0

---

[README.md](http://readme.md/) -- original

# Case de engenharia Itau - .NodeJS

## Introdução

Neste projeto esta sendo utilizada a base de dados sqlite com a seguinte tabela:

```
Tabela: CLIENTES > "Registro relacionados ao cadastro de clientes"
- id    - INTEGER NOT NULL AUTOINCREMENT PRIMARY KEY
- nome  - TEXT    NOT NULL
- email - TEXT    NOT NULL UNIQUE
- saldo - FLOAT

```

No projeto foi disponibilizada uma API de Clientes com os metodos abaixo realizando acoes diretas na base de dados:

```
GET    clientes                - LISTAR TODOS OS CLIENTES CADASTRADOS
GET    clientes/{ID}           - RETORNAR OS DETALHES DE UM DETERMINADO CLIENTES PELO ID
POST   clientes                - REALIZA O CADASTRO DE UM NOVO CLIENTE
PUT    clientes/{ID}           - EDITA O CADASTRO DE UM CLIENTE JÁ EXISTENTE
DELETE clientes/{ID}           - EXCLUI O CADASTRO DE UM CLIENTE
POST   clientes/{ID}/depositar - ADICIONA OU SUBTRAI DETERMINADO VALOR DO SALDO DE UM CLIENTE
POST   clientes/{ID}/sacar     - ADICIONA OU SUBTRAI DETERMINADO VALOR DO SALDO DE UM CLIENTE

```

## Ações a serem realizadas

1. Faça o fork do projeto no seu github. Não realize commits na branch main e nem crie novas branchs.
2. O código da api de clientes faz mal uso dos objetos, não segue boas práticas e não possui qualidade. Refatore o codigo utilizando as melhores bibliotecas, praticas, patterns e garanta a qualidade da aplicação. Fique a vontade para mudar o que achar necessário.
3. O controle de saldo do cliente possui um erro. Identifique e implemente a correção
4. Para nós segurança é um tema sério, implemente as ações que achar prudente para garantir a segurança da sua aplicação
5. Utilizando o Angular, crie uma aplicação web que consuma todos os metodos da API de clientes

Após finalizar o case, envie o link do seu github com a solução final para o e-mail [andre.gattini@itau-unibanco.com.br](mailto:andre.gattini@itau-unibanco.com.br)