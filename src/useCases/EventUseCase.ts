import { Event } from "../entities/Event";
import { HttpException } from "../interfaces/HttpException";
import { IEventRepository } from "../repositories/EventRepository";
import axios from "axios";
import { UserRepositoryMongoose } from "../repositories/UserRepositoryMongoose";

class EventUseCase {
  constructor(private eventRepository: IEventRepository) {}

  async create(eventData: Event) {
    if (!eventData.banner) {
      throw new HttpException(400, 'O banner é obrigatório')
    }

    if (!eventData.flyers) {
      throw new HttpException(400, 'Os flyers são obrigatórios')
    }

    if (!eventData.location) {
      throw new HttpException(400, 'A localização é obrigatória')
    }

    
    if (!eventData.date) {
      throw new HttpException(400, 'A data é obrigatória')
    }

    // verify if already exists any event with the same location and date
    const verifyEvent = await this.eventRepository.findByLocationAndDate(
      eventData.location,
      eventData.date
    )
    if(verifyEvent) {
      throw new HttpException(400, 'Já existe um evento com esse local e data')
    }

    const cityName = await this.getCityNameByCoordinates(
      eventData.location.latitude,
      eventData.location.longitude
    )

    eventData = {
      ...eventData,
      city: cityName.cityName,
      formattedAddress: cityName.formattedAddress
    }

    const result = await this.eventRepository.add(eventData);
    return result
  }

  async findEventByLocation(
    latitude: string,
    longitude: string
  ) {
    const cityName = await this.getCityNameByCoordinates(latitude, longitude)

    const findEventsByCity = await this.eventRepository.findEventsByCity(cityName.cityName)

    const eventWithRadius = findEventsByCity.filter((event) => {
      const distance = this.calculateDistance(Number(latitude), Number(longitude), Number(event.location.latitude), Number(event.location.longitude))

      return distance <= 3
    })

    return eventWithRadius
  }

  async findEventsByCategory(category: string) {
    if (!category) {
      throw new HttpException(400, 'A categoria é obrigatória')
    }
    const events = await this.eventRepository.findEventsByCategory(category)

    return events
  }

  async filterEvents(
    latitude: number, 
    longitude: number, 
    name: string, 
    date: Date, 
    category: string, 
    radius: number, 
    price: string
  ) {
    const events = await this.eventRepository.findEventsByFilter(
      name,
      date,
      category,
      price
    )

    return events
  }

  async findMainEvents() {
    const events = await this.eventRepository.findMainEvents(new Date())

    return events
  }

  async findEventsByName(name: string) {
    if (!name) {
      throw new HttpException(400, 'O nome é obrigatório')
    }
    const events = await this.eventRepository.findEventsByName(name)

    return events
  }

  async findEventById(id: string) {
    if (!id) {
      throw new HttpException(400, 'O id é obrigatório')
    }
    const event = await this.eventRepository.findEventById(id)

    return event
  }

  async addParticipant(id: string, name: string, email: string) {
    const event = await this.eventRepository.findEventById(id)

    if (!event) {
      throw new HttpException(404, 'Evento não encontrado')
    }

    const UserRepository = new UserRepositoryMongoose()
    const participant = {
      name,
      email
    }
    let user: any = {}
    const verifyIfUserExists = await UserRepository.verifyIfUserExists(email)
    
    if (!verifyIfUserExists) {
      user = await UserRepository.add(participant) 
    } else {
      user = verifyIfUserExists
    }
    
    if(event.participants.includes(user._id)) {
      throw new HttpException(400, 'O usuário já existe')
    }

    event.participants.push(user._id)
    
    const updateEvent = await this.eventRepository.update(event, id)

    return event
  }

  private async getCityNameByCoordinates(
    latitude: string, 
    longitude: string
  ) {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyAhKk5549E8oy5zs-cxAqvy3_j3jDQJoBo`,
      )
  
      if (response.data.status === 'OK' && response.data.results.length > 0) {
        const address = response.data.results[0].address_components
        const cityType = address.find((type: any) => type.types.includes('administrative_area_level_2') && type.types.includes('political'))
    
        const formattedAddress = response.data.results[0].formatted_address

        return {
          cityName: cityType.long_name,
          formattedAddress: formattedAddress
        }
      } 
      throw new HttpException(404, 'Cidade não encontrada')
    }
    catch (error) {
      console.log(error)
      throw new HttpException(401, 'Erro ao buscar cidade')
    }
  }

    // Haversine formula

  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Radius of the earth in km
    const dLat = this.deg2rad(lat2 - lat1);  // deg2rad below
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
      Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const d = R * c; // Distance in km
    return d
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180)
  }
}

export { EventUseCase }
