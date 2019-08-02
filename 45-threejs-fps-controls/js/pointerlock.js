export function askPointerLock(controls) {
  const blocker = document.getElementById('blocker')
  const instructions = document.getElementById('instructions')

  const element = document.body
  const pointerlockchange = function() {
    if (document.pointerLockElement === element) {
      controls.enabled = true
      blocker.style.display = 'none'
    } else {
      controls.enabled = false
      blocker.style.display = '-webkit-box'
      blocker.style.display = '-moz-box'
      blocker.style.display = 'box'
      instructions.style.display = ''
    }
  }

  const pointerlockerror = () => {
    instructions.style.display = ''
  }

  document.addEventListener('pointerlockchange', pointerlockchange)
  document.addEventListener('pointerlockerror', pointerlockerror)

  instructions.addEventListener('click', () => {
    instructions.style.display = 'none'
    element.requestPointerLock() // ask browser to lock the pointer
  })
}
