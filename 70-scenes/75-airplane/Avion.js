import keyboard from '/classes/Keyboard.js'

const rotationAngle = 0.02
const maxRoll = Math.PI / 3
const displacement = 5
const minHeight = 15

export default function Avion(model) {

  model.normalizePlane = () => {
    if (keyboard.keyPressed) return
    // const pitch = Math.abs(model.rotation.x)
    // if (model.rotation.x > 0) model.rotation.x -= pitch * 0.25
    // if (model.rotation.x < 0) model.rotation.x += pitch * 0.25
    // const roll = Math.abs(model.rotation.y)
    // if (model.rotation.y > 0) model.rotation.y -= roll * 0.25
    // if (model.rotation.y < 0) model.rotation.y += roll * 0.25
  }

  model.update = () => {
    if (keyboard.left) {
      model.position.x -= displacement
      if (model.rotation.y > -maxRoll)
        model.rotation.y -= rotationAngle
    }

    if (keyboard.right) {
      model.position.x += displacement
      if (model.rotation.y < maxRoll)
        model.rotation.y += rotationAngle
    }

    if (keyboard.up) {
      model.rotation.x += rotationAngle * 0.25
      model.position.y += displacement * 0.5
    }

    if (keyboard.down) {
      model.rotation.x -= rotationAngle * 0.25
      if (model.position.y > minHeight)
        model.position.y -= displacement * 0.5
    }
  }

  return model
}
