import { jumpStyles } from '/core/constants.js'

import IdleState from './IdleState.js'
import RunState from './RunState.js'
import WalkState from './WalkState.js'
import AnimOnceState from './AnimOnceState.js'
import JumpState from './JumpState.js'
import FlyJumpState from './FlyJumpState.js'
import FlyState from './FlyState.js'
import FallState from './FallState.js'
import AttackLoopState from './AttackLoopState.js'
import AttackOnceState from './AttackOnceState.js'
import SpecialState from './SpecialState.js'

const chooseJumpState = jumpStyle => {
  switch (jumpStyle) {
    case jumpStyles.ANIM_JUMP: return JumpState
    case jumpStyles.FLY_JUMP: return FlyJumpState
    case jumpStyles.FLY: return FlyState
  }
}

export function getPlayerState(name, jumpStyle, attackStyle) {
  switch (name) {
    case 'idle': return IdleState
    case 'walk': return WalkState
    case 'run': return RunState
    case 'fall': return FallState
    case 'special': return SpecialState
    case 'jump': return chooseJumpState(jumpStyle)
    case 'attack':
    case 'attack2': {
      if (attackStyle === 'ONCE') return AttackOnceState
      if (attackStyle === 'LOOP') return AttackLoopState
    }
    default: return AnimOnceState
  }
}
