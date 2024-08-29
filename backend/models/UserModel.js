import { Sequelize } from "sequelize";
import db from "../config/Database.js";
const {DataTypes} = Sequelize;
import argon2 from "argon2";

const UserModel = db.define('users',{
    uuid:{
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate:
        {
            notEmpty: true
        }
    },
    name:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:
        {
            notEmpty: true,
            len: [3, 100]
        }
    },
    email:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:
        {
            notEmpty: true,
            isEmail: true
        }
    },
    password:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:
        {
            notEmpty: true,
        }
    },
    role:{
        type: DataTypes.INTEGER,
        allowNull: false,
        validate:
        {
            notEmpty: true,
        }
    }
},{
    freezeTableName: true
});

(async () => {
  await db.sync();

  // Uncomment line 60 - 68 to create admin account for the first time
  // Please change the name, email, and password for better security

  // if (!await UserModel.findOne({ where: { email: "admin@gmail.com" } })) {
  //   const hashPassword = await argon2.hash("12345678");
  //   await UserModel.create({
  //     name: "Admin",
  //     email: "admin@gmail.com",
  //     password: hashPassword,
  //     role: 1
  //   });
  // }

})();

export default UserModel;