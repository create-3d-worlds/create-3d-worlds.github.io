import Player from '/classes/Player.js'
import { createPlayerBox } from '/utils/boxes.js'

export default class Savo extends Player {
  constructor({ speed, ...params } = {}) {
    super({ mesh: createPlayerBox({ size: 2, transparent: true }), autoCamera: false, ...params })
    this.speed = speed || this.size * 3
  }
}
