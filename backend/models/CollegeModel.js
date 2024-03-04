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
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

const UnivModel = db.define(
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

const RumpunModel = db.define(
  "rumpun",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    rumpun: {
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

JurusanModel.hasMany(SiswaIpaModel, {
  foreignKey: {
    name: "jurusan_id", // Nama kolom foreign key SiswaIpaModel yang terhubung ke JurusanModel
    allowNull: false,
  },
  as: 'jurusan_ipa_key',
  onDelete: "CASCADE", // Jika data JurusanModel dihapus, hapus juga semua data terkait di SiswaIpaModel
});

SiswaIpaModel.belongsTo(JurusanModel, {
  foreignKey: {
    name: "jurusan_id", // Nama kolom foreign key yang terhubung ke JurusanModel
    allowNull: false,
  },
  as: 'jurusan_ipa_key',
});

UnivModel.hasMany(SiswaIpaModel, {
  foreignKey: {
    name: "univ_id", // Nama kolom foreign key SiswaIpaModel yang terhubung ke UnivModel
    allowNull: false,
  },
  as: 'univ_ipa_key',
  onDelete: "CASCADE", // Jika data UnivModel dihapus, hapus juga semua data terkait di SiswaIpaModel
});

SiswaIpaModel.belongsTo(UnivModel, {
  foreignKey: {
    name: "univ_id", // Nama kolom foreign key yang terhubung ke UnivModel
    allowNull: false,
  },
  as: 'univ_ipa_key',
});

RumpunModel.hasMany(SiswaIpaModel, {
  foreignKey: {
    name: "rumpun_id", // Nama kolom foreign key SiswaIpaModel yang terhubung ke RumpunModel
    allowNull: false,
  },
  as: 'rumpun_ipa_key',
  onDelete: "CASCADE", // Jika data RumpunModel dihapus, hapus juga semua data terkait di SiswaIpaModel
});

SiswaIpaModel.belongsTo(RumpunModel, {
  foreignKey: {
    name: "rumpun_id", // Nama kolom foreign key yang terhubung ke RumpunModel
    allowNull: false,
  },
  as: 'rumpun_ipa_key',
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
  
  if (!await UnivModel.findOne({ where: { id: 1 } })) {
    await UnivModel.create({
      id: 1,
      universitas: "-"
    });
  }
  
  if (!await RumpunModel.findOne({ where: { id: 1 } })) {
    await RumpunModel.create({
      id: 1,
      rumpun: "-"
    });
  }

})();

export {JurusanModel, UnivModel, RumpunModel};
