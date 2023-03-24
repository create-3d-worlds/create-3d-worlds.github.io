import { jumpStyles } from '/utils/constants.js'

import IdleState from './IdleState.js'
import RunState from './RunState.js'
import WalkState from './WalkState.js'
import SpecialState from './SpecialState.js'
import JumpState from './JumpState.js'
import JumpFlyState from './JumpFlyState.js'
import FlyState from './FlyState.js'
import FallState from './FallState.js'
import AttackLoopState from './AttackLoopState.js'
import DeathState from './DeathState.js'
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

const playerStates = {
  idle: IdleState,
  walk: WalkState,
  run: RunState,
  jump: FlyState,
  fall: FallState,
  death: DeathState,
}

const aiStates = {
  idle: AIIdleState,
  wander: WanderState,
  pursue: PursueState,
  flee: FleeState,
  patrol: PatrolState,
  follow: FollowState,
  attack: AIAttackOnceState,
  fall: AIFallState,
  death: DeathState,
}

const chooseJumpState = jumpStyle => {
  switch (jumpStyle) {
    case jumpStyles.FALSE_JUMP: return JumpState
    case jumpStyles.FLY_JUMP: return JumpFlyState
    case jumpStyles.FLY: return FlyState
  }
}

export function getPlayerState(name, jumpStyle, attackStyle) {
  if (name === 'jump') return chooseJumpState (jumpStyle)
  if (name === 'attack' || name === 'attack2') {
    if (attackStyle === 'LOOP') return AttackLoopState
    if (attackStyle === 'ONCE') return AttackOnceState
  }
  return playerStates[name] || SpecialState
}

export function getAIState(name, jumpStyle, attackStyle) {
  if (name === 'jump') return chooseJumpState (jumpStyle)
  if (name === 'attack') {
    if (attackStyle === 'LOOP') return AIAttackLoopState
    if (attackStyle === 'ONCE') return AIAttackOnceState
  }
  return aiStates[name] || SpecialState
}