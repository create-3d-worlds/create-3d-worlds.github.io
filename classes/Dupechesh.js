// https://threejs.org/examples/webgl_loader_md2_control.html
import Model from './Model.js'

const baseDir = '../assets/models/ogro/'

export default class Dupechesh extends Model {
  constructor(callback, size) {
    super(callback, `${baseDir}ogro.md2`, `${baseDir}skins/arboshak.png`, size)
  }

  idle() {
    // stand, flip, salute_alt
    this.changeAnimation('stand', THREE.LoopRepeat)
  }

  walk() {
    this.changeAnimation('run', THREE.LoopRepeat)
  }

  jump() {
    this.changeAnimation('jump', THREE.LoopOnce)
  }

  death() {
    // crdeath, deatha, deathb, deathc
    this.changeAnimation('deathc', THREE.LoopOnce)
  }

  chesh() {
    this.changeAnimation('flip', THREE.LoopRepeat)
  }
}