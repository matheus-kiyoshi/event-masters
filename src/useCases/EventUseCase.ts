import { Event } from "../entities/Event";
import { IEventRepository } from "../repositories/EventRepository";

class EventUseCase {
  constructor(private eventRepository: IEventRepository) {}

  async create(eventData: Event) {
    const result = await this.eventRepository.add(eventData);
    return result
  }

}

export { EventUseCase }
