export default class State {
  constructor(actor, name) {
    this.actor = actor
    this.name = name
    this.action = actor?.actions[name]
    this.prevState = ''
    this.last = Date.now() // for ai intervals
  }

  get input() {
    return this.actor.input
  }

  get actions() {
    return this.actor.actions
  }

  get prevOrIdle() {
    if (this.prevState == 'pain') return 'idle' // bugfix
    return this.prevState || 'idle'
  }

  /* FSM */

  enter(oldState, oldAction) {
    // if (this.actor.name == 'player') console.log(this.name)
    this.prevState = oldState?.name
    if (this.action) this.action.enabled = true
  }

  update(delta) {}

  exit() {}

  /* ANIM HELPERS */

  findActiveAction(prevAction) {
    if (prevAction) return prevAction
    const { mixer } = this.actor
    const othersActive = mixer?._actions.filter(action => action.isRunning() && action !== this.action)

    const first = othersActive.shift()
    // if (othersActive.length > 1) mixer.stopAllAction()
    othersActive.forEach(action => action.stop())
    return first
  }

  transitFrom(prevAction, duration = .25) {
    const oldAction = this.findActiveAction(prevAction)
    if (this.action === oldAction) return

    if (this.action && oldAction) this.action.crossFadeFrom(oldAction, duration)
    this.action?.play()
  }

  syncLegs() {
    const oldAction = this.actions[this.prevState]
    const ratio = this.action.getClip().duration / oldAction.getClip().duration
    this.action.time = oldAction.time * ratio
  }

  // https://gist.github.com/rtpHarry/2d41811d04825935039dfc075116d0ad
  reverseAction(action = this.action, timescale = -1) {
    if (!action) return
    if (action.time === 0)
      action.time = action.getClip().duration
    action.paused = false
    action.setEffectiveTimeScale(timescale)
  }
}