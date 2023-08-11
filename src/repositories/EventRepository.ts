import { Event } from "../entities/Event"
import { Location } from "../entities/Location"

interface IEventRepository {
  add(event: Event): Promise<Event> 
  findByLocationAndDate(location: Location, date: Date): Promise<Event | undefined>
}

export { IEventRepository }