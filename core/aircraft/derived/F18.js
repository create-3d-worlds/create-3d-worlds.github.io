import { loadModel } from '/core/loaders.js'
import Warplane from '../Warplane.js'

const mesh = await loadModel({ file: 'aircraft/airplane/f18/model.fbx', size: 3 })

// dodati potisak

export default class F18 extends Warplane {
  constructor(params = {}) {
    super({ mesh, ...params })
  }
}
