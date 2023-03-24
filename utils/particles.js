import * as THREE from 'three'
import { similarColor } from '/utils/helpers.js'

const { randFloat } = THREE.MathUtils

const textureLoader = new THREE.TextureLoader()

/* STARS (SPHERE) */

export function createStarSphere({ num = 5000, r = 500, size = 10, file = 'star.png' } = {}) {
  const geometry = new THREE.BufferGeometry()
  const positions = []
  const colors = []

  for (let i = 0; i < num; i++) {
    const lat = randFloat(-Math.PI / 2, Math.PI / 2)
    const lon = 2 * Math.PI * Math.random()
    const x = r * Math.cos(lon) * Math.cos(lat)
    const y = r * Math.sin(lon) * Math.cos(lat)
    const z = r * Math.sin(lat)

    positions.push(x, y, z)
    const color = similarColor(0xf2c5f3)
    colors.push(color.r, color.g, color.b)
  }

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))

  const material = new THREE.PointsMaterial({
    size,
    vertexColors: true,
  })
  if (file) {
    material.map = textureLoader.load(`/assets/textures/particles/${file}`)
    material.blending = THREE.AdditiveBlending
  }
  return new THREE.Points(geometry, material)
}
