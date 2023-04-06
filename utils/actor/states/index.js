import { jumpStyles } from '/utils/constants.js'

import IdleState from './IdleState.js'
import RunState from './RunState.js'
import WalkState from './WalkState.js'
import AnimOnceState from './AnimOnceState.js'
import JumpState from './JumpState.js'
import JumpFlyState from './JumpFlyState.js'
import DoubleJumpState from './DoubleJumpState.js'
import FlyState from './FlyState.js'
import FallState from './FallState.js'
import AttackLoopState from './AttackLoopState.js'
import AttackOnceState from './AttackOnceState.js'
import SpecialState from './SpecialState.js'

import AIIdleState from './ai/AIIdleState.js'
import WanderState from './ai/WanderState.js'
import PursueState from './ai/PursueState.js'
import FollowState from './ai/FollowState.js'
import FleeState from './ai/FleeState.js'
import PatrolState from './ai/PatrolState.js'
import AIAttackOnceState from './ai/AIAttackOnceState.js'
import AIAttackLoopState from './ai/AIAttackLoopState.js'
import AIFallState from './ai/AIFallState.js'

const chooseJumpState = jumpStyle => {
  switch (jumpStyle) {
    case jumpStyles.FALSE_JUMP: return JumpState
    case jumpStyles.FLY_JUMP: return JumpFlyState
    case jumpStyles.FLY: return FlyState
    case jumpStyles.DOUBLE_JUMP: return DoubleJumpState
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

export function getAIState(name, jumpStyle, attackStyle) {
  switch (name) {
    case 'idle': return AIIdleState
    case 'wander': return WanderState
    case 'pursue': return PursueState
    case 'flee': return FleeState
    case 'patrol': return PatrolState
    case 'follow': return FollowState
    case 'fall': return AIFallState
    case 'jump': return chooseJumpState(jumpStyle)
    case 'attack': {
      if (attackStyle === 'ONCE') return AIAttackOnceState
      if (attackStyle === 'LOOP') return AIAttackLoopState
    }
    default: return AnimOnceState
  }
}