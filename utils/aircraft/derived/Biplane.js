import { loadModel } from '/utils/loaders.js'
import Warplane from '../Warplane.js'

// aircraft/airplane/biplane-sopwith/model.fbx
// aircraft/airplane/biplane-bristol-f2b/model.fbx

const [mesh, propeller] = await Promise.all([
  await loadModel({ file: 'aircraft/airplane/biplane-sopwith/model.fbx', size: 2.5 }),
  await loadModel({ file: 'item/propeller/model.fbx', size: 1.5, angle: Math.PI }),
])

export default class Biplane extends Warplane {
  constructor(params = {}) {
    super({ mesh, ...params })
    this.propeller = propeller
  }
}
