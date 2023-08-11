import mongoose from "mongoose"
import { Event } from "../entities/Event"
import { IEventRepository } from "./EventRepository"
import { Location } from "../entities/Location"

const eventSchema = new mongoose.Schema({
  title: String,
  location: {
    latitude: String,
    longitude: String
  },
  date: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  description: String,
  categories: [String],
  banner: String,
  flyers: [String],
  price: {
    type: Array,
  },
  city: String,
  participants: {
    type: Array,
    ref: "User"
  }
})

const EventModel = mongoose.model('Event', eventSchema)

class EventRepositoryMongoose implements IEventRepository {
  async add(event: Event): Promise<Event> {
    const eventModel = new EventModel(event)

    await eventModel.save()
    return event
  }

  async findByLocationAndDate(location: Location, date: Date): Promise<Event | undefined> {
    const findEvent = await EventModel.findOne({ location, date}).exec()
    return findEvent ? findEvent.toObject() : undefined
  }
}

export { EventRepositoryMongoose }
