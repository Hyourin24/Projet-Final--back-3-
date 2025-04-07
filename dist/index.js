"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
//Création d'un serveur Express
const app = (0, express_1.default)();
//Définition du port du serveur
const PORT = 3000;
console.log("lancement du serveur");
//Config du serveur par défaut
app.use(express_1.default.json());
//TODO ajouter ici connection à la BDD
//TODO ajouter ici les routes
//app.listen indique au serveur d'écouter les requêtes HTTP arrivant sur le
//port indiqué
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
