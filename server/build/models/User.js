var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { Model } from "sequelize";
var sequelize = require("../database/database.js");
var User = /** @class */ (function (_super) {
    __extends(User, _super);
    function User() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return User;
}(Model));
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
export { User };
//# sourceMappingURL=User.js.map