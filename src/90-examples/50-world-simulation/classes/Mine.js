import Entity from './Entity.js'
import { roll } from '../utils/helpers.js'

export default class Mine extends Entity {
  constructor(model) {
    super(model)
    this.name = 'mine'
    this.units = 100
    this.mesh = this.model.clone()
    this.rotation.y = roll(180) * (Math.PI / 180)
  }
}
