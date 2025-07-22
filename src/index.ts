import express from 'express';
import dotenv from 'dotenv';
import { testConnection } from './config/database';
import { syncDatabase as importedSyncDatabase } from './models/syncModels';
import authRoute from './routes/authRoute';
import swaggerDocs from './config/swagger';
import swaggerUi from 'swagger-ui-express'
import userRoute from './routes/userRoute';
import sessionRoute from './routes/sessionRoute';
import postRoute from './routes/postRoute';
import commentRoute from './routes/commentRoute';
import chatSessionRoute from './routes/chatSessionRoute';
import { v2 as cloudinary } from 'cloudinary';
import godRoute from './routes/godRoute';
import cors from 'cors';
import followRoute from './routes/followRoute';
import chatRoute from './routes/chatRoute';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

cloudinary.config({
    cloud_name: 'dhsf409o1',
    api_key: '317442182697478',
    api_secret: 'x37XaPmNXdQKa9huxGq2MJ8_R-A'
});

dotenv.config();

const app = express();

const PORT = 3000;
console.log("lancement du serveur")

const corsOptions = {
  origin: process.env.CLIENT_URL, 
  methods: 'GET,POST,DELETE,PUT', 
  allowedHeaders: ["Content-Type", "Authorization"], 
  credentials: true, 
};
app.use(cors(corsOptions));

const server = app.listen(PORT, () => {
  console.log(`📡 Serveur HTTP + WebSocket lancé sur http://localhost:${PORT}`);
});

app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "'nonce-random123'"],
                styleSrc: ["'self'"], // Supprimer 'strict-dynamic'
                imgSrc: ["'self'"], // Supprimer 'data:'
                objectSrc: ["'none'"],
                baseUri: ["'self'"],
                formAction: ["'self'"],
                frameAncestors: ["'none'"],
                scriptSrcAttr: ["'none'"],
                upgradeInsecureRequests: [],
            },
        },
    })
);


export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 20, 
  message: "⛔ Trop de requêtes. Réessayez plus tard."
});
app.use(apiLimiter);




app.use(express.json({ limit: '10mb' }));



testConnection().then(() => importedSyncDatabase());
//TODO ajouter ici connection à la BDD
//TODO ajouter ici les routes
app.use('/auth', authRoute)
app.use('/users', userRoute)
app.use('/sessions', sessionRoute)
app.use('/post', postRoute)
app.use('/comment', commentRoute)
app.use('/god', godRoute)
app.use('/follow', followRoute)
app.use('/chat', chatRoute)
app.use('/chatSession', chatSessionRoute)


//app.listen indique au serveur d'écouter les requêtes HTTP arrivant sur le
//port indiqu

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));



