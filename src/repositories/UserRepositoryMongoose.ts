import mongoose from "mongoose"
import { IUserRepository } from "./UserRepository"
import { User } from "../entities/User"

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
})

const UserModel = mongoose.model('user', userSchema)

class UserRepositoryMongoose implements IUserRepository {
  async add(user: User): Promise<User> {
    const userModel = new UserModel(user)

    await userModel.save()
    return user
  }

  async verifyIfUserExists(email: string): Promise<User | undefined> {
    const findUser = await UserModel.findOne({ email }).exec()
    return findUser ? findUser.toObject() : undefined
  }
}

export { UserRepositoryMongoose }
