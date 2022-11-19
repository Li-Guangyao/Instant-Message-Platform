// const mysql = require('mysql')
// const connection = mysql.createConnection({
//   host: 'localhost',
//   user: 'IMappUser',
//   password: 'qwer1234',
//   database: 'IMapp'
// })
// connection.connect()
// connection.query('SELECT 1 + 1 AS solution', (err, rows, fields) => {
//   if (err) throw err
//   console.log('The solution is: ', rows[0].solution)
// })
// connection.end()

// import {Sequelize} from "sequelize";
// import dotenv from "dotenv";

// dotenv.config()
// export const sequelize = new Sequelize(
//   process.env["DB"] as string,
//   process.env["SQL_USER"] as string,
//   process.env["SQL_PASSWORD"] as string, {
//     host: process.env["HOST"] as string,
//     dialect: "mysql",
//     dialectOptions:{
//         supportBigNumbers:true,
//         bigNumberStrings:true
//     },
//     logging:console.log
// });

import {Sequelize} from 'sequelize';
import dotenv from 'dotenv'

console.log('Init sequelize for mysql...');

export let sequelize = new Sequelize('imapp', 'imappuser', 'qwer1234', {
    host: '39.99.133.150',
    port: 3306,
    dialect: 'mysql',
    dialectModule: require('mysql2'),
    pool: {
        max: 100,
        min: 0,
        idle: 10000
    }
})

// const ID_TYPE = Sequelize.STRING(50);

// function defineModel(name, attributes) {
//     var attrs:any = {};
//     for (let key in attributes) {
//         let value = attributes[key];
//         if (typeof value === 'object' && value['type']) {
//             value.allowNull = value.allowNull || false;
//             attrs[key] = value;
//         } else {
//             attrs[key] = {
//                 type: value,
//                 allowNull: false
//             };
//         }
//     }
//     attrs.id = {
//         type: ID_TYPE,
//         primaryKey: true
//     };
//     attrs.createdAt = {
//         type: Sequelize.BIGINT,
//         allowNull: false
//     };
//     attrs.updatedAt = {
//         type: Sequelize.BIGINT,
//         allowNull: false
//     };
//     attrs.version = {
//         type: Sequelize.BIGINT,
//         allowNull: false
//     };

//     return sequelize.define(name, attrs, {
//         tableName: name,
//         timestamps: false,
//         hooks: {
//             beforeValidate: function(obj) {
//                 let now = Date.now();
//                 if (obj.isNewRecord) {
//                     if (!obj.id) {
//                         obj.id = generateId();
//                     }
//                     obj.createdAt = now;
//                     obj.updatedAt = now;
//                     obj.version = 0;
//                 } else {
//                     obj.updatedAt = Date.now();
//                     obj.version++;
//                 }
//             }
//         }
//     });
// }
