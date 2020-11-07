const mysql = require('mysql');
const { database } = require('./keys');
const pool = mysql.createPool(database);
const { promisify } = require('util');

pool.getConnection((err, connection) => {
    if(err){
        if(err.code == 'PROTOCOL_CONNECTION_LOST'){
            console.error('database connection was closed');
        }
        if(err.code == 'ER_CON_COUNT_ERROR'){
            console.error('DATABASE HAS TO MANY CONNECTIONS');
        }
        if(err.code == 'CONNREFUSED'){
            console.error('DATABASE CONNECTION WAS REFUSED');
        }
    }
    if(connection) connection.release();
    console.log('DB IS CONNECTED');
    return;
 });

 // promisify pool querys
 pool.query = promisify(pool.query);

 module.exports = pool;

