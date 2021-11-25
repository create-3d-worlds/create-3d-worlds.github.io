let keyPressed = false

const rotationAngle = 0.02
const maxRoll = Math.PI / 3
const displacement = 5
const minHeight = 15

export default function Avion(model) {

  model.traverse(child => child.castShadow = true) // eslint-disable-line no-return-assign
  model.scale.set(.15, .15, .15)
  model.position.y = 100

  model.normalizePlane = () => {
    if (keyPressed) return
    console.log(model.rotation)
    // const pitch = Math.abs(model.rotation.x)
    // if (model.rotation.x > 0) model.rotation.x -= pitch * 0.25
    // if (model.rotation.x < 0) model.rotation.x += pitch * 0.25
    // const roll = Math.abs(model.rotation.y)
    // if (model.rotation.y > 0) model.rotation.y -= roll * 0.25
    // if (model.rotation.y < 0) model.rotation.y += roll * 0.25
  }

  document.onkeydown = e => {
    keyPressed = true
    switch (e.code) {
      case 'KeyA':
        model.position.x -= displacement
        if (model.rotation.y > -maxRoll)
          model.rotation.y -= rotationAngle
        break
      case 'KeyD':
        model.position.x += displacement
        if (model.rotation.y < maxRoll)
          model.rotation.y += rotationAngle
        break
      case 'KeyW':
        model.rotation.x += rotationAngle * 0.25
        model.position.y += displacement * 0.5
        break
      case 'KeyS':
        model.rotation.x -= rotationAngle * 0.25
        if (model.position.y > minHeight)
          model.position.y -= displacement * 0.5
        break
    }
  }

  document.onkeyup = () => {
    keyPressed = false
  }

  return model
}
