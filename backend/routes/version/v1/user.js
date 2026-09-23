import express from 'express';
const router = express.Router();
import  User from '../../../models/user.js';
import {handleGetAllUsers ,handleDeleteUserById ,handleCreateUser ,handleUpdateUserById ,handleGetUserById, handlelogin} from '../../../controller/user.js';
import get_required_roles from "../../../middleware/dependency.js";
import { verifytoken } from '../../../middleware/auth.js';

// URL:http://localhost:8000/api/v1/auth/fetch_all
// Method:get
// description:fetch all user
router.get('/fetch_all', verifytoken,get_required_roles(["admin"]),handleGetAllUsers);

// URL:http://localhost:8000/api/v1/auth/delete/:id
// Method:delete
// description: delete user by id
router.delete('/delete/:id',handleDeleteUserById);

// URL:http://localhost:8000/api/v1/auth/create
// Method:post
// description:Create new user
router.post('/create', handleCreateUser);

// URL:http://localhost:8000/api/v1/auth/login
// Method:post
// description: login user
router.post('/login', handlelogin);

// URL:http://localhost:8000/api/v1/auth/update/:id
// Method:put
// description: update the user by id
router.put('/update/:id',handleUpdateUserById);

// URL:http://localhost:8000/api/v1/auth/fetch/:id
// Method:get   
// description:fetch the user by id
router.get('/fetch/:id',handleGetUserById);

export default router;