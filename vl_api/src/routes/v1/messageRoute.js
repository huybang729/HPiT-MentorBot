import express from 'express'
import { messageController } from '~/controllers/messagesController'

const Router = express.Router()

Router.route('/').post(messageController.createMessage)
Router.route('/:id').get(messageController.listMessages)
Router.route('/').delete(messageController.deleteMessage)

export const messageRoute = Router