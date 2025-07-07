import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";
import Utilisateur from "./Utilisateur.model";
import ChatSession from "./ChatSession.model";
import Post from "./Post.model";

interface ChatAttributes {
    id?: number;
    user_chat: number;
    user_id: number;
    message: string;
}

class Chats extends Model<ChatAttributes> implements ChatAttributes {
    public id?: number;
    public readonly user_chat!: number;
    public readonly user_id!: number;
    public message!: string;
}

Chats.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        user_chat: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: ChatSession,
                key: "id",
            },
            onDelete: "CASCADE",
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Utilisateur,
                key: "id"
            },
            onDelete: "CASCADE"
        },
        message: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: "Chats",
        timestamps: true, // Ajoute les champs createdAt et updatedAt
    });

    
    Chats.belongsTo(ChatSession, { foreignKey: "user_chat" });
    ChatSession.hasMany(Chats, { foreignKey: "user_chat" });

    Chats.belongsTo(Utilisateur, { foreignKey: "user_id" });
   Utilisateur.hasMany(Chats, { foreignKey: "user_id" });

    export default Chats;