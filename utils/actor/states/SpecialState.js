import * as THREE from 'three'
import State from './State.js'

const duration = .25

export default class SpecialState extends State {
  constructor(...args) {
    super(...args)
    this.onFinish = this.onFinish.bind(this)
  }

  enter(oldState, oldAction) {
    super.enter(oldState)
    if (this.name == 'death' && !this.action) return

    if (!this.action) return this.actor.setState(this.prevOrIdle)

    this.oldState = oldState
    const { mixer } = this.actor
    mixer.addEventListener('finished', this.onFinish)
    this.action.reset()
    this.action.setLoop(THREE.LoopOnce, 1)
    this.action.clampWhenFinished = true
    if (oldAction) this.action.crossFadeFrom(oldAction, duration)

    this.action.play()
  }

  onFinish() {
    // this.actor?.mixer?.removeEventListener('finished', this.onFinish)
    if (this.name == 'death') return
    this.actor.setState(this.prevOrIdle)
  }

  exit() {
    this.actor?.mixer?.removeEventListener('finished', this.onFinish)
  }
}