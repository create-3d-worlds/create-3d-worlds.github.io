import * as THREE from '../node_modules/three/build/three.module.js'
import Model from './Model.js'

export default class GirlModern extends Model {
  constructor(callback, size) {
    super(callback, '../assets/models/girl-walk.fbx', null, size, 'fbx')
  }

  idle() {
    // Character_Idle, Character_LeftTurn, Character_RightTurn
    this.changeAnimation('Character_Idle', THREE.LoopRepeat)
  }

  walk() {
    this.changeAnimation('mixamo.com', THREE.LoopRepeat)
  }

  jump() {
    this.changeAnimation('Take 001', THREE.LoopOnce)
  }
}