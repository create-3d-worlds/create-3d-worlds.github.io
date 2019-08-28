// https://threejs.org/examples/webgl_animation_skinning_morph.html
import * as THREE from '../node_modules/three/build/three.module.js'
import Model from './Model.js'

export default class Robotko extends Model {
  constructor(callback, size) {
    super(callback, '../assets/models/robot.glb', null, size, 'glb')
  }

  idle() {
    // Idle, Dance, Wave
    this.changeAnimation('Idle', THREE.LoopRepeat)
  }

  // Walking
  walk() {
    this.changeAnimation('Running', THREE.LoopRepeat)
  }

  jump() {
    this.changeAnimation('Jump', THREE.LoopOnce)
  }

  attack() {
    this.changeAnimation('Punch', THREE.LoopOnce)
  }

  death() {
    this.changeAnimation('Death', THREE.LoopOnce)
  }
}