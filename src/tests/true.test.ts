import { login } from "../controller/UserController";
import Utilisateur from "../models/Utilisateur.model"
import { generateToken } from "../utils/JWTutils"
import { hashPassword, verifyPassword } from "../utils/pwdUtils";

//  Mock des dépendances
jest.mock("../utils/pwdUtils", () => ({
    verifyPassword: jest.fn(),
    hashPassword: jest.fn(),
}));

jest.mock("../utils/JWTUtils", () => ({
    generateToken: jest.fn()
}));

jest.mock("../models/Utilisateur.model", () => ({
    __esModule: true, // nécessaire pour les imports ESModule par défaut
    default: {
        findOne: jest.fn(),
        create: jest.fn(),
        get: jest.fn(),
    },
}));


// Création d'un mock propre de Sequelize
jest.mock("sequelize", () => {
    const actualSequelize = jest.requireActual("sequelize");

    class MockModel {
        static init = jest.fn();
        static findOne = jest.fn();
    }

    return {
        Sequelize: jest.fn(() => ({
            define: jest.fn(),
            sync: jest.fn(),
            authenticate: jest.fn(),
            close: jest.fn()
        })),
        DataTypes: actualSequelize.DataTypes,
        Model: MockModel,
    };
});

describe("login function", () => {
    let req: any;
    let res: any;
    let statusMock: jest.Mock;
    let jsonMock: jest.Mock;
    let cookieMock: jest.Mock;

    beforeEach(() => {
        statusMock = jest.fn().mockReturnThis();
        jsonMock = jest.fn();
        cookieMock = jest.fn();

        req = { body: {} };
        res = { status: statusMock, json: jsonMock, cookie: cookieMock };

        jest.clearAllMocks();
    });
    it("devrait retourner une erreur 404 si l'utilisateur n'existe pas", async () => {
        req.body = { pseudo: "Alito", password: "P@ssw0rd!" };
        (Utilisateur.findOne as jest.Mock).mockResolvedValue(null);
        await login(req, res);
        expect(statusMock).toHaveBeenCalledWith(404);
        expect(jsonMock).toHaveBeenCalledWith({ message: "Utilisateur non trouvé" });
    });
    it("devrait retourner une erreur 401 si le mot de passe est incorrect", async () => {

        req.body = { pseudo: "Alito", password: "P@ssw0rd!" };
        (Utilisateur.findOne as jest.Mock).mockResolvedValue({
            id: 1,
            pseudo: "Alito",
            password: "P@ssw0rd!"
        });

        (verifyPassword as jest.Mock).mockReturnValue(false);
        await login(req, res);
        expect(statusMock).toHaveBeenCalledWith(401);
        expect(jsonMock).toHaveBeenCalledWith({ message: "Mot de passe invalide" });
    });
})
