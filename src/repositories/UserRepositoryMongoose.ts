import mongoose from "mongoose"
import { IUserRepository } from "./UserRepository"
import { User } from "../entities/User"

const userSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: new mongoose.Types.ObjectId().toString()
  },
  name: String,
  email: String,
})

const UserModel = mongoose.model('User', userSchema)

class UserRepositoryMongoose implements IUserRepository {
  async add(user: User): Promise<any> {
    const userModel = new UserModel(user)

    await userModel.save()

    return userModel
  }

  async verifyIfUserExists(email: string): Promise<User | undefined> {
    const findUser = await UserModel.findOne({ email }).exec()
    return findUser ? findUser.toObject() : undefined
  }
}

export { UserRepositoryMongoose }
