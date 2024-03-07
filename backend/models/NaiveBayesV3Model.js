// Import dependensi yang diperlukan
import { DataTypes } from "sequelize";
import db from "../config/Database.js";
import { JurusanModel } from "./CollegeModel.js";

const NbIpaV3MapelModel = db.define(
  "nb_ipa_v3_mapel",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    x: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    total_p_yes: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    total_p_no: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

JurusanModel.hasMany(NbIpaV3MapelModel, {
  foreignKey: {
    name: "jurusan_id", // Nama kolom foreign key NbIpaV3MapelModel yang terhubung ke JurusanModel
    allowNull: false,
  },
  as: 'nb_ipa_v3_mapel_key',
  onDelete: "CASCADE", // Jika data JurusanModel dihapus, hapus juga semua data terkait di NbIpaV3MapelModel
});

NbIpaV3MapelModel.belongsTo(JurusanModel, {
  foreignKey: {
    name: "jurusan_id", // Nama kolom foreign key NbIpaV3MapelModel yang terhubung ke JurusanModel
    allowNull: false,
  },
  as: 'nb_ipa_v3_mapel_key',
});


const NbIpaV3FreqModel = db.define(
  "nb_ipa_v3_freq",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    bobot: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    p_no: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    p_yes: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

NbIpaV3MapelModel.hasMany(NbIpaV3FreqModel, {
  foreignKey: {
    name: "mapel_id", // Nama kolom foreign key NbIpaV3FreqModel yang terhubung ke NbIpaV3MapelModel
    allowNull: false,
  },
  as: 'nb_ipa_v3_freq_key',
  onDelete: "CASCADE", // Jika data NbIpaV3MapelModel dihapus, hapus juga semua data terkait di NbIpaV3FreqModel
});

NbIpaV3FreqModel.belongsTo(NbIpaV3MapelModel, {
  foreignKey: {
    name: "mapel_id", // Nama kolom foreign key NbIpaV3FreqModel yang terhubung ke NbIpaV3MapelModel
    allowNull: false,
  },
  as: 'nb_ipa_v3_freq_key',
});

export {NbIpaV3MapelModel, NbIpaV3FreqModel};