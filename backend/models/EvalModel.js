// Import dependensi yang diperlukan
import { DataTypes } from "sequelize";
import db from "../config/Database.js";
import { JurusanModel } from "./CollegeModel.js";

const EvalMapelModel = db.define(
  "eval_mapel",
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

JurusanModel.hasMany(EvalMapelModel, {
  foreignKey: {
    name: "jurusan_id", // Nama kolom foreign key EvalMapelModel yang terhubung ke JurusanModel
    allowNull: false,
  },
  as: 'eval_mapel_key',
  onDelete: "CASCADE", // Jika data JurusanModel dihapus, hapus juga semua data terkait di EvalMapelModel
});

EvalMapelModel.belongsTo(JurusanModel, {
  foreignKey: {
    name: "jurusan_id", // Nama kolom foreign key EvalMapelModel yang terhubung ke JurusanModel
    allowNull: false,
  },
  as: 'eval_mapel_key',
});


const EvalFreqModel = db.define(
  "eval_freq",
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

EvalMapelModel.hasMany(EvalFreqModel, {
  foreignKey: {
    name: "mapel_id", // Nama kolom foreign key EvalFreqModel yang terhubung ke EvalMapelModel
    allowNull: false,
  },
  as: 'eval_freq_key',
  onDelete: "CASCADE", // Jika data EvalMapelModel dihapus, hapus juga semua data terkait di EvalFreqModel
});

EvalFreqModel.belongsTo(EvalMapelModel, {
  foreignKey: {
    name: "mapel_id", // Nama kolom foreign key EvalFreqModel yang terhubung ke EvalMapelModel
    allowNull: false,
  },
  as: 'eval_freq_key',
});

export {EvalMapelModel, EvalFreqModel};