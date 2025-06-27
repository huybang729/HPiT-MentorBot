import express from 'express'
import { conversationController } from '~/controllers/conversationController'

const Router = express.Router()

Router.route('/').post(conversationController.createConversation)
Router.route('/').get(conversationController.listConversations)
Router.route('/:id/listen').get(conversationController.listenConversation)
Router.route('/:id').delete(conversationController.deleteConversation)
Router.route('/:id/rename').put(conversationController.renameConversation)
export const conversationRoute = Router