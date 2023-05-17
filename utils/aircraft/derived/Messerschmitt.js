import { loadModel } from '/utils/loaders.js'
import Warplane from '../Warplane.js'

// aircraft/airplane/messerschmitt-bf-109-pilot/model.glb
// aircraft/airplane/messerschmitt-bf-109/model.fbx
const mesh = await loadModel({ file: 'aircraft/airplane/messerschmitt-bf-109-pilot/model.glb', size: 3 })

export default class Messerschmitt extends Warplane {
  constructor(params = {}) {
    super({ mesh, ...params })
  }
}
