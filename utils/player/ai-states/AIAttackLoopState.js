import State from '../states/State.js'

export default class AIAttackLoopState extends State {
  constructor(...args) {
    super(...args)
    const { actions } = this.actor
    this.action = actions.attack2
      ? Math.random() > .5 ? actions.attack : actions.attack2
      : actions.attack
    this.attackAgain = this.attackAgain.bind(this)
    this.shouldFinishAttack = false
  }

  enter(oldState, oldAction) {
    super.enter(oldState)
    this.actor.attackAction()

    if (this.actor.mixer) {
      if (this.action) this.transitFrom(oldAction, .5)
      this.actor.mixer.addEventListener('loop', this.attackAgain)
    } else
      this.myInterval = setInterval(() => this.attackAgain(), 3000)
  }

  attackAgain() {
    this.actor.attackAction()

    if (this.shouldFinishAttack) {
      this.cleanup()
      this.actor.setState(this.prevOrIdle)
      this.shouldFinishAttack = false // reset to init value
    }
  }

  update() {
    const { actor } = this

    if (actor.distancToTarget > actor.attackDistance)
      this.shouldFinishAttack = true
  }

  cleanup() {
    this.actor?.mixer?.removeEventListener('loop', this.attackAgain)
    if (this.myInterval) clearInterval(this.myInterval)
  }

  exit() {
    this.cleanup()
    if (this.actor.endAttack) this.actor.endAttack()
  }
}
