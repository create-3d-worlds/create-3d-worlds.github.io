import { jumpStyles } from '/utils/constants.js'

import IdleState from './IdleState.js'
import RunState from './RunState.js'
import WalkState from './WalkState.js'
import AnimOnceState from './AnimOnceState.js'
import JumpState from './JumpState.js'
import JumpFlyState from './JumpFlyState.js'
import FlyState from './FlyState.js'
import FallState from './FallState.js'
import AttackLoopState from './AttackLoopState.js'
import AttackOnceState from './AttackOnceState.js'

import AIIdleState from '../ai-states/AIIdleState.js'
import WanderState from '../ai-states/WanderState.js'
import PursueState from '../ai-states/PursueState.js'
import FollowState from '../ai-states/FollowState.js'
import FleeState from '../ai-states/FleeState.js'
import PatrolState from '../ai-states/PatrolState.js'
import AIAttackOnceState from '../ai-states/AIAttackOnceState.js'
import AIAttackLoopState from '../ai-states/AIAttackLoopState.js'
import AIFallState from '../ai-states/AIFallState.js'

const chooseJumpState = jumpStyle => {
  switch (jumpStyle) {
    case jumpStyles.FALSE_JUMP: return JumpState
    case jumpStyles.FLY_JUMP: return JumpFlyState
    case jumpStyles.FLY: return FlyState
  }
}

export function getPlayerState(name, jumpStyle, attackStyle) {
  switch (name) {
    case 'idle': return IdleState
    case 'walk': return WalkState
    case 'run': return RunState
    case 'fall': return FallState
    case 'jump': return chooseJumpState(jumpStyle)
    case 'attack':
    case 'attack2': {
      if (attackStyle === 'LOOP') return AttackLoopState
      if (attackStyle === 'ONCE') return AttackOnceState
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
      if (attackStyle === 'LOOP') return AIAttackLoopState
      if (attackStyle === 'ONCE') return AIAttackOnceState
    }
    default: return AnimOnceState
  }
}