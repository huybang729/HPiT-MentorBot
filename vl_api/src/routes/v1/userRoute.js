import express from 'express'
import { userController } from '~/controllers/userController'

const Router = express.Router()

Router.route('/register').post(userController.createUser)
Router.route('/guest').post(userController.createGuestUser)
Router.route('/login').post(userController.getUser)

export const userRoute = Router