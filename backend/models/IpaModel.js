import { Sequelize, DataTypes } from "sequelize";
import db from "../config/Database.js";

const NilaiIpaModel = db.define(
  "nilai_ipa",
  {
    semester: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    PABP: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    PPKN: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    B_IND: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    MTK_W: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    S_IND: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    BING_W: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    S_BUD: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    PJOK: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    PKWU: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    MTK_T: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    BIO: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    FIS: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    KIM: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    EKO: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    BING_T: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

const SiswaIpaModel = db.define(
  "siswa_ipa",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    nama: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    akt_thn: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    univ: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fklts: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    jrsn: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);


SiswaIpaModel.hasMany(NilaiIpaModel, {
  foreignKey: {
    name: "siswa_id", // Nama kolom foreign key yang terhubung ke SiswaIpaModel
    allowNull: false,
  },
  as: 'nilai_ipa_s', // Ganti alias dengan 'nilai_ipa'
  onDelete: "CASCADE", // Jika data siswa dihapus, hapus juga semua data terkait di NilaiIpaModel
});

NilaiIpaModel.belongsTo(SiswaIpaModel, {
  foreignKey: {
    name: "siswa_id", // Nama kolom foreign key yang terhubung ke SiswaIpaModel
    allowNull: false,
  },
  as: 'nilai_ipa', // Ganti alias dengan 'nilai_ipa'
});

(async () => {
  // Sinkronisasi database
  await db.sync();
})();

export { SiswaIpaModel, NilaiIpaModel };