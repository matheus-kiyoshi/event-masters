import { App } from "../app"
import { Event } from "../entities/Event"
import request from 'supertest'
import { EventUseCase } from "../useCases/EventUseCase"
import { IEventRepository } from "../repositories/EventRepository"

const app = new App()
const express = app.app

const event: Event = {
  title: 'Taylor Swift',
  price: [{
    sector: 'Pista', 
    amount: '200' 
  }],
  categories: ["Show"],
  description: 'The Eras Tour',
  city: 'São Paulo',
  location: {
    latitude: '-23.527201', 
    longitude: '-46.678572'
  },
  banner: 'banner.png',
  flyers: [
    'flyer1.png',
    'flyer2.png'
  ],
  coupons: [],
  date: new Date(),
  participants: []
} 

describe('Event test', () => {
  it('/POST Event', async () => {
    const response = await request(express)
      .post('/events')
      .field('title', event.title)
      .field('description', event.description)
      .field('city', event.city)
      .field('categories', event.categories)
      .field('location[latitude]', event.location.latitude)
      .field('location[longitude]', event.location.longitude)
      .field('date', event.date.toISOString())
      .field('price[sector]', event.price[0].sector)
      .field('price[amount]', event.price[0].amount)
      .field('coupons', event.coupons)
      .attach('banner', './src/tests/banner.png')
      .attach('flyers', './src/tests/flyer1.png')
      .attach('flyers', './src/tests/flyer2.png')
      if (response.error) {
        console.log('ERRO: ', response.error)
      }

      expect(response.status).toBe(201)
      expect(response.body).toEqual({ message: 'Evento criado com sucesso.' })
  })
})

const eventRepository = {
  add: jest.fn(),
  findEventsByCity: jest.fn(),
  findEventsByCategory: jest.fn(),
  findByLocationAndDate: jest.fn(),
}
const eventUseCase = new EventUseCase(eventRepository)

describe('Unit Test', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })
  
  it.only('should return an array of events by category', async () => {
    eventRepository.findEventsByCategory.mockResolvedValue([event])
    const result = await eventUseCase.findEventsByCategory('Show')

    expect(result).toEqual([event])
    expect(eventRepository.findEventsByCategory).toHaveBeenCalledWith('Show')
  })
})