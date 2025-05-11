const db = require('./database')

const dbAllAsync = (query, params) => {
    return new Promise((resolve, reject) => {
        db.all(query, params, (err, rows) => {
            if (err) {
                return reject(err);
            }
            resolve(rows);
        });
    });
};

const dbGetAsync = (query, params) => {
    return new Promise((resolve, reject) => {
        db.get(query, params, (err, row) => {
            if (err) {
                return reject(err);
            }
            resolve(row);
        });
    });
};

const dbRunAsync = (query, params) => {
    return new Promise((resolve, reject) => {
        db.run(query, params, function (err) {
            if (err) {
                return reject(err);
            }
            resolve(this);
        });
    });
};

const dbExecAsync = (query) => {
    return new Promise((resolve, reject) => {
        db.exec(query, (err) => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });
};

const dbRunWithLastID = (query, params) => {
    return new Promise((resolve, reject) => {
        db.run(query, params, function (err) {
            if (err) {
                return reject(err);
            }
            resolve({ lastID: this.lastID, changes: this.changes });
        });
    });
};

module.exports = { dbAllAsync, dbGetAsync, dbRunAsync, dbExecAsync, dbRunWithLastID };