import express, { Router } from 'express'
import { StatusCodes } from 'http-status-codes'
import { userRoute } from './userRoute.js'
import { conversationRoute } from './conversationRoute.js'
import { messageRoute } from './messageRoute.js'

const router = express.Router()

router.get('/status', (req, res) => {
    res.status(StatusCodes.OK).json({ message: "APIs v1 is used"})
})

router.use('/users', userRoute)
router.use('/conversations', conversationRoute)
router.use('/messages', messageRoute)
export const APIs_V1 = router