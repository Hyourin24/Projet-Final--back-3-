import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

enum Mythologie {
    grec = 'Grec',
    romain = 'Romain',
    égyptien = 'Égyptien',
    nordique = 'Nordique',
    celte = 'Celte',
    chinois = 'Chinois',
    japonais = 'Japonais',
    hindoue = 'Hindoue',
}

interface GodAttributes {
    id?: number;
    nom: string;
    description: string;
    mythologie: Mythologie;
    image_url?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

class God extends Model<GodAttributes> implements GodAttributes {
    public id?: number;
    public nom!: string;
    public description!: string;
    public mythologie!: Mythologie;
    public image_url?: string;
    public readonly createdAt?: Date;
    public readonly updatedAt?: Date;
}

God.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        nom: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        mythologie: {
            type: DataTypes.ENUM('Grec', 'Romain', 'Égyptien', 'Nordique', 'Celte', 'Chinois', 'Japonais'),
            allowNull: false,
        },
        image_url: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: "God",
        timestamps: true,
    }
);



export default God;