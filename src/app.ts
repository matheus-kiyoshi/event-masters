import express, { Application } from 'express'
import { connect } from './infra/database'
import { errorMiddleware } from './middlewares/error.middlewares'
import { EventRoutes } from './routes/event.routes'

class App { 
  public app: Application
  private eventRoutes = new EventRoutes()
  constructor() {
    this.app = express()
    this.middlewaresInitialize()
    this.initializeRoutes()
    this.interceptionError()
    connect()
  }

  initializeRoutes() {
    this.app.use('/events', this.eventRoutes.router)
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