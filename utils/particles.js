import * as THREE from '/node_modules/three119/build/three.module.js'
import { randomInRange } from '/utils/helpers.js'

const spaceColors = [0xF0F8FF, 0xFAEBD7, 0xF0FFFF, 0xF5F5DC, 0xF8F8FF, 0xE0FFFF, 0xFFE4E1, 0xFFFFFF, 0xF5F5F5, 0x00FFFF, 0xDC143C, 0xB22222, 0xADD8E6, 0x4169E1, 0x32CD32]

const randomColor = () => spaceColors[Math.floor(Math.random() * spaceColors.length)]

const textureLoader = new THREE.TextureLoader()

/* STARS (IN CUBE) */

export function createParticles({ num = 10000, color, size = .5, opacity = 1, unitAngle = 1, file = 'star.png', minRange = 100, maxRange = 1000, depthTest = true } = {}) {

  const geometry = new THREE.Geometry()
  for (let i = 0; i < num; i++) {
    const vertex = new THREE.Vector3()
    vertex.x = randomInRange(-unitAngle, unitAngle)
    vertex.y = randomInRange(-unitAngle, unitAngle)
    vertex.z = randomInRange(-unitAngle, unitAngle)
    const scalar = randomInRange(minRange, maxRange)
    vertex.multiplyScalar(scalar)
    geometry.vertices.push(vertex)
    if (!color) geometry.colors.push(new THREE.Color(randomColor()))
  }
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

export function addVelocity({ particles, min = .5, max = 3 } = {}) {
  particles.geometry.vertices.forEach(vertex => {
    vertex.velocity = randomInRange(min, max)
  })
}

export function updateRain({ particles, minY = -300, maxY = 300 } = {}) {
  particles.geometry.vertices.forEach(vertex => {
    vertex.y -= vertex.velocity
    if (vertex.y < minY) vertex.y = maxY
  })
  particles.geometry.verticesNeedUpdate = true
}

export function updateSnow({ particles, minY = -300, maxY = 300, rotateY = .003 } = {}) {
  updateRain({ particles, minY, maxY })
  particles.rotateY(rotateY)
}

/* ALIASES */

export const createRain = ({ file = 'raindrop.png' } = {}) =>
  createParticles({ file, num: 10000, size: .7, opacity: 0.8, minRange: 50, maxRange: 500, color: 0x9999ff })

export const createSnow = ({ file = 'snowflake.png' } = {}) => createParticles({ file, size: 5, color: 0xffffff, depthTest: false })

export const createStars = ({ file = 'star.png', color } = {}) =>
  createParticles({ num: 10000, color, size: .5, file, minRange: 100, maxRange: 1000, depthTest: true })