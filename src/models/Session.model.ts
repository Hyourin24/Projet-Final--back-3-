import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";
import Utilisateur from "./Utilisateur.model";


interface SessionAttributes {
    id?: number;
    user_id: number;
    nom: string;
    description: string;
    date_création?: Date;
    date_modification?: Date
}


class Session extends  Model<SessionAttributes> 
    implements SessionAttributes {
    public id!: number;
    public  readonly user_id!: number;
    public nom!: string;
    public description!: string;
    public readonly date_création?: Date;
    public readonly date_modification?: Date;

}


Session.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Utilisateur,
            key: "id",
        },
        onDelete: "CASCADE",
    },
    nom: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,
    }
    
},
 {
    sequelize,
    modelName: "Session",
    timestamps: true,
});



Session.belongsTo(Utilisateur, { foreignKey: "user_id" });
Utilisateur.hasMany(Session, { foreignKey: "user_id" });


export default Session


