import { IEventRepository } from "../repositories/EventRepository";

class EventUseCase {
  constructor(private eventRepository: IEventRepository) {}

  create(eventData: Event) {
    const result = await this.eventRepository.add(eventData);
    return result
  }

}

export { EventUseCase }