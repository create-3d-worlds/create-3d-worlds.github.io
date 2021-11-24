// https://mugen87.github.io/yuka/examples/fsm/
// https://mugen87.github.io/yuka/examples/goal/

import * as THREE from '/node_modules/three108/build/three.module.js'
import Model from '../Model.js'

export default class Girl extends Model {
  constructor(callback, size) {
    super(callback, '/assets/models/girl.glb', null, size, 'glb')
  }

  idle() {
    // Character_Idle, Character_LeftTurn, Character_RightTurn
    this.changeAnimation('Character_Idle', THREE.LoopRepeat)
  }

  walk() {
    this.changeAnimation('Character_Walk', THREE.LoopRepeat)
  }

  squat() {
    this.changeAnimation('Character_Gather', THREE.LoopOnce)
  }

  jump() {
    this.changeAnimation('Character_TPose', THREE.LoopOnce)
  }
}
