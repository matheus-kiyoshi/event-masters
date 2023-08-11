import { Event } from "../entities/Event"

interface IEventRepository {
  add(event: Event): Promise<Event> 
}

export { IEventRepository }