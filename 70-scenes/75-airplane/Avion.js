import keyboard from '/classes/Keyboard.js'

const rotationAngle = 0.02
const maxRoll = Math.PI / 3
const displacement = 5
const minHeight = 15

export default function Avion(mesh) {

  mesh.normalizePlane = () => {
    if (keyboard.keyPressed) return
    // const pitch = Math.abs(mesh.rotation.x)
    // if (mesh.rotation.x > 0) mesh.rotation.x -= pitch * 0.25
    // if (mesh.rotation.x < 0) mesh.rotation.x += pitch * 0.25
    // const roll = Math.abs(mesh.rotation.y)
    // if (mesh.rotation.y > 0) mesh.rotation.y -= roll * 0.25
    // if (mesh.rotation.y < 0) mesh.rotation.y += roll * 0.25
  }

  mesh.update = () => {
    if (keyboard.left) {
      mesh.position.x -= displacement
      if (mesh.rotation.y > -maxRoll)
        mesh.rotation.y -= rotationAngle
    }

    if (keyboard.right) {
      mesh.position.x += displacement
      if (mesh.rotation.y < maxRoll)
        mesh.rotation.y += rotationAngle
    }

    if (keyboard.up) {
      mesh.rotation.x += rotationAngle * 0.25
      mesh.position.y += displacement * 0.5
    }

    if (keyboard.down) {
      mesh.rotation.x -= rotationAngle * 0.25
      if (mesh.position.y > minHeight)
        mesh.position.y -= displacement * 0.5
    }
  }

  return mesh
}
