import { App } from "../app"
import { Event } from "../entities/Event"
import request from 'supertest'
import { EventUseCase } from "../useCases/EventUseCase"
import { IEventRepository } from "../repositories/EventRepository"
import crypto from 'node:crypto'

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
  formattedAddress: 'Allianz Parque, São Paulo',
  location: {
    latitude: '-23.527', 
    longitude: '-46.678'
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
      .field('formattedAddress', event.formattedAddress)
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
  it('/GET/:id Get event by id', async () => {
    const response = await request(express)
      .get('/events/64e76d0a07270a57ad4d981d')

      if (response.error) {
        console.log('ERRO: ', response.error)
      }

      expect(response.status).toBe(200)
  })
  it('/GET Get event by location', async () => {
    const response = await request(express)
      .get('/events?latitude=-23.527&longitude=-46.678')

      if (response.error) {
        console.log('ERRO: ', response.error)
      }

      expect(response.status).toBe(200)
      expect(response.body.length).toBeGreaterThan(0)
  })
  it('/GET Get event by category', async () => {
    const response = await request(express)
      .get('/events/category/Show')

      if (response.error) {
        console.log('ERRO: ', response.error)
      }

      expect(response.status).toBe(200)
      expect(response.body.length).toBeGreaterThan(0)
  })
  it('/POST event insert user', async () => {
    const response = await request(express)
      .post('/events/64e76d0a07270a57ad4d981d/participants')
      .send({
        name: 'Matheus',
        email: crypto.randomBytes(10).toString('hex') + '@test.com'
      })

      if (response.error) {
        console.log('ERRO: ', response.error)
      }

      expect(response.status).toBe(200)
  })
})

const eventRepository = {
  add: jest.fn(),
  findEventsByCity: jest.fn(),
  findEventsByCategory: jest.fn(),
  findByLocationAndDate: jest.fn(),
  findMainEvents: jest.fn(),
  findEventsByFilter: jest.fn(),
  findEventsByName: jest.fn(),
  findEventById: jest.fn(),
  update: jest.fn()
}
const eventUseCase = new EventUseCase(eventRepository)

describe('Unit Test', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })
  
  it('should return an array of events by category', async () => {
    eventRepository.findEventsByCategory.mockResolvedValue([event])
    const result = await eventUseCase.findEventsByCategory('Show')

    expect(result).toEqual([event])
    expect(eventRepository.findEventsByCategory).toHaveBeenCalledWith('Show')
  })

  it('should return an array of events by name', async () => {
    eventRepository.findEventsByName.mockResolvedValue([event])
    const result = await eventUseCase.findEventsByName('Taylor Swift')

    expect(result).toEqual([event])
    expect(eventRepository.findEventsByName).toHaveBeenCalledWith('Taylor Swift')
  })

  it('should return an array of event by id', async () => {
    eventRepository.findEventById.mockResolvedValueOnce(event)
    const result = await eventUseCase.findEventById('64e76d0a07270a57ad4d981d')

    expect(result).toEqual(event)
    expect(eventRepository.findEventById).toHaveBeenCalledWith('64e76d0a07270a57ad4d981d')
  })
})