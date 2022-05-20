import * as THREE from '/node_modules/three108/build/three.module.js'
import { randomInRange } from '/utils/helpers.js'

const spaceColors = [0xF0F8FF, 0xFAEBD7, 0xF0FFFF, 0xF5F5DC, 0xF8F8FF, 0xE0FFFF, 0xFFE4E1, 0xFFFFFF, 0xF5F5F5, 0x00FFFF, 0xDC143C, 0xB22222, 0xADD8E6, 0x4169E1, 0x32CD32]

const randomColor = () => spaceColors[Math.floor(Math.random() * spaceColors.length)]

export function createParticles({ num = 100, color, size = .5, unitAngle = 1, file } = {}) {
  const geometry = new THREE.Geometry()
  for (let i = 0; i < num; i++) {
    const vertex = new THREE.Vector3()
    geometry.vertices.push(vertex)
    vertex.x = randomInRange(-unitAngle, unitAngle)
    vertex.y = randomInRange(-unitAngle, unitAngle)
    vertex.z = randomInRange(-unitAngle, unitAngle)
    if (!color) geometry.colors.push(new THREE.Color(randomColor()))
  }
  const material = new THREE.PointsMaterial({
    size,
    transparent: true,
  })
  if (file)
    material.map = new THREE.TextureLoader().load(`/assets/textures/${file}`)

  if (color)
    material.color = new THREE.Color(color)
  else
    material.vertexColors = THREE.VertexColors

  return new THREE.Points(geometry, material)
}

export function expandParticles({ particles, scalar, min = 0, max = 1000 } = {}) {
  scalar = scalar ? scalar : randomInRange(min, max) // eslint-disable-line no-param-reassign
  particles.geometry.vertices.forEach(vertex => {
    vertex.multiplyScalar(scalar)
  })
  particles.geometry.verticesNeedUpdate = true
}

export function resetParticles({ particles, pos = [0, 0, 0], unitAngle = 1 } = {}) {
  particles.position.set(...pos)
  particles.geometry.vertices.forEach(vertex => {
    vertex.x = randomInRange(-unitAngle, unitAngle)
    vertex.y = randomInRange(-unitAngle, unitAngle)
    vertex.z = randomInRange(-unitAngle, unitAngle)
  })
}
