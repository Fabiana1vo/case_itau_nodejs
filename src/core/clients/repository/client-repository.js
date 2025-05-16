const queryExecutor = require('../../../commom/database/query-executor')

exports.dbAll = async () => {
    const query = 'SELECT * FROM clientes';
    return queryExecutor.dbAllAsync(query, [])
}

exports.dbGetById = async (id) => {
  const query = "SELECT * FROM clientes WHERE id = ?";
  return queryExecutor.dbGetAsync(query, [id])
}

exports.dbGetByEmail = (email) => {
  const query = 'SELECT * FROM clientes WHERE email = ?';
  return queryExecutor.dbGetAsync(query, [email]);
};

exports.dbInsertClient = (nome, email) => {
  const query = 'INSERT INTO clientes(nome, email, saldo) VALUES(?, ?, 0)';
  return queryExecutor.dbRunWithLastID(query, [nome, email]);
};

exports.dbUpdateClientById = (fields=[], values=[], id) => {
  const query = `UPDATE clientes SET ${fields.join(", ")} WHERE id = ?`; 
   return queryExecutor.dbRunWithLastID(query, [...values, id]);

}

exports.dbGetSaldoFromClientById = (id) => {
    const query = `SELECT saldo FROM clientes WHERE id = ?`;
    return queryExecutor.dbGetAsync(query, [id]);
}  


exports.dbDeleteClientById = (id) => {
    const query = `DELETE FROM clientes WHERE id = ?`;
    return queryExecutor.dbGetAsync(query, [id]);
}

exports.dbDepositSaldoById = (valorCentavosParaInteiro, id) => {
  const query = `UPDATE clientes SET saldo = saldo + ? WHERE id = ?`;
  return queryExecutor.dbRunWithLastID(query, [valorCentavosParaInteiro,id,]);
}

exports.dbWithdrawSaldoById = (valorCentavosParaInteiro, id) => {
  const query = `UPDATE clientes SET saldo = saldo -  ? WHERE id = ?`;
  return queryExecutor.dbRunWithLastID(query, [valorCentavosParaInteiro,id,]);
}


