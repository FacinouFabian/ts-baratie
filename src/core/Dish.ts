enum DishType {
  Takoyaki = 'takoyaki',
  Katsudon = 'katsudon',
  Udon = 'udon',
  Ramen = 'ramen',
  MatchaCookie = 'matchaCookie',
}

enum Size {
  S = 'S',
  M = 'M',
  L = 'L',
  XL = 'XL',
  XXL = 'XXL',
}

export default class Dish {
  id: number
  orderId: number
  type: DishType
  size: Size
  ready: boolean

  constructor(id: number, orderId: number, type: DishType, size: Size) {
    this.id = id
    this.orderId = orderId
    this.type = type
    this.size = size
    this.ready = false
  }
}
