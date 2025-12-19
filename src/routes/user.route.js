import express from 'express'

const router = express.Router()

import { 
    Register,
    Login, 
    createProfile,
    deleteProfile,
    updateProfile,
    getProfile
 } from '../controller/user.controller.js';
 import ProtectedRoute from '../middleware/auth.middleware.js';


router.post('/register', Register)
router.post('/login', Login),

router.use(ProtectedRoute);

router.get('/:id', getProfile),
router.delete('/:id', deleteProfile),
router.put('/update/:id', updateProfile),
router.post('/profile/create', createProfile)

export default router