import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";
import Utilisateur from "./Utilisateur.model";


interface FollowerAttributes {
  user_id: number;
  abonne_id: number;
  createdAt?: Date;
  updatedAt?: Date;
}

class Follower extends Model<FollowerAttributes> implements FollowerAttributes {
  public user_id!: number;
  public abonne_id!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Follower.init({
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: {
      model: 'Utilisateur',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
   abonne_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: {
      model: 'Utilisateur',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
}, {
  sequelize,
  modelName: "Follower",
  timestamps: true,
});

Utilisateur.hasMany(Follower, { foreignKey: "user_id" });
Follower.belongsTo(Utilisateur, { foreignKey: "user_id" });

Utilisateur.hasMany(Follower, { foreignKey: "abonne_id" });
Follower.belongsTo(Utilisateur, { foreignKey: "abonne_id" });


export default Follower;