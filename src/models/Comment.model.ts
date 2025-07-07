import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";
import Utilisateur from "./Utilisateur.model";
import Post from "./Post.model";


interface CommentAttributes {
    id?: number;
    user_id: number;
    post_id: number;
    comment: string;
    date_création?: Date;
    date_modification?: Date
}


class Commentaires extends  Model<CommentAttributes> 
    implements CommentAttributes {
    public id?: number;
    public readonly user_id!: number;
    public post_id!: number;
    public comment!: string;
    public readonly date_création?: Date;
    public readonly date_modification?: Date;

}


Commentaires.init({
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
    post_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Post,
            key: "id",
        },
        onDelete: "CASCADE",
    },
    comment: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    
},
 {
    sequelize,
    modelName: "Commentaires",
    timestamps: true,
});

Commentaires.belongsTo(Utilisateur, { foreignKey: "user_id" });
Utilisateur.hasMany(Commentaires, { foreignKey: "user_id" });

Commentaires.belongsTo(Post, {foreignKey: "post_id"});
Post.hasMany(Commentaires, {foreignKey: "post_id", as: "commentaires"});
export default Commentaires;