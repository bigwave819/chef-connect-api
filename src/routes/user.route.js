import express from 'express'
const router = express.Router()

import { 
    Register,
    Login, 
    createProfile,
    deleteProfile,
    updateProfile,
    getMyProfile,
    getSpecificUser,
    getSpecificProfile,
    getProfiles
} from '../controller/user.controller.js';
import ProtectedRoute from '../middleware/auth.middleware.js';
import { upload } from '../middleware/multer.middleware.js';

router.post('/register', Register);
router.post('/login', Login);
router.get('/all-profiles', getProfiles);
router.get("/user-info/:id", getSpecificUser);
router.get('/public-profile/:id', getSpecificProfile);

router.use(ProtectedRoute);

router.get('/profile', getMyProfile);
router.post('/profile/create', upload.array("image", 2), createProfile);
router.put('/update', upload.array("image", 2), updateProfile);
router.delete('/delete-account', deleteProfile);

export default router;