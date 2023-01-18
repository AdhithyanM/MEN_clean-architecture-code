/*
  - Entry point to our entire microservice is this index.js file under src folder.
  - Here we use express framework to communicate over HTTP.
 */

import express from 'express'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
// Controllers import.
import {
  deleteComment,
  getComments,
  notFound,
  postComment,
  patchComment
} from './controllers'
// Callback method which acts as an adapter between express and our controller.
import makeCallback from './express-callback'

dotenv.config()

const apiRoot = process.env.DM_API_ROOT
const app = express()
app.use(bodyParser.json())
// TODO: figure out DNT compliance.
app.use((_, res, next) => {
  res.set({ Tk: '!' })
  next()
})
app.post(`${apiRoot}/comments`, makeCallback(postComment))
app.delete(`${apiRoot}/comments/:id`, makeCallback(deleteComment))
app.delete(`${apiRoot}/comments`, makeCallback(deleteComment))
app.patch(`${apiRoot}/comments/:id`, makeCallback(patchComment))
app.patch(`${apiRoot}/comments`, makeCallback(patchComment))
app.get(`${apiRoot}/comments`, makeCallback(getComments))
app.use(makeCallback(notFound))


  // listen for requests
  app.listen(3000, () => {
    console.log('Server is listening on port 3000')
  })


export default app
