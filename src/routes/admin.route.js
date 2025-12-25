import express from 'express';
const router = express.Router();

import ProtectedRoute, { adminOnly } from '../middleware/auth.middleware.js';
import { approveUser, getAllUser, getDashboardStats } from '../controller/admin.controller.js';

// Apply middleware to all routes in this router
router.use(ProtectedRoute, adminOnly);

// Admin routes
router.put('/approve/:id', approveUser);
router.get('/users', getAllUser);
router.get('/dashboard', getDashboardStats);

export default router;
