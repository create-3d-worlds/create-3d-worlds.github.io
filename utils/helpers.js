import * as THREE from '/node_modules/three108/build/three.module.js'
import { createGround } from '/utils/ground/index.js'

/* including min, not including max */
export function randomInRange(min, max, round = false) {
  const random = Math.random() * (max - min) + min
  return round ? Math.floor(random) : random
}

export function randomInCircle(radius, emptyCenter = 0) {
  const random = emptyCenter ? randomInRange(emptyCenter, 1) : Math.random()
  const r = Math.sqrt(random) * radius
  const angle = Math.random() * Math.PI * 2
  const x = Math.cos(angle) * r
  const z = Math.sin(angle) * r
  return { x, z }
}

const randomBool = () => Math.random() < 0.5

const randomInRangeExcluded = (min, max, minExclude, maxExclude, round = false) =>
  randomBool() ? randomInRange(min, minExclude, round) : randomInRange(maxExclude, max, round)

// export function randomInSquare(size) {
//   const x = randomInRange(-size * .5, size * .5)
//   const z = randomInRange(-size * .5, size * .5)
//   return { x, z }
// }

export function randomInSquare(size, emptyCenter = 0) {
  const x = randomInRange(-size * .5, size * .5)
  const z = x > -emptyCenter && x < emptyCenter
    ? randomInRangeExcluded(-size * .5, size * .5, -emptyCenter, emptyCenter)
    : randomInRange(-size * .5, size * .5)
  return randomBool() ? { x, z } : { x: z, z: x }
}

export const isCollide = (bounds1, bounds2) =>
  bounds1.xMin <= bounds2.xMax && bounds1.xMax >= bounds2.xMin &&
  bounds1.yMin <= bounds2.yMax && bounds1.yMax >= bounds2.yMin &&
  bounds1.zMin <= bounds2.zMax && bounds1.zMax >= bounds2.zMin

export function getHighPoint(geometry, face) {
  const v1 = geometry.vertices[face.a].y
  const v2 = geometry.vertices[face.b].y
  const v3 = geometry.vertices[face.c].y
  return Math.max(v1, v2, v3)
}

export function cameraFollowObject(camera, obj, { distance = 100, alpha = 0.05, y = 0 } = {}) {
  if (!obj) return
  const direction = new THREE.Vector3(0, 0, -1).applyQuaternion(obj.quaternion)
  const newPosition = obj.position.clone()
  newPosition.sub(direction.multiplyScalar(distance))
  // camera height
  newPosition.y = obj.position.y + y
  camera.position.lerp(newPosition, alpha)
  camera.lookAt(obj.position)
}

export const degToRad = deg => deg * Math.PI / 180

/* TEXTURES */

export const getTexture = ({ file, repeat = 16 } = {}) => {
  const texture = new THREE.TextureLoader().load(`/assets/textures/${file}`)
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.magFilter = THREE.NearestFilter
  texture.repeat.set(repeat, repeat)
  return texture
}

export const addTexture = (model, file = 'concrete.jpg') => {
  const texture = getTexture({ file, repeat: 16 })
  model.traverse(child => {
    if (child.isMesh) child.material.map = texture
  })
}

/* COLORS */

export const randomNuance = ({ h = .25, s = 0.5, l = 0.2 } = {}) =>
  new THREE.Color().setHSL(Math.random() * 0.1 + h, s, Math.random() * 0.25 + l)

export function randomGrey(min = 75, max = 150) {
  const v = (randomInRange(min, max) | 0).toString(16)
  return '#' + v + v + v
}

// colorful = 0 for gray nianses only
export function randomGrayish({ min = .3, max = .7, colorful = .02 } = {}) {
  const gray = randomInRange(min, max)
  const color = new THREE.Color(
    gray + randomInRange(-colorful, colorful),
    gray + randomInRange(-colorful, colorful),
    gray + randomInRange(-colorful, colorful)
  )
  return color
}

// param color in hex, return THREE.Color()
export function similarColor(color) {
  const factor = randomInRange(-0.25, 0.25)
  const hsl = {}
  const { h, s, l } = new THREE.Color(color).getHSL(hsl)
  const newCol = new THREE.Color().setHSL(h + h * factor, s, l + l * factor / 4)
  return newCol
}

/* ALIAS */

export function createFloor(params) {
  return createGround({ size: 1000, color: 0x808080, ...params })
}
