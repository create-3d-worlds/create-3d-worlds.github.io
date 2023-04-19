import AnimOnceState from '../AnimOnceState.js'

import AIIdleState from './AIIdleState.js'
import WanderState from './WanderState.js'
import PursueState from './PursueState.js'
import FollowState from './FollowState.js'
import FleeState from './FleeState.js'
import PatrolState from './PatrolState.js'
import AIAttackOnceState from './AIAttackOnceState.js'
import AIAttackLoopState from './AIAttackLoopState.js'
import AIFallState from './AIFallState.js'

export function getAIState(name, jumpStyle, attackStyle) {
  switch (name) {
    case 'idle': return AIIdleState
    case 'wander': return WanderState
    case 'pursue': return PursueState
    case 'flee': return FleeState
    case 'patrol': return PatrolState
    case 'follow': return FollowState
    case 'fall': return AIFallState
    case 'attack': {
      if (attackStyle === 'ONCE') return AIAttackOnceState
      if (attackStyle === 'LOOP') return AIAttackLoopState
    }
    default: return AnimOnceState
  }
}