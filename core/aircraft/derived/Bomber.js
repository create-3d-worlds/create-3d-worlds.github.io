import { loadModel } from '/core/loaders.js'
import Warplane from '../Warplane.js'

const mesh = await loadModel({ file: 'aircraft/airplane/bomber-lancaster/model.glb', size: 3 })

export default class Bomber extends Warplane {
  constructor(params = {}) {
    super({ mesh, ...params })
  }
}
