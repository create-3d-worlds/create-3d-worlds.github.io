export default class GameLoop {
  constructor(callback) {
    this.isRunning = false
    this.isPaused = false
    this.callback = callback
    this.lastTimestamp = 0
    this.time = 0
    this.animationFrameId = null

    document.addEventListener('pointerlockchange', this.handlePointerLockChange)
  }

  start() {
    if (this.isRunning) return

    this.isRunning = true
    this.isPaused = false
    this.lastTimestamp = performance.now()
    this.animationFrameId = requestAnimationFrame(this.loop.bind(this))

    document.addEventListener('keypress', this.handleKeyPress)
  }

  stop() {
    if (!this.isRunning) return

    cancelAnimationFrame(this.animationFrameId)
    this.isRunning = false
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
    this.animationFrameId = requestAnimationFrame(this.loop.bind(this))
  }

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

  loop(timestamp) {
    if (!this.isRunning) return

    if (this.isPaused) {
      this.lastTimestamp = timestamp
      this.animationFrameId = requestAnimationFrame(this.loop.bind(this))
      return
    }

    const deltaTime = timestamp - this.lastTimestamp
    this.lastTimestamp = timestamp
    this.time += deltaTime

    this.callback(deltaTime / 1000, this.time / 1000) // to seconds

    this.animationFrameId = requestAnimationFrame(this.loop.bind(this))
  }
}
