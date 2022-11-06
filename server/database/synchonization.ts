// import { sequelize } from "./database";
// sequelize.sync().then(res=>{
//     console.log("Successfully create database:")
// }).catch(err=>{
//     console.log("Fail to create database table:", err)
// })

import User from "../models/User";

User.sync({
    force: true
});