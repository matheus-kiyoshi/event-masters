import { Event } from "../entities/Event";
import { HttpException } from "../interfaces/HttpException";
import { IEventRepository } from "../repositories/EventRepository";
import axios from "axios";

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
      city: cityName
    }

    const result = await this.eventRepository.add(eventData);
    return result
  }

  async findEventByLocation(
    latitude: string,
    longitude: string
  ) {
    const cityName = await this.getCityNameByCoordinates(latitude, longitude)

    const findEventsByCity = await this.eventRepository.findEventsByCity(cityName)

    const eventWithRadius = findEventsByCity.filter((event) => {
      const distance = this.calculateDistance(Number(latitude), Number(longitude), Number(event.location.latitude), Number(event.location.longitude))

      return distance <= 3
    })

    return eventWithRadius
  }

  async findEventsByCategory(category: string) {
    const events = await this.eventRepository.findEventsByCategory(category)
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
    
        return cityType.long_name
      } 
      throw new HttpException(404, 'Cidade não encontrada')
    }
    catch (error) {
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
