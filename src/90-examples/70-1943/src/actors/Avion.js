let keyPressed = false

const rotationAngle = 0.02
const maxRoll = Math.PI / 3
const displacement = 5
const minHeight = 50

export default function Avion(model) {

  const avion = model
  avion.traverse(child => child.castShadow = true)
  avion.scale.set(.25, .25, .25)
  avion.position.y = 100

  avion.normalizePlane = () => {
    if (keyPressed) return
    const pitch = Math.abs(avion.rotation.z)
    const roll = Math.abs(avion.rotation.y)
    if (avion.rotation.z > 0) avion.rotation.z -= pitch * 0.25
    if (avion.rotation.z < 0) avion.rotation.z += pitch * 0.25
    if (avion.rotation.y > 0) avion.rotation.y -= roll * 0.25
    if (avion.rotation.y < 0) avion.rotation.y += roll * 0.25
  }

  document.onkeydown = e => {
    keyPressed = true
    switch (e.keyCode) {
    case 65:  // a
      avion.position.x += displacement
      if(avion.rotation.y < maxRoll)
        avion.rotation.y += rotationAngle
      break
    case 68:  // d
      avion.position.x -= displacement
      if (avion.rotation.y > -maxRoll)
        avion.rotation.y -= rotationAngle
      break
    case 87:  // w
      if (avion.position.y > minHeight) avion.position.y -= displacement * 0.5
      break
    case 83:  // s
      avion.position.y += displacement * 0.5
      break
    }
  }

  document.onkeyup = () => keyPressed = false

  return avion
}
