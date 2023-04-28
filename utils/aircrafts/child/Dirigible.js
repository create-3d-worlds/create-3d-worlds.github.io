import Zeppelin from '../Zeppelin.js'
import { loadModel } from '/utils/loaders.js'

const [mesh, propeler] = await Promise.all([
  await loadModel({ file: 'airship/dirigible/model.fbx', size: 4, shouldCenter: true, shouldAdjustHeight: true }),
  await loadModel({ file: 'item/propeller/model.fbx', size: 1, angle: Math.PI }),
])

export default class Dirigible extends Zeppelin {
  constructor({ altitude = 20, name = 'player', ...rest } = {}) {
    super({ mesh, altitude, name, ...rest })

    propeler.position.set(1.3, .63, .4)
    const propelerLeft = propeler.clone()
    propelerLeft.position.set(-1.3, .63, .4)
    this.mesh.add(propeler, propelerLeft)
    this.propelers.push(propeler, propelerLeft)
  }
}