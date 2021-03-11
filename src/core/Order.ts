import Dish from './Dish'

export default class Order {
  id: number
  dishes: Dish[]

  constructor(id: number, dishes: Dish[]) {
    this.id = id
    this.dishes = dishes
  }
}
