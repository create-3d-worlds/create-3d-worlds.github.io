let keyPressed = false

const rotationAngle = 0.02
const maxRoll = Math.PI / 3
const displacement = 5
const minHeight = 50

export default function Avion(model) {

  model.normalizePlane = () => {
    if (keyPressed) return
    const pitch = Math.abs(model.rotation.z)
    const roll = Math.abs(model.rotation.y)
    if (model.rotation.z > 0) model.rotation.z -= pitch * 0.25
    if (model.rotation.z < 0) model.rotation.z += pitch * 0.25
    if (model.rotation.y > 0) model.rotation.y -= roll * 0.25
    if (model.rotation.y < 0) model.rotation.y += roll * 0.25
  }

  document.onkeydown = e => {
    keyPressed = true
    switch (e.code) {
      case 'KeyA':
        model.position.x += displacement
        if (model.rotation.y < maxRoll)
          model.rotation.y += rotationAngle
        break
      case 'KeyD':
        model.position.x -= displacement
        if (model.rotation.y > -maxRoll)
          model.rotation.y -= rotationAngle
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
