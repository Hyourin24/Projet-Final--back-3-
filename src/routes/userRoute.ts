import expess from 'express';
import { deleteUser, getAllUsers, modifyUser, searchUsers, modifyRole, modifyActif, getUserById, getMe } from '../controller/UserController';
import { verifyTokenMiddleware } from '../middlewares/verifyToken';
import { isAdmin } from '../middlewares/verifyRole';


const router = expess.Router();


router.get('/', getAllUsers, verifyTokenMiddleware);
router.put('/', verifyTokenMiddleware, modifyUser);
router.delete('/:id',verifyTokenMiddleware, deleteUser);
router.get('/user/:id', verifyTokenMiddleware, getUserById);
router.get('/me', verifyTokenMiddleware, getMe)
router.put('/actif/:id', isAdmin, modifyActif);



export default router;