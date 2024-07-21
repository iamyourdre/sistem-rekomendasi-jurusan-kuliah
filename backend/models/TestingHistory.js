import { DataTypes } from "sequelize";
import db from "../config/Database.js";

const TestingLogModel = db.define(
  "t_log",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    id_siswa: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    expected: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    result: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    precision: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    log_testset: {
      type: DataTypes.TEXT('long'),
      allowNull: false,
    },
    log_recommendation: {
      type: DataTypes.TEXT('long'),
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

const TestingHistoryModel = db.define(
  "t_hist",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    tp: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: -1
    },
    fp: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: -1
    },
    precision: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: -1
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);

TestingHistoryModel.hasMany(TestingLogModel, {
  foreignKey: {
    name: "t_hist_id",
    allowNull: false,
  },
  as: 't_key',
  onDelete: "CASCADE",
});

TestingLogModel.belongsTo(TestingHistoryModel, {
  foreignKey: {
    name: "t_hist_id",
    allowNull: false,
  },
  as: 't_key',
});

(async () => {
  await db.sync();
})();

export { TestingHistoryModel, TestingLogModel };