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
  const query = 'SELECT email FROM clientes WHERE email = ?';
  return queryExecutor.dbGetAsync(query, [email]);
};

exports.dbInsertClient = (nome, email) => {
  const query = 'INSERT INTO clientes(nome, email, saldo) VALUES(?, ?, 0)';
  return queryExecutor.dbRunWithLastID(query, [nome, email]);
};

exports.dbUpdateClientById = (query=[], id) => {
      const query = `UPDATE clientes SET ${query.join(", ")} WHERE id = ?`; 
      queryExecutor.dbRunWithLastID(query, values);
}