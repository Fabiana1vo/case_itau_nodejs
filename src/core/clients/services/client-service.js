const logger = require("../../../config/logger")("CLIENT_SERVICE");
const { CustomError } = require("../../../commom/errors/custom-error");
const clientRepository = require("../repository/client-repository");
const { integerToDecimal, convertCurrencyToCents, } = require("../../../commom/utils/currency-formatter");
const queryExecutor = require("../../../commom/database/query-executor");
const Crypto = require('../../../commom/utils/encryption')

/**
 * Represents the result set retrieved from the database query.
 * @type {Array<Object>}
 * @description An array of objects where each object represents a row from the database query result.
 */

exports.findAll = async () => {
  logger.info("Iniciando a busca de todos os clientes.");
  const rows = await clientRepository.dbAll();
  logger.info(`Total de registros encontrados: ${rows.length}`);
  return rows;
};


/**
 * @async
 * @function exports.find
 * @description Busca cliente por ID.
 * @param {*} id - ID do cliente.
 * @returns {Promise<object|Array<object>>} Cliente encontrado.
 * @throws {CustomError} 400 ('ID necessário'), 404 ('Cliente não localizado'), 500 ('Erro ao buscar').
 */


exports.find = async (id) => {
  logger.info(`Iniciando a busca do cliente de id: ${id} no banco de dados...`);

  const result = await clientRepository.dbGetById(id);

  if (!result) {
    throw new CustomError("Cliente não localizado!", 404, "NOT_FOUND");
  }

  logger.info(`Cliente ${id} localizado com sucesso!`);
  return result;
};


exports.create = async (nome, email) => {
  logger.info("Inciando o registro de um novo usuário");
  const existingUser = await clientRepository.dbGetByEmail(email);

  if (existingUser) {
    throw new CustomError("Este e-mail já está em uso.", 400, "BAD_REQUEST");
  }

  logger.info("O usuário ainda não existe. Iniciando o processo de registro.");

  const encryptedNome = Crypto.encrypt(nome);
  const result = await clientRepository.dbInsertClient(encryptedNome, email);

  
  const insertedId = result?.lastID ?? null;

  if (!insertedId) {
    throw new CustomError("Erro ao cadastrar cliente.", 500, "SERVER_ERROR");
  }

  logger.info(`Cliente ${insertedId}, ${nome}, criado com sucesso!`);

  return { id: insertedId, nome, email, saldo: 0 };
};


exports.update = async (id, nome, email) => {
 const fieldsToUpdate = [];
    const values = [];

    if (nome) {
      fieldsToUpdate.push("nome = ?");
      values.push(nome);
    }

    if (email) {
      fieldsToUpdate.push("email = ?");
      values.push(email);
    }

    const query = `UPDATE clientes SET ${fieldsToUpdate.join(", ")} WHERE id = ?`; 

    values.push(id);

    

    // const result = 

    if (result.changes === 0) {
      throw new CustomError("Cliente não encontrado ou nenhum dado foi alterado.", 404, "NOT_FOUND"
      );
    }

    logger.info(`Cliente ${id} atualizado com sucesso!`);
    return { id, ...(nome && { nome }), ...(email && { email }) };
};




exports.delete = async (id) => {
  try {
    logger.info(`Iniciando o processo de exclusão da conta: ${id}`);
    let query = `SELECT saldo FROM clientes WHERE id = ?`;

    const saldo = await queryExecutor.dbGetAsync(query, [id]);

    if (!saldo) {
      throw new CustomError("Cliente não localizado", 400, "BAD_REQUEST");
    }

    if (saldo > 0) {
      throw new CustomError(
        "Você precisa sacar todo o saldo da sua conta antes de solicitar a exclusão",
        400,
        "BAD_REQUEST"
      );
    }

    query = `DELETE FROM clientes WHERE id = ?`;
    await queryExecutor.dbRunAsync(query, [id]);
    logger.info(`Cliente ${id} deletado com sucesso!`);
    return;
  } catch (error) {
    throw error;
  }
};

exports.deposit = async (id, valor) => {
  try {
    logger.info(`Iniciando a adição de saldo para conta: ${id}`);

    if (isNaN(valor) || valor === null || valor === undefined) {
      throw new CustomError("Valor inválido", 400, "BAD_REQUEST");
    }

    // Converter o valor para centavos
    const valorCentavos = convertCurrencyToCents(valor);

    if (valorCentavos <= 0) {
      throw new CustomError(
        "O valor do depósito deve ser maior que zero",
        400,
        "BAD_REQUEST"
      );
    }

    let query = `UPDATE clientes SET saldo = saldo + ? WHERE id = ?`;
    const response = await queryExecutor.dbRunWithLastID(query, [
      valorCentavos,
      id,
    ]);

    if (!response || !response.changes) {
      throw new CustomError(
        "Ocorreu um erro ao tentar adicionar o saldo na sua conta. Tente novamente mais tarde",
        500,
        "SERVER_ERROR"
      );
    }

    // Buscar o saldo atualizado em centavos
    query = `SELECT saldo FROM clientes WHERE id = ?`;
    const result = await queryExecutor.dbGetAsync(query, [id]);

    logger.info(
      `Saldo adicionado com sucesso. O saldo atual é de: ${result.saldo}`
    );

    return { saldo: result.saldo };
  } catch (error) {
    throw error;
  }
};

exports.withdraw = async (id, valor) => {
  try {
    logger.info(`Iniciando o saque de saldo para conta: ${id}`);

    if (isNaN(valor) || valor === null || valor === undefined) {
      throw new CustomError("Valor inválido", 400, "BAD_REQUEST");
    }

    const valorCentavos = convertCurrencyToCents(valor);

    if (valorCentavos <= 0) {
      throw new CustomError(
        "O valor do saque deve ser maior que zero",
        400,
        "BAD_REQUEST"
      );
    }

    let query = `SELECT saldo FROM clientes WHERE id = ?`;
    const result = await queryExecutor.dbGetAsync(query, [id]);
    if (!result) {
      throw new CustomError("Conta não encontrada", 404, "NOT_FOUND");
    }

    const saldoCentavos = Math.round(Number(result.saldo));
    if (saldoCentavos < valorCentavos) {
      throw new CustomError(
        `Saldo insuficiente para o saque. O saldo atual é de: R$ ${integerToDecimal(
          saldoCentavos
        )}`,
        400,
        "BAD_REQUEST"
      );
    }

    query = `UPDATE clientes SET saldo = saldo - ? WHERE id = ?`;
    const response = await queryExecutor.dbRunWithLastID(query, [
      valorCentavos,
      id,
    ]);

    if (!response || !response.changes) {
      throw new CustomError(
        "Erro ao realizar o saque. Tente novamente mais tarde",
        500,
        "SERVER_ERROR"
      );
    }

    query = `SELECT saldo FROM clientes WHERE id = ?`;
    const novoResult = await queryExecutor.dbGetAsync(query, [id]);

    return { saldo: novoResult.saldo }; // Retorna o saldo formatado
  } catch (error) {
    throw error;
  }
};
