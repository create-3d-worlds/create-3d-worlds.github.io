import input from '/utils/io/Input.js'

const speed = 100
const rotationSpeed = .5

const minHeight = 50
const maxRoll = Math.PI / 3

export function updatePlane(mesh, delta) {
  if (input.left) {
    mesh.position.x += speed * delta
    if (mesh.rotation.z > -maxRoll) mesh.rotation.z -= rotationSpeed * delta
  }
  if (input.right) {
    mesh.position.x -= speed * delta
    if (mesh.rotation.z < maxRoll) mesh.rotation.z += rotationSpeed * delta

  }
  if (input.up)
    mesh.position.y += speed * 0.5 * delta

  if (input.down)
    if (mesh.position.y > minHeight) mesh.position.y -= speed * 0.5 * delta
}

export function normalizePlane(mesh, delta) {
  if (input.keyPressed) return
  const roll = Math.abs(mesh.rotation.z)
  if (mesh.rotation.z > 0) mesh.rotation.z -= roll * delta * 2
  if (mesh.rotation.z < 0) mesh.rotation.z += roll * delta * 2
}
