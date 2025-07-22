import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import God from "./God.models";
import { string } from "joi";
import Follower from "./Follower.model";

enum Actif {
    actif = 'Actif',
    banni = 'Banni',
}

enum Etat {
    connecté = 'Connecté',
    déconnecté = 'Déconnecté'
}

enum Abonnement {
    abonné = 'Abonné',
    nonabonné = 'Non abonné'
}

enum Role {
    Utilisateur = "Utilisateur", 
    Admin = "Admin",
}

// Définition des attributs d'un utilisateur
interface UtilisateurAttributes {
    id?: number;
    god_id: number;
    avatar?: string;
    pseudo: string;
    email: string;
    actif: Actif;
    etat: Etat;
    role: Role
    bannedUntil?: Date | null;
    abonnement: Abonnement;
    hashedPassword: string;
    createdAt?: Date;
    updatedAt?: Date;
}

class Utilisateur extends Model<UtilisateurAttributes>
    implements UtilisateurAttributes {
    public id!: number;
    public god_id!: number;
    public avatar!: string;
    public pseudo!: string;
    public email!: string;
    public role!: Role
    public actif!: Actif;
    public etat!: Etat;
    public bannedUntil!: Date | null;
    public readonly abonnement!: Abonnement;
    public hashedPassword!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    isAdmin: any;
}

Utilisateur.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        god_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: God,
                key: "id",
            },
            onDelete: "CASCADE",
        },
        avatar: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "https://sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png",
        },
        pseudo: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        actif: {
            type: DataTypes.ENUM("Actif", "Banni"),
            defaultValue: "Actif",
        },
        role: {
            type: DataTypes.ENUM("Utilisateur", "Modérateur", "Admin"),
            defaultValue: "Utilisateur",
        },
        etat: {
            type: DataTypes.ENUM("Connecté", "Déconnecté"),
            defaultValue: "Connecté",
        },
        abonnement: {
            type: DataTypes.ENUM("Abonné", "Non abonné"),
            defaultValue: "Non abonné",
        },
        bannedUntil: {
            type: DataTypes.DATE,
            allowNull: true
        },
        hashedPassword: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: "Utilisateur",
        timestamps: true, // Ajoute createdAt & updatedAt
    }
);

Utilisateur.belongsTo(God, {foreignKey: "god_id"});
God.hasMany(Utilisateur, {foreignKey: "god_id", as: "god"});


export default Utilisateur;
export { Actif };
