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
    fakultas: {
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

  // Cek apakah sudah ada data dengan id=1 di JurusanModel
  const existingJurusan = await JurusanModel.findOne({ where: { id: 0 } });

  // Jika tidak ada, buat data baru dengan id=1 dan nilai sisanya "-"
  if (!existingJurusan) {
    await JurusanModel.create({
      id: 0,
      jurusan: "-",
      fakultas: "-",
      rumpun: "-"
    });
  }

})();

export default JurusanModel;
