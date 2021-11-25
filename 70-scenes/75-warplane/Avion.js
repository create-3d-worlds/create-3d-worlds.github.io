let keyPressed = false

const rotationAngle = 0.02
const maxRoll = Math.PI / 3
const displacement = 5
const minHeight = 50

export default function Avion(model) {

  model.traverse(child => child.castShadow = true) // eslint-disable-line no-return-assign
  model.scale.set(.15, .15, .15)
  model.position.y = 100

  model.normalizePlane = () => {
    if (keyPressed) return
    const pitch = Math.abs(model.rotation.z)
    const roll = Math.abs(model.rotation.y)
    // if (model.rotation.z > 0) model.rotation.z -= pitch * 0.25
    // if (model.rotation.z < 0) model.rotation.z += pitch * 0.25
    if (model.rotation.y > 0) model.rotation.y -= roll * 0.25
    if (model.rotation.y < 0) model.rotation.y += roll * 0.25
  }

  document.onkeydown = e => {
    keyPressed = true
    switch (e.keyCode) {
      case 65:  // a
        model.position.x += displacement
        if(model.rotation.y < maxRoll)
          model.rotation.y += rotationAngle
        break
      case 68:  // d
        model.position.x -= displacement
        if (model.rotation.y > -maxRoll)
          model.rotation.y -= rotationAngle
        break
      case 87:  // w
        if (model.position.y > minHeight) model.position.y -= displacement * 0.5
        break
      case 83:  // s
        model.position.y += displacement * 0.5
        break
    }
  }

  document.onkeyup = () => {
    keyPressed = false
  }

  return model
}
