// https://threejs.org/examples/webgl_loader_md2_control.html
import Model from './Model.js'

const baseDir = '../assets/models/ratamahatta/'

export default class Ratamahatta extends Model {
  constructor(callback, size) {
    super(callback, `${baseDir}ratamahatta.md2`, `${baseDir}skins/ratamahatta.png`, size)
  }

  idle() {
    // flip, salute, taunt
    this.changeAnimation('stand', THREE.LoopRepeat)
  }

  walk() {
    this.changeAnimation('run', THREE.LoopRepeat)
  }

  jump() {
    this.changeAnimation('jump', THREE.LoopOnce)
  }

  death() {
    // crdeath, death
    this.changeAnimation('deathc', THREE.LoopOnce)
  }
}