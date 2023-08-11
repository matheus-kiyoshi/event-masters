import { App } from "../app"
import { Event } from "../entities/Event"
import request from 'supertest'

const app = new App()
const express = app.app

describe('Event test', () => {
  it('/POST Event', async () => {
    const event = {
      title: 'Taylor Swift',
      price: [{
        sector: 'Pista', 
        amount: '200' 
      }],
      description: 'The Eras Tour',
      city: 'São Paulo',
      location: {
        latitude: '-19.8658619', 
        longitude: '-43.9737064'
      },
      coupons: [],
      date: new Date(),
      participants: []
    } 
    const response = await request(express)
      .post('/events')
      .field('title', event.title)
      .field('description', event.description)
      .field('city', event.city)
      .field('location[latitude]', event.location.latitude)
      .field('location[longitude]', event.location.longitude)
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