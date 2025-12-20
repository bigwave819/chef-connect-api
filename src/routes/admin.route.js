import express from 'express'

const router = express.Router()
import { adminOnly } from '../middleware/auth.middleware.js'
import ProtectedRoute from '../middleware/auth.middleware.js'
import { approveUser, rejectUser } from '../controller/admin.controller.js'


router.use(ProtectedRoute, adminOnly)

router.put('/approve/:id', approveUser)
router.put('/reject/:id', rejectUser)

export default router