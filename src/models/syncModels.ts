import sequelize from "../config/database";
import Commentaire from "./Comment.model";
import Follower from "./Follower.model";
import God from "./God.models";
import Post from "./Post.model";
import Session from "./Session.model";
import Utilisateur from "./Utilisateur.model";



const syncDatabase = async () => {
    try {
        //alter: true Met à jour la structure automatiquement la structure de la base de données
        //à utiliser sans options pour utiliser les migrations en production.
        await sequelize.sync({ alter: true });
        console.log("Base de données synchronisée");
    } catch (error) {
        console.error("Erreur lors de la synchronisation :", error);
        console.log("Modèles chargés dans Sequelize:", sequelize.models);
    }
};
export { syncDatabase,  Utilisateur, Follower, God, Session, Post, Commentaire};