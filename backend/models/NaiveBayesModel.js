// Import dependensi yang diperlukan
import { DataTypes } from "sequelize";
import db from "../config/Database.js";
import JurusanModel from "./JurusanModel.js";

const NbIpaModel = db.define(
  "nb_ipa_dataset",
  {
    jurusan_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    probability: {
      type: DataTypes.DOUBLE,
      allowNull: null,
    },
    mean_x1: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    sd_x1: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

// Definisikan relasi antara JurusanModel dan NbIpaModel
// JurusanModel.hasOne(NbIpaModel, {
//   foreignKey: 'jurusan_id' // nama kolom foreign key di tabel NbIpaModel
// });

// NbIpaModel.belongsTo(JurusanModel, {
//   foreignKey: 'jurusan_id' // nama kolom foreign key di tabel NbIpaModel
// });


// Export model-model yang telah dibuat
export default NbIpaModel;