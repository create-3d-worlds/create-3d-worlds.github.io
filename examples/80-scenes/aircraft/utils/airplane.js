import input from '/utils/classes/Input.js'

const speed = 100
const rotationSpeed = .5

const minHeight = 50
const maxRoll = Math.PI / 3

export function updatePlane(model, delta) {
  if (input.left) {
    model.position.x += speed * delta
    if (model.rotation.z > -maxRoll) model.rotation.z -= rotationSpeed * delta
  }
  if (input.right) {
    model.position.x -= speed * delta
    if (model.rotation.z < maxRoll) model.rotation.z += rotationSpeed * delta

  }
  if (input.up)
    model.position.y += speed * 0.5 * delta

  if (input.down)
    if (model.position.y > minHeight) model.position.y -= speed * 0.5 * delta
}

export function normalizePlane(model, delta) {
  if (input.keyPressed) return
  const roll = Math.abs(model.rotation.z)
  if (model.rotation.z > 0) model.rotation.z -= roll * delta * 2
  if (model.rotation.z < 0) model.rotation.z += roll * delta * 2
}
