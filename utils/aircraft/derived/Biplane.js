import { loadModel } from '/utils/loaders.js'
import Warplane from '../Warplane.js'

// dodati propeler

// aircraft/airplane/biplane-bristol-f2b/model.fbx
const mesh = await loadModel({ file: 'aircraft/airplane/biplane-sopwith/model.fbx', size: 3 })

export default class Biplane extends Warplane {
  constructor(params = {}) {
    super({ mesh, ...params })
  }
}
