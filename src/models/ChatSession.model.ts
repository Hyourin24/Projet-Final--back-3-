import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";
import Utilisateur from "./Utilisateur.model";
import Post from "./Post.model";

interface ChatAttributes {
    id?: number;
    user_id: number;
    sendUser_id: number;
}

class ChatSession extends Model<ChatAttributes> implements ChatAttributes {
    public id?: number;
    public readonly user_id!: number;
    public readonly sendUser_id!: number;
}

ChatSession.init(
    {
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
        sendUser_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Utilisateur,
                key: "id",
            },
            onDelete: "CASCADE",
        },
        
    },
    {
        sequelize,
        tableName: "ChatSession",
        timestamps: true, // Ajoute les champs createdAt et updatedAt
    });

    ChatSession.belongsTo(Utilisateur, { foreignKey: "user_id" });
    Utilisateur.hasMany(ChatSession, { foreignKey: "user_id" });

    ChatSession.belongsTo(Utilisateur, { foreignKey: "sendUser_id" });
    Utilisateur.hasMany(ChatSession, { foreignKey: "sendUser_id" });

    
    export default ChatSession;