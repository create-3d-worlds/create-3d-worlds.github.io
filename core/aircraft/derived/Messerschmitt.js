import { loadModel } from '/core/loaders.js'
import Warplane from '../Warplane.js'

const [mesh, propeller] = await Promise.all([
  await loadModel({ file: 'aircraft/airplane/messerschmitt-bf-109/model.fbx', size: 2.5 }),
  await loadModel({ file: 'item/propeller/model.fbx', size: 2, angle: Math.PI }),
])

export default class Messerschmitt extends Warplane {
  constructor(params = {}) {
    super({ mesh, ...params })
    this.propeller = propeller
  }
}
