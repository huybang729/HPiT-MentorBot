//const express = require('express')
import express from 'express'
import cors from 'cors';
import ngrok from 'ngrok'
import dotenv from "dotenv";
dotenv.config();

import { CONNECT_DB } from './config/mongodb.js'
import { APIs_V1 } from './routes/v1/index.js';


const START_SERVER = () => {
	const app = express()
	app.use(cors());
	const HOSTNAME = 'localhost'
	const PORT = 8000

	app.use(express.json())
	app.use('/v1', APIs_V1)

	app.get('/', function (req, res) {
		res.send('<h1> Hello World Nodejs Test 2</h1>')
	})
	// ngrok.kill()
	app.listen(PORT, HOSTNAME, async () => {
		console.log(`Server is running on https://${HOSTNAME}:${PORT}`)
		// try {
		// 	const url = await ngrok.connect({
		// 		addr: PORT,
		// 		authtoken: process.env.NGROK_AUTH_TOKEN
		// 	})
		// 	console.log(`🌐 Public URL: ${url}`)
		// } catch (err) {
		// 	console.error('❌ Ngrok error:', err)
		// }
	});
}

CONNECT_DB()
	.then(() => console.log('Connected to Database'))
	.then(() => START_SERVER())
	.catch(error => {
		console.error(error)
		process.exit(0)
	})

