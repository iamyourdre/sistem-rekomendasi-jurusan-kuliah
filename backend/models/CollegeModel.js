import { DataTypes } from "sequelize";
import db from "../config/Database.js";
import { SiswaModel } from "./DataSiswaModel.js";

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
      unique: true,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

const UniversitasModel = db.define(
  "universitas",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    universitas: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

JurusanModel.hasMany(SiswaModel, {
  foreignKey: {
    name: "jurusan_id", // Nama kolom foreign key SiswaModel yang terhubung ke JurusanModel
    allowNull: false,
  },
  as: 'jurusan_key',
  onDelete: "CASCADE", // Jika data JurusanModel dihapus, hapus juga semua data terkait di SiswaModel
});

SiswaModel.belongsTo(JurusanModel, {
  foreignKey: {
    name: "jurusan_id", // Nama kolom foreign key yang terhubung ke JurusanModel
    allowNull: false,
  },
  as: 'jurusan_key',
});

UniversitasModel.hasMany(SiswaModel, {
  foreignKey: {
    name: "univ_id", // Nama kolom foreign key SiswaModel yang terhubung ke UniversitasModel
    allowNull: false,
  },
  as: 'univ_key',
  onDelete: "CASCADE", // Jika data UniversitasModel dihapus, hapus juga semua data terkait di SiswaModel
});

SiswaModel.belongsTo(UniversitasModel, {
  foreignKey: {
    name: "univ_id", // Nama kolom foreign key yang terhubung ke UniversitasModel
    allowNull: false,
  },
  as: 'univ_key',
});

(async () => {
  // Sinkronisasi database
  await db.sync();

  if (!await JurusanModel.findOne({ where: { id: 1 } })) {
    await JurusanModel.create({
      id: 1,
      jurusan: "-",
    });
  }
  
  if (!await UniversitasModel.findOne({ where: { id: 1 } })) {
    await UniversitasModel.create({
      id: 1,
      universitas: "-"
    });
  }

})();

export {JurusanModel, UniversitasModel};
