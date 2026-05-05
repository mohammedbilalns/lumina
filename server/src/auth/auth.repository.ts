import { Injectable, Inject } from "@nestjs/common";
import { eq, or } from "drizzle-orm";
import { type Database } from "src/database/database.types";
import { users } from "src/database/schemas";
import { SignupDto } from "./dto/signup.dto";

@Injectable()
export class AuthRepository {
  constructor(
    @Inject("DATABASE")
    private readonly db: Database
  ){}

  async findByEmail(email: string){
    return this.db.query.users.findFirst({
      where: eq(users.email, email)
    })
  }

  async findByPhone(phone: string){
    return this.db.query.users.findFirst({
      where: eq(users.phone, phone)
    })
  }

  async findByCredential(
    credential: string,
  ) {
    return this.db.query.users.findFirst({
      where: or(
        eq(
          users.email,
          credential,
        ),

        eq(
          users.phone,
          credential,
        ),
      ),
    });
  }

  async createUser(
    data: SignupDto & {
      passwordHash: string
    }
  ){
    const [user ] = await this.db.insert(users).values(
      {...data, dateOfBirth: new Date(data.dateOfBirth)}
    ).returning();
    return user
  }
}
