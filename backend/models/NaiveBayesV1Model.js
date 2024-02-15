// Import dependensi yang diperlukan
import { DataTypes } from "sequelize";
import db from "../config/Database.js";
import JurusanModel from "./JurusanModel.js";

const NbIpaV1Model = db.define(
  "nb_ipa_v1_dataset",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
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

JurusanModel.has(NbIpaV1Model, {
  foreignKey: {
    name: "jurusan_id", // Nama kolom foreign key yang terhubung ke JurusanModel
    allowNull: false,
  },
  as: 'nb_ipa_v1_dataset_s',
  onDelete: "CASCADE", // Jika data jurusan dihapus, hapus juga semua data terkait di NbIpaV1Model
});

NbIpaV1Model.belongsTo(JurusanModel, {
  foreignKey: {
    name: "jurusan_id", // Nama kolom foreign key yang terhubung ke JurusanModel
    allowNull: false,
  },
  as: 'nb_ipa_v1_dataset_s',
});

export default NbIpaV1Model;