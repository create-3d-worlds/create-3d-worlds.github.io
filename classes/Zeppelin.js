import Aircraft from './Aircraft.js'

const angleSpeed = .01
const pitchSpeed = angleSpeed / 5

export default class Zeppelin extends Aircraft {
  constructor(callback, params) {
    super(mesh => {
      mesh.rotation.order = 'YZX' // default is 'ZYX'
      callback(mesh)
    }, { file: 'santos-dumont-9/model.dae', maxPitch: .1, ...params })
  }

  prepareModel(model) {
    model.rotateZ(Math.PI / 2)
    model.translateX(75)
    model.translateZ(40)
    super.prepareModel(model)
  }

  up() {
    this.mesh.translateY(1)
    this.pitch(pitchSpeed)
  }

  down() {
    this.mesh.translateY(-1)
    this.pitch(-pitchSpeed)
  }

  left() {
    this.yaw(angleSpeed)
  }

  right() {
    this.yaw(-angleSpeed)
  }

}
