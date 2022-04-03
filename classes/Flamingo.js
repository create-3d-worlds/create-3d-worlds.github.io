import Zeppelin from './Zeppelin.js'

export default class Flamingo extends Zeppelin {
  constructor(callback, params) {
    super(mesh => {
      callback(mesh)
    }, { file: 'ptice/flamingo.glb', scale: .3, minHeight: 10, ...params })
  }

  prepareModel(model) {
    model.rotateY(Math.PI)
    model.scale.set(this.scale, this.scale, this.scale)
  }

  update() {
    super.update()
    if (this.action)
      if (this.isTouchingGround()) this.action.stop()
      else this.action.play()
  }
}
