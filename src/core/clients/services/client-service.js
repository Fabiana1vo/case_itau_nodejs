const logger = require("../../../config/logger")("CLIENT_SERVICE");
const { CustomError } = require("../../../commom/errors/custom-error");
const clientRepository = require("../repository/client-repository");
const { convertCurrencyIntegerToDecimal, convertCurrencyToInteger, } = require("../../../commom/utils/currency-formatter");
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

/**
 * @async
 * @function exports.create
 * @description Registers a new client in the system, validating if the email is already in use.
 * @param {string} nome - Client's name.
 * @param {string} email - Client's email address.
 * @returns {Promise<object>} An object containing the newly created client data: id, nome, email, and initial balance.
 * @throws {CustomError} 400 ('This email is already in use.'), 500 ('Failed to register client.').
 */

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


/**
 * @async
 * @function exports.update
 * @description Updates a client's data (name and/or email) by their ID, validating if the client exists and if the new email is available.
 * @param {string|number} id - The ID of the client to be updated.
 * @param {string} [nome] - New name for the client (optional).
 * @param {string} [email] - New email for the client (optional).
 * @returns {Promise<object>} An object containing the updated client data: id and the updated fields.
 * @throws {CustomError} 404 ('Cliente não encontrado.'), 400 ('O e-mail informado já existe!'), 404 ('Cliente não encontrado ou nenhum dado foi alterado.').
 */

exports.update = async (id, nome, email) => {
  const fieldsToUpdate = [];
      const values = [];

      const clientData = await clientRepository.dbGetById(id);

      if (!clientData) {
        throw new CustomError('Cliente não encontrado.', 404, 'NOT_FOUND');
      }

      if (nome) {
        fieldsToUpdate.push("nome = ?");
        values.push(nome);
      }

    if (email) {
      const emailAlreadyExists = await clientRepository.dbGetByEmail(email);

      if (emailAlreadyExists && String(emailAlreadyExists.id) !== String(id)) {
        throw new CustomError('O e-mail informado já existe!', 400, 'BAD_REQUEST');
      } 

      if (clientData.email !== email) {
        fieldsToUpdate.push("email = ?");
        values.push(email);
      }
    }
      
      const result = await clientRepository.dbUpdateClientById(fieldsToUpdate,values,id)

      if (result.changes === 0) {
        throw new CustomError("Cliente não encontrado ou nenhum dado foi alterado.", 404, "NOT_FOUND"
        );
      }

      logger.info(`Cliente ${id} atualizado com sucesso!`);
      return { id, ...(nome && { nome }), ...(email && { email }) };
  };

/**
 * @async
 * @function exports.delete
 * @description Deletes a client by ID after validating that the client exists and has no remaining balance.
 * @param {string|number} id - The ID of the client to be deleted.
 * @returns {Promise<void>} No content is returned upon successful deletion.
 * @throws {CustomError} 400 ('Não é possível excluir. O usuário não foi localizado'), 400 ('Você precisa sacar todo o saldo da sua conta antes de solicitar a exclusão').
 */

exports.delete = async (id) => {
  try {
    logger.info(`Iniciando o processo de exclusão da conta: ${id}`);
    const saldo = await clientRepository.dbGetSaldoFromClientById(id)

    if (!saldo) {
      throw new CustomError("Não é possível excluir. O usuário não foi localizado", 400, "BAD_REQUEST");
    }

    if (saldo > 0) {
      throw new CustomError(
        "Você precisa sacar todo o saldo da sua conta antes de solicitar a exclusão",
        400,
        "BAD_REQUEST"
      );
    }

    await clientRepository.dbDeleteClientById(id)
    logger.info(`Cliente ${id} deletado com sucesso!`);
    return;

  } catch (error) {
    throw error;
  }
};

/**
 * @async
 * @function exports.deposit
 * @description Adds a deposit amount to a client's balance by ID, validating the deposit value and client existence.
 * @param {string|number} id - The ID of the client receiving the deposit.
 * @param {string|number} valor - The deposit amount in decimal format (e.g. '10.50' or 10.5).
 * @returns {Promise<object>} An object containing the updated balance in cents.
 * @throws {CustomError} 400 ('Valor inválido'), 400 ('O valor do depósito deve ser maior que zero'), 500 ('Ocorreu um erro ao tentar adicionar o saldo na sua conta. Tente novamente mais tarde').
 */


exports.deposit = async (id, valor) => {
  try {
   
    console.log(valor,'vendo o valor no deposito')

    logger.info(`Iniciando a adição de saldo para conta: ${id}`);


    const valorCentavosParaInteiro = convertCurrencyToInteger(valor);
    console.log(valorCentavosParaInteiro,'valorCentavosParaInteiro')

    if (valorCentavosParaInteiro <= 0) {
      throw new CustomError(
        "O valor do depósito deve ser maior que zero",
        400,
        "BAD_REQUEST"
      );
    }

    const response = await clientRepository.dbDepositSaldoById(valorCentavosParaInteiro, id)
    console.log(response,'response')
    if (!response || !response.changes) {
      throw new CustomError(
        "Ocorreu um erro ao tentar adicionar o saldo na sua conta. Tente novamente mais tarde",
        500,
        "SERVER_ERROR"
      );
    }

    // Buscar o saldo atualizado em centavos
    const result = clientRepository.dbGetSaldoFromClientById(id)

    logger.info(
      `Saldo adicionado com sucesso. O saldo atual é de: ${result.saldo}`
    );

    return { saldo: result.saldo };
  } catch (error) {
    throw error;
  }
};


/**
 * @async
 * @function exports.withdraw
 * @description Withdraws a specified amount from a client's balance by ID, validating the value, client existence, and sufficient balance.
 * @param {string|number} id - The ID of the client performing the withdrawal.
 * @param {string|number} valor - The withdrawal amount in decimal format (e.g. '10.50' or 10.5).
 * @returns {Promise<object>} An object containing the updated balance in cents.
 * @throws {CustomError} 400 ('Valor inválido'), 400 ('O valor do saque deve ser maior que zero'), 404 ('Conta não encontrada'), 400 ('Saldo insuficiente para o saque'), 500 ('Erro ao realizar o saque. Tente novamente mais tarde').
 */

exports.withdraw = async (id, valor) => {
  try {
    logger.info(`Iniciando o saque de saldo para conta: ${id}`);

      const valorCentavosParaInteiro = convertCurrencyToInteger(valor);

    if (valorCentavosParaInteiro <= 0) {
      throw new CustomError(
        "O valor do saque deve ser maior que zero",
        400,
        "BAD_REQUEST"
      );
    }
 
    const result = await clientRepository.dbGetSaldoFromClientById(id);

    if (!result) {
      throw new CustomError("Conta não encontrada", 404, "NOT_FOUND");
    }

    const saldoCentavosParaInteiro = result.saldo

    if (saldoCentavosParaInteiro < valorCentavosParaInteiro) {
        throw new CustomError(
        `Saldo insuficiente para o saque. O saldo atual é de: R$ ${convertCurrencyIntegerToDecimal(
          saldoCentavosParaInteiro
        )}`,
        400,
        "BAD_REQUEST"
      );
    }

    const response = await clientRepository.dbWithdrawSaldoById(valorCentavosParaInteiro,id) 
    
    if (!response || !response.changes) {
      throw new CustomError(
        "Erro ao realizar o saque. Tente novamente mais tarde",
        500,
        "SERVER_ERROR"
      );
    }

    const novoResult = await clientRepository.dbGetSaldoFromClientById(id)
    
    return { saldo: novoResult.saldo };
  } catch (error) {
    throw error;
  }
};
