export function askPointerLock(controls) {
  const pointerlockchange = () => {
    if (document.pointerLockElement === document.body) {
      controls.enabled = true
    } else {
      controls.enabled = false
      instructions.style.display = ''
    }
  }

  document.addEventListener('pointerlockchange', pointerlockchange)

  instructions.addEventListener('click', event => {
    instructions.style.display = 'none'
    document.body.requestPointerLock() // Ask the browser to lock the pointer
  })
}