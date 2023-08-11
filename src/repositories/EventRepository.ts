import { Event } from "../entities/Event"
import { Location } from "../entities/Location"
import { User } from "../entities/User"

interface IEventRepository {
  add(event: Event): Promise<Event> 
  findByLocationAndDate(location: Location, date: Date): Promise<Event | undefined>
  findEventsByCity(city: string): Promise<Event[]>
  findEventsByCategory(category: string): Promise<Event[]>
  findEventsByName(name: string): Promise<Event[]>
  findEventById(id: string): Promise<Event | undefined>
  update(event: Event, id: string): Promise<any>
}

export { IEventRepository }