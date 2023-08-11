import mongoose from "mongoose"

export async function connect() {
  try {
    await mongoose.connect(
      'mongodb+srv://matheuskiyoshi:JOeQMzEgc4Y4X2RA@cluster0.wqwasrx.mongodb.net/eventmasters'
    )
    console.log('connect database success')
  } catch (error) {
    console.log(error)
  }
}