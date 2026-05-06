import { Inject, Injectable } from "@nestjs/common";
import { type Database } from "src/database/database.types";


@Injectable()
export class CategoriesRepository {

  constructor(
    @Inject('DATABASE')
    private readonly db: Database,
  ){}

   async getCategories() {
     return await this.db.query.categories.findMany()
  }


}
