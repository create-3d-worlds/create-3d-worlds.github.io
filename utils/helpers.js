import * as THREE from '/node_modules/three127/build/three.module.js'
import { scene as defaultScene, camera as defaultCamera } from '/utils/scene.js'

/* MATH */

/*
 * Get random float between two values, < max
*/
export function randomInRange(min, max, int = false) {
  const random = Math.random() * (max - min) + min
  return int ? Math.floor(random) : random
}

/* Get random int between two values, < max */
export const randomInt = (min, max) => randomInRange(min, max, true)

/* Get random int between two values, <= max (max inclusive) */
export const roll = (max, min = 0) => Math.floor(Math.random() * (max - min + 1) + min)

/* return 2D vector { x, z } */
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
  const halfSize = size * .5
  const x = randomInRange(-halfSize, halfSize)
  const z = x > -emptyCenter && x < emptyCenter
    ? randomInRangeExcluded(-halfSize, halfSize, -emptyCenter, emptyCenter)
    : randomInRange(-halfSize, halfSize)
  return randomBool() ? { x, z } : { x: z, z: x }
}

export const degToRad = degrees => degrees * Math.PI / 180

/* returns 2D normalized device coordinates of the mouse, between -1 and 1. */
export function normalizeMouse(e) {
  const x = (e.clientX / window.innerWidth) * 2 - 1
  const y = -(e.clientY / window.innerHeight) * 2 + 1
  return { x, y }
}

/* returns mouse 3D vector in world coordinates */
export const mouseToWorld = (e, camera = defaultCamera, z = .9) => {
  const { x, y } = normalizeMouse(e)
  const mouse3D = new THREE.Vector3(x, y, z) // initially .5
  mouse3D.unproject(camera)
  return mouse3D
}

/* OBJECTS */

export const isCollide = (bounds1, bounds2) =>
  bounds1.xMin <= bounds2.xMax && bounds1.xMax >= bounds2.xMin &&
  bounds1.yMin <= bounds2.yMax && bounds1.yMax >= bounds2.yMin &&
  bounds1.zMin <= bounds2.zMax && bounds1.zMax >= bounds2.zMin

// @param key: x, y or z
export const getSize = (mesh, key) => {
  const box = new THREE.Box3().setFromObject(mesh)
  return box.max[key] - box.min[key]
}

export const getHeight = mesh => getSize(mesh, 'y')

export function cameraFollowObject(camera, obj, { distance = 50, alpha = 0.06, y = 0 } = {}) {
  if (!obj) return
  const direction = new THREE.Vector3(0, 0, -1).applyQuaternion(obj.quaternion)
  const newPosition = obj.position.clone()
  newPosition.sub(direction.multiplyScalar(distance))
  // camera height
  newPosition.y = obj.position.y + y
  camera.position.lerp(newPosition, alpha)
  camera.lookAt(obj.position)
}

// https://stackoverflow.com/questions/28848863/, geometry.center() not working for groups
export const centerObject = mesh => {
  const box = new THREE.Box3().setFromObject(mesh)
  box.getCenter(mesh.position) // re-sets mesh position
  mesh.position.multiplyScalar(-1)
}

export const adjustHeight = mesh => {
  mesh.translateY(getHeight(mesh) / 2)
}

/* RAYCAST */

export const directionBlocked = (mesh, solids, vector) => {
  if (!mesh || !solids.length || !vector) return false
  const vec = vector.clone() // because applyQuaternion is mutable
  const direction = vec.applyQuaternion(mesh.quaternion)
  const bodyCenter = mesh.position.clone()
  const height = getHeight(mesh)
  bodyCenter.y += height
  const raycaster = new THREE.Raycaster(bodyCenter, direction, 0, height)
  const intersections = raycaster.intersectObjects(solids, true)
  return intersections.length > 0
}

export function getMouseIntersects(e, camera = defaultCamera, scene = defaultScene) {
  const mouse3D = new THREE.Vector3(
    e.clientX / window.innerWidth * 2 - 1,
    -e.clientY / window.innerHeight * 2 + 1,
    0
  )
  const raycaster = new THREE.Raycaster()
  raycaster.setFromCamera(mouse3D, camera)
  const intersects = raycaster.intersectObjects(scene.children)
  return intersects
}

/* TEXTURES */

export const getTexture = ({ file, repeat = 16 } = {}) => {
  const texture = new THREE.TextureLoader().load(`/assets/textures/${file}`)
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.magFilter = THREE.NearestFilter
  texture.repeat.set(repeat, repeat)
  return texture
}

export const addTexture = ({ mesh, file = 'concrete.jpg', repeat = 1 } = {}) => {
  const texture = getTexture({ file, repeat })
  mesh.traverse(child => {
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

// @param color hex, return THREE.Color()
export function similarColor(color, range = .25) {
  const factor = randomInRange(-range, range)
  const hsl = {}
  const { h, s, l } = new THREE.Color(color).getHSL(hsl)
  const newCol = new THREE.Color().setHSL(h + h * factor, s, l + l * factor / 4)
  return newCol
}

export function checkIntersect(terrain, position) {
  const raycaster = new THREE.Raycaster()
  const direction = new THREE.Vector3(0, -1, 0)
  raycaster.set(position, direction)
  const intersects = raycaster.intersectObject(terrain)
  return intersects.length
    ? intersects[0].point
    : position
}

export function putOnTerrain({ terrain, size, totalTry, callBack }) {
  const halfSize = size / 2
  for (let i = 0; i < totalTry; i++) {
    const pos = new THREE.Vector3(randomInt(-halfSize, halfSize), 200, randomInt(-halfSize, halfSize))
    const intersect = checkIntersect(terrain, pos)
    if (intersect && intersect.y > 0) callBack(intersect)
  }
}