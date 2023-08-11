import { NextFunction, Request, Response } from "express";
import { EventUseCase } from "../useCases/EventUseCase";
import { Event } from "../entities/Event";

class EventController {
  constructor(private eventUseCase: EventUseCase) {
    
  }

  async create(request: Request, response: Response, next: NextFunction) {
    let eventData: Event = request.body

    const files = request.files as any

    if (files) {
      const banner = files.banner[0]
      const flyers = files.flyers

      eventData = {
        ...eventData,
        banner: banner.filename,
        flyers: flyers.map((flyer: any) => flyer.filename)
      }
    }

    try {
      await this.eventUseCase.create(eventData)
      return response
        .status(201)
        .json({ message: 'Evento criado com sucesso.' })
    }
    catch (error) {
      next(error);
    }
  }
  async findEventByLocation(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const { latitude, longitude } = request.query
    try {
      const events = await this.eventUseCase.findEventByLocation(
        Number(latitude),
        Number(longitude)
      )
      return response.status(200).json(event)
    }
    catch (error) {
      next(error);
    }
  }
}

export { EventController }