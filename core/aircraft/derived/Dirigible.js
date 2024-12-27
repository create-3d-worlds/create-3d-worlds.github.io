import Airship from '../Airship.js'
import { loadModel } from '/core/loaders.js'

const [mesh, propeller] = await Promise.all([
  await loadModel({ file: 'aircraft/airship/dirigible/model.fbx', size: 4, shouldCenter: true, shouldAdjustHeight: true }),
  await loadModel({ file: 'item/propeller/model.fbx', size: 1, angle: Math.PI }),
])

export default class Dirigible extends Airship {
  constructor({ altitude = 20, name = 'player', ...rest } = {}) {
    super({ mesh, altitude, name, ...rest })

    propeller.position.set(1.3, .63, .4)
    const propellerLeft = propeller.clone()
    propellerLeft.position.set(-1.3, .63, .4)
    this.mesh.add(propeller, propellerLeft)
    this.propellers.push(propeller, propellerLeft)
  }
}