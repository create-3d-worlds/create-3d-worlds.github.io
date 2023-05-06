import GameObject from '/utils/objects/GameObject.js'
import { loadModel } from '/utils/loaders.js'

const mesh = await loadModel({ file: 'building/tower/ww2/D85VT1X9UHDSYASVUM1UY02HA.obj', mtl: 'building/tower/ww2/D85VT1X9UHDSYASVUM1UY02HA.mtl', size: 20, shouldAdjustHeight: true })

export default class Tower extends GameObject {
  constructor(params = {}) {
    super({ mesh, ...params })
  }

  update(delta) {
    console.log(this.player)
  }
}