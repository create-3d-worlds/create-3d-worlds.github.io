import { loadModel } from '/utils/loaders.js'
import Warplane from '../Warplane.js'

const mesh = await loadModel({ file: 'aircraft/airplane/triplane-sopwith/triplane.fbx', size: 3 })

// dodati propeler

export default class Triplane extends Warplane {
  constructor(params = {}) {
    super({ mesh, ...params })
  }
}
