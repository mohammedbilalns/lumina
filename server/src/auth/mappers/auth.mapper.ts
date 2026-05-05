import { User } from "src/database/database.types";

export class AuthMapper {
  static toAuthReponse(
    user: User,
    accessToken: string
  ){
    return {
      accessToken,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
      }
    }
  }
}
