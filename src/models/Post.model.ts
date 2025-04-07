import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";
import Utilisateur from "./Utilisateur.model";
import Commentaire from "./Comment.model";

interface PostAttributes {
    id?: number;
    user_id: number;
    titre: string;
    post: string;
    date_création?: Date;
    date_modification?: Date;
}

class Post extends Model<PostAttributes> implements PostAttributes {
    public id?: number;
    public readonly user_id!: number;
    public titre!: string;
    public post!: string;
    public readonly date_création?: Date;
    public readonly date_modification?: Date;
}

Post.init(
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
        titre: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        post: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "Post",
        timestamps: true,
    }
);

Post.belongsTo(Utilisateur, { foreignKey: "user_id" });
Utilisateur.hasMany(Post, { foreignKey: "user_id"});

// Post.belongsTo(Commentaire, { foreignKey: "comment_id"});
// Commentaire.hasOne(Post, { foreignKey: "comment_id"})

export default Post;
