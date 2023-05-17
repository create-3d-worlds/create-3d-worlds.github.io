import { loadModel } from '/utils/loaders.js'
import Warplane from '../Warplane.js'

// dodati propeler

const mesh = await loadModel({ file: 'aircraft/airplane/messerschmitt-bf-109/model.fbx', size: 3 })

export default class Messerschmitt extends Warplane {
  constructor(params = {}) {
    super({ mesh, ...params })
  }
}
