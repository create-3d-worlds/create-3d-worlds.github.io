import * as THREE from '/node_modules/three108/build/three.module.js'
import { randomInRange } from '/utils/helpers.js'

const spaceColors = [0xF0F8FF, 0xFAEBD7, 0xF0FFFF, 0xF5F5DC, 0xF8F8FF, 0xE0FFFF, 0xFFE4E1, 0xFFFFFF, 0xF5F5F5, 0x00FFFF, 0xDC143C, 0xB22222, 0xADD8E6, 0x4169E1, 0x32CD32]

const randomColor = () => spaceColors[Math.floor(Math.random() * spaceColors.length)]

/* UNIVERSE */

export function createParticles({ num = 10000, color, size = .5, unitAngle = 1, file = 'star.png', minRange = 100, maxRange = 1000 } = {}) {

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
  })
  if (file) {
    material.map = new THREE.TextureLoader().load(`/assets/textures/${file}`)
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

/* STARS IN SPHERE */

export function createStars({ num = 10000, r = 1000 } = {}) {
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
    size: 3,
  })
  return new THREE.Points(geometry, material)
}