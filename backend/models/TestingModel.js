// Import dependensi yang diperlukan
import { DataTypes } from "sequelize";
import db from "../config/Database.js";
import { JurusanModel } from "./CollegeModel.js";

const TestingMapelModel = db.define(
  "testing_mapel",
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

JurusanModel.hasMany(TestingMapelModel, {
  foreignKey: {
    name: "jurusan_id", // Nama kolom foreign key TestingMapelModel yang terhubung ke JurusanModel
    allowNull: false,
  },
  as: 'testing_mapel_key',
  onDelete: "CASCADE", // Jika data JurusanModel dihapus, hapus juga semua data terkait di TestingMapelModel
});

TestingMapelModel.belongsTo(JurusanModel, {
  foreignKey: {
    name: "jurusan_id", // Nama kolom foreign key TestingMapelModel yang terhubung ke JurusanModel
    allowNull: false,
  },
  as: 'testing_mapel_key',
});


const TestingFreqModel = db.define(
  "testing_freq",
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

TestingMapelModel.hasMany(TestingFreqModel, {
  foreignKey: {
    name: "mapel_id", // Nama kolom foreign key TestingFreqModel yang terhubung ke TestingMapelModel
    allowNull: false,
  },
  as: 'testing_freq_key',
  onDelete: "CASCADE", // Jika data TestingMapelModel dihapus, hapus juga semua data terkait di TestingFreqModel
});

TestingFreqModel.belongsTo(TestingMapelModel, {
  foreignKey: {
    name: "mapel_id", // Nama kolom foreign key TestingFreqModel yang terhubung ke TestingMapelModel
    allowNull: false,
  },
  as: 'testing_freq_key',
});

export {TestingMapelModel, TestingFreqModel};