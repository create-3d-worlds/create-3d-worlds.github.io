import GameObject from '/utils/objects/GameObject.js'
import { loadModel } from '/utils/loaders.js'

const mesh = await loadModel({ file: 'aircraft/airplane/messerschmitt-bf-109/model.fbx', size: 2.5 })

export default class Messerschmitt extends GameObject {
  constructor(params = {}) {
    super({ mesh, ...params })
    this.position.y += this.height / 2
  }
}