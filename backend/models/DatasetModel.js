// Import dependensi yang diperlukan
import { DataTypes } from "sequelize";
import db from "../config/Database.js";
import { JurusanModel } from "./CollegeModel.js";

// Turunan dari JurusanModel yang menyimpan total probabilitas semua bobot dari mapel x
const DatasetMapelModel = db.define(
  "dataset_mapel",
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

JurusanModel.hasMany(DatasetMapelModel, {
  foreignKey: {
    name: "jurusan_id", // Nama kolom foreign key DatasetMapelModel yang terhubung ke JurusanModel
    allowNull: false,
  },
  as: 'dataset_mapel_key',
  onDelete: "CASCADE", // Jika data JurusanModel dihapus, hapus juga semua data terkait di DatasetMapelModel
});

DatasetMapelModel.belongsTo(JurusanModel, {
  foreignKey: {
    name: "jurusan_id", // Nama kolom foreign key DatasetMapelModel yang terhubung ke JurusanModel
    allowNull: false,
  },
  as: 'dataset_mapel_key',
});


// Turunan dari DatasetMapelModel yang menyimpan frekuensi probabilitas masing-masing bobot dari mapel x
const DatasetFreqModel = db.define(
  "dataset_freq",
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

DatasetMapelModel.hasMany(DatasetFreqModel, {
  foreignKey: {
    name: "mapel_id", // Nama kolom foreign key DatasetFreqModel yang terhubung ke DatasetMapelModel
    allowNull: false,
  },
  as: 'dataset_freq_key',
  onDelete: "CASCADE", // Jika data DatasetMapelModel dihapus, hapus juga semua data terkait di DatasetFreqModel
});

DatasetFreqModel.belongsTo(DatasetMapelModel, {
  foreignKey: {
    name: "mapel_id", // Nama kolom foreign key DatasetFreqModel yang terhubung ke DatasetMapelModel
    allowNull: false,
  },
  as: 'dataset_freq_key',
});

export {DatasetMapelModel, DatasetFreqModel};