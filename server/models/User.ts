import {Model, DataTypes} from "sequelize";
const sequelize =  require( "../database/database.js");

class User extends Model {
    declare userId: number;
    declare userName: string;
    declare email: string;
    declare password: string;

    declare address: string;
    declare google: string;
    declare github: string;
}

// User.init({
//     userId: {
//         type: DataTypes.INTEGER,
//         primaryKey: true,
//         autoIncrement: true
//     },
//     userName:{
//         type: DataTypes.STRING,
//         allowNull: false,
//     },
//     address: {
//         type: DataTypes.STRING,
//         unique: true,
//         allowNull: false
//     },
//     email: {
//         type: DataTypes.STRING,
//         allowNull: true,
//         validate: {isEmail: true}
//     },
//     google: {
//         type: DataTypes.STRING,
//         allowNull: true
//     },
//     github:{
//         type:DataTypes.STRING,
//         allowNull: true
//     }
// }, {
//     sequelize,
//     modelName: "User",
// });

export {User};