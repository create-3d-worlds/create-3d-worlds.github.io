import * as THREE from '/node_modules/three127/build/three.module.js'
import { randomInRange } from '/utils/helpers.js'

const textureLoader = new THREE.TextureLoader()

/* PARTICLES (IN BOX) */

export function createParticles({ num = 10000, file = 'star.png', color, size = .5, opacity = 1, unitAngle = 1, minRange = 100, maxRange = 1000, blending = THREE.AdditiveBlending } = {}) {

  const geometry = new THREE.BufferGeometry()
  const positions = []
  const colors = []
  const velocities = new Float32Array(num)

  for (let i = 0; i < num; i++) {
    const vertex = new THREE.Vector3(randomInRange(-unitAngle, unitAngle), randomInRange(-unitAngle, unitAngle), randomInRange(-unitAngle, unitAngle))

    const scalar = randomInRange(minRange, maxRange)
    vertex.multiplyScalar(scalar)
    const { x, y, z } = vertex
    positions.push(x, y, z)
    colors.push(x / scalar + 0.5, y / scalar + 0.5, z / scalar + 0.5)
  }

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
  geometry.setAttribute('velocity', new THREE.Float32BufferAttribute(velocities, 1))

  const material = new THREE.PointsMaterial({
    size,
    transparent: true,
    opacity,
  })
  if (file) {
    material.map = textureLoader.load(`/assets/particles/${file}`)
    material.blending = blending
    material.depthTest = false
  } else
    material.depthTest = true

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

/* HELPERS */

export function addVelocity({ particles, min = .5, max = 3 } = {}) {
  const velocities = particles.geometry.attributes.velocity.array
  for (let i = 0, l = velocities.length; i < l; i++)
    velocities[i] = randomInRange(min, max)
  particles.geometry.attributes.velocity.needsUpdate = true
}

export function updateRain({ particles, minY = -300, maxY = 300 } = {}) {
  const positions = particles.geometry.attributes.position.array
  const velocities = particles.geometry.attributes.velocity.array
  velocities.forEach((velocity, i) => {
    const yIndex = 3 * i + 1
    positions[yIndex] -= velocity
    if (positions[yIndex] < minY) positions[yIndex] = maxY
  })
  particles.geometry.attributes.position.needsUpdate = true
}

export function updateSnow({ particles, minY = -300, maxY = 300, rotateY = .003 } = {}) {
  updateRain({ particles, minY, maxY })
  particles.rotateY(rotateY)
}

/* ALIASES */

export const createRain = ({ file = 'raindrop.png' } = {}) =>
  createParticles({ file, num: 10000, size: .7, opacity: 0.8, minRange: 50, maxRange: 500, color: 0x9999ff, blending: THREE.NormalBlending })

export const createSnow = ({ file = 'snowflake.png' } = {}) => createParticles({ file, size: 5, color: 0xffffff })

export const createStars = ({ file = 'star.png', color } = {}) =>
  createParticles({ num: 10000, color, size: .5, file, minRange: 100, maxRange: 1000 })

/* STARS (IN SPHERE) */

export function createSimpleStars({ num = 10000, r = 1000, size = 3 } = {}) {
  const geometry = new THREE.BufferGeometry()
  const positions = []
  for (let i = 0; i < num; i++) {
    const lat = randomInRange(-Math.PI / 2, Math.PI / 2)
    const lon = 2 * Math.PI * Math.random()
    const x = r * Math.cos(lon) * Math.cos(lat)
    const y = r * Math.sin(lon) * Math.cos(lat)
    const z = r * Math.sin(lat)
    positions.push(x, y, z)
  }
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  const material = new THREE.PointsMaterial({
    size,
  })
  return new THREE.Points(geometry, material)
}
