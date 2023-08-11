import { User } from "../entities/User"

interface IUserRepository {
  add(user: User): Promise<User>
  verifyIfUserExists(email: string): Promise<User | undefined>
}

export { IUserRepository }