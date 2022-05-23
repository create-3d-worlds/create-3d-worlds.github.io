import * as THREE from '/node_modules/three119/build/three.module.js'
import { randomInRange } from '/utils/helpers.js'

const textureLoader = new THREE.TextureLoader()

/* STARS (IN CUBE) */

export function createParticles({ num = 10000, file = 'star.png', color, size = .5, opacity = 1, unitAngle = 1, minRange = 100, maxRange = 1000, depthTest = true } = {}) {

  const geometry = new THREE.BufferGeometry()
  const positions = []
  const colors = []

  for (let i = 0; i < num; i++) {
    const vertex = new THREE.Vector3(randomInRange(-unitAngle, unitAngle), randomInRange(-unitAngle, unitAngle), randomInRange(-unitAngle, unitAngle))

    const scalar = randomInRange(minRange, maxRange)
    vertex.multiplyScalar(scalar)
    const { x, y, z } = vertex
    positions.push(x, y, z)

    colors.push((x / scalar) + 0.5)
    colors.push((y / scalar) + 0.5)
    colors.push((z / scalar) + 0.5)
  }

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))

  const material = new THREE.PointsMaterial({
    size,
    transparent: true,
    opacity,
    depthTest,
  })
  if (file) {
    material.map = textureLoader.load(`/assets/particles/${file}`)
    material.blending = THREE.AdditiveBlending
  }
  if (color)
    material.color = new THREE.Color(color)
  else
    material.vertexColors = THREE.VertexColors

  return new THREE.Points(geometry, material)
}

export function expandParticles({ particles, scalar } = {}) {
  const { array } = particles.geometry.attributes.position
  for (let i = 0, l = array.length; i < l; i += 3) {
    const vertex = new THREE.Vector3(array[i], array[i + 1], array[i + 2])
    vertex.multiplyScalar(scalar)
    array[i] = vertex.x
    array[i + 1] = vertex.y
    array[i + 2] = vertex.z
  }
  particles.geometry.attributes.position.needsUpdate = true
}

export function resetParticles({ particles, pos = [0, 0, 0], unitAngle = 1 } = {}) {
  particles.position.set(...pos)
  const { array } = particles.geometry.attributes.position
  for (let i = 0, l = array.length; i < l; i++)
    array[i] = randomInRange(-unitAngle, unitAngle)

  particles.geometry.attributes.position.needsUpdate = true
}

/* STARS (IN SPHERE) */

export function createSimpleStars({ num = 10000, r = 1000, size = 3 } = {}) {
  const geometry = new THREE.Geometry()
  for (let i = 0; i < num; i++) {
    const lat = randomInRange(-Math.PI / 2, Math.PI / 2)
    const lon = 2 * Math.PI * Math.random()
    geometry.vertices.push({
      x: r * Math.cos(lon) * Math.cos(lat),
      y: r * Math.sin(lon) * Math.cos(lat),
      z: r * Math.sin(lat)
    })
  }
  const material = new THREE.PointsMaterial({
    size,
  })
  return new THREE.Points(geometry, material)
}

/* HELPERS */

// TODO: update each particle with own velocity?
export function addVelocity({ particles, min = .5, max = 3 } = {}) {
  // particles.geometry.vertices.forEach(vertex => {
  //   vertex.velocity = randomInRange(min, max)
  // })
}

export function updateRain({ particles, minY = -300, maxY = 300, velocity = .3 } = {}) {
  const { array } = particles.geometry.attributes.position
  for (let i = 1, l = array.length; i < l; i += 3) {
    array[i] -= velocity
    if (array[i] < minY) array[i] = maxY
  }
  particles.geometry.attributes.position.needsUpdate = true
}

export function updateSnow({ particles, minY = -300, maxY = 300, rotateY = .003, velocity = .5 } = {}) {
  updateRain({ particles, minY, maxY, velocity })
  particles.rotateY(rotateY)
}

/* ALIASES */

export const createRain = ({ file = 'raindrop.png' } = {}) =>
  createParticles({ file, num: 10000, size: .7, opacity: 0.8, minRange: 50, maxRange: 500, color: 0x9999ff })

export const createSnow = ({ file = 'snowflake.png' } = {}) => createParticles({ file, size: 5, color: 0xffffff, depthTest: false })

export const createStars = ({ file = 'star.png', color } = {}) =>
  createParticles({ num: 10000, color, size: .5, file, minRange: 100, maxRange: 1000, depthTest: true })