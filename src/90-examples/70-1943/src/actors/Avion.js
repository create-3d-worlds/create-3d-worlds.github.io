let keyPressed = false

const rotationAngle = 0.02
const maxRoll = Math.PI / 3
const displacement = 5
const minHeight = 50

export default function Avion(model) {

  model.normalizePlane = () => {
    if (keyPressed) return
    const roll = Math.abs(model.rotation.z)
    if (model.rotation.z > 0) model.rotation.z -= roll * 0.25
    if (model.rotation.z < 0) model.rotation.z += roll * 0.25
  }

  document.onkeydown = e => {
    keyPressed = true
    switch (e.code) {
      case 'KeyA':
        model.position.x += displacement
        if (model.rotation.z < maxRoll)
          model.rotation.z += rotationAngle
        break
      case 'KeyD':
        model.position.x -= displacement
        if (model.rotation.z > -maxRoll)
          model.rotation.z -= rotationAngle
        break
      case 'KeyW':
        if (model.position.y > minHeight) model.position.y -= displacement * 0.5
        break
      case 'KeyS':
        model.position.y += displacement * 0.5
        break
    }
  }

  document.onkeyup = () => {
    keyPressed = false
  }

  return model
}
