export default class GameLoop {
  constructor(callback) {
    this.callback = callback
    this.lastTimestamp = 0
    this.time = 0
    this.isPaused = false
    this.animationFrameId = null
    // conditionally handlePointerLockChange?
    document.addEventListener('pointerlockchange', this.handlePointerLockChange)
  }

  get isRunning() {
    return Boolean(this.animationFrameId)
  }

  /* METHODS */

  start() {
    if (this.isRunning) return

    this.isPaused = false
    this.lastTimestamp = performance.now()
    this.animationFrameId = requestAnimationFrame(this.loop)

    document.addEventListener('keypress', this.handleKeyPress)
    document.addEventListener('visibilitychange', this.handleVisibilityChange)
  }

  stop() {
    if (!this.isRunning) return

    cancelAnimationFrame(this.animationFrameId)
    this.isPaused = false
    this.callback = null
    this.lastTimestamp = 0
    this.time = 0

    document.removeEventListener('keypress', this.handleKeyPress)
    document.removeEventListener('pointerlockchange', this.handlePointerLockChange)
  }

  pause() {
    if (!this.isRunning || this.isPaused) return

    this.isPaused = true
  }

  unpause() {
    if (!this.isRunning || !this.isPaused) return

    this.isPaused = false
    this.lastTimestamp = performance.now()
    this.animationFrameId = requestAnimationFrame(this.loop)
  }

  /* EVENTS */

  handleKeyPress = event => {
    if (event.code === 'KeyP')
      if (this.isPaused) this.unpause()
      else this.pause()
  }

  handlePointerLockChange = () => {
    if (!this.isRunning)
      this.start(this.callback)
    else if (!document.pointerLockElement)
      this.pause()
    else
      this.unpause()
  }

  handleVisibilityChange = () => {
    if (document.visibilityState === 'hidden')
      this.pause()
    else
      this.unpause()
  }

  /* LOOP */

  loop = timestamp => {
    if (!this.isRunning) return
    if (this.isPaused) {
      this.lastTimestamp = timestamp
      requestAnimationFrame(this.loop)
      return
    }

    const deltaTime = timestamp - this.lastTimestamp
    this.lastTimestamp = timestamp
    this.time += deltaTime

    this.callback(deltaTime / 1000, this.time / 1000) // to seconds

    requestAnimationFrame(this.loop)
  }
}
