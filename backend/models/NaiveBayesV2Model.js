// Import dependensi yang diperlukan
import { DataTypes } from "sequelize";
import db from "../config/Database.js";
import { JurusanModel } from "./CollegeModel.js";

const NbIpaV2Model = db.define(
  "nb_ipa_v2_dataset",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    probability: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    mean_x1: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    mean_x2: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    mean_x3: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    mean_x4: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    mean_x5: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    mean_x6: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    mean_x7: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    mean_x8: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    mean_x9: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    mean_x10: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    mean_x11: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    mean_x12: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    mean_x13: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    mean_x14: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    mean_x15: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    std_x1: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    std_x2: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    std_x3: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    std_x4: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    std_x5: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    std_x6: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    std_x7: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    std_x8: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    std_x9: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    std_x10: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    std_x11: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    std_x12: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    std_x13: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    std_x14: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    std_x15: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

JurusanModel.hasOne(NbIpaV2Model, {
  foreignKey: {
    name: "jurusan_id", // Nama kolom foreign key NbIpaV2Model yang terhubung ke JurusanModel
    allowNull: false,
  },
  as: 'nb_ipa_v2_dataset_key',
  onDelete: "CASCADE", // Jika data JurusanModel dihapus, hapus juga semua data terkait di NbIpaV2Model
});


NbIpaV2Model.belongsTo(JurusanModel, {
  foreignKey: {
    name: "jurusan_id", // Nama kolom foreign key NbIpaV2Model yang terhubung ke JurusanModel
    allowNull: false,
  },
  as: 'nb_ipa_v2_dataset_key',
});

export default NbIpaV2Model;