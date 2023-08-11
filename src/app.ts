import express, { Application } from 'express'
import { connect } from './infra/database'
import { errorMiddleware } from './middlewares/error.middlewares'

class App { 
  public app: Application
  constructor() {
    this.app = express()
    this.middlewaresInitialize()
    this.initializeRoutes()
    this.interceptionError()
    connect()
  }

  initializeRoutes() {
    // this.app.use('/api', require('./routes'))
  }

  interceptionError() {
    this.app.use(errorMiddleware)
  }

  middlewaresInitialize() {
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true }))
  }

  listen()      {
    this.app.listen(3333, () => {
      console.log('Server running on port 3333')
    })
  }
}

export { App}