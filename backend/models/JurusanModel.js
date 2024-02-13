import { DataTypes } from "sequelize";
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
      unique: true,
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

JurusanModel.hasMany(SiswaIpaModel, {
  foreignKey: {
    name: "jurusan_id", // Nama kolom foreign key yang terhubung ke SiswaIpaModel
    allowNull: false,
  },
  as: 'jurusan_ipa_s',
  onDelete: "CASCADE", // Jika data siswa dihapus, hapus juga semua data terkait di NilaiIpaModel
});

SiswaIpaModel.belongsTo(JurusanModel, {
  foreignKey: {
    name: "jurusan_id", // Nama kolom foreign key yang terhubung ke SiswaIpaModel
    allowNull: false,
  },
  as: 'jurusan_ipa_s',
});

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
