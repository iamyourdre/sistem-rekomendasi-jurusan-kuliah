import { Sequelize, DataTypes } from "sequelize";
import db from "../config/Database.js";
import { SiswaIpaModel } from "./IpaModel.js";

const JurusanModel = db.define(
  "jurusan",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    jurusan: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rumpun: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

(async () => {
  // Sinkronisasi database
  await db.sync();

  if (!await JurusanModel.findOne({ where: { id: 1 } })) {
    await JurusanModel.create({
      id: 1,
      jurusan: "-",
      rumpun: "-"
    });
  }

})();

export default JurusanModel;
