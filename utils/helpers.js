import * as THREE from 'three'
import { scene as defaultScene, camera as defaultCamera } from '/utils/scene.js'
import { dir } from '/utils/constants.js'
import { TWEEN } from '/node_modules/three/examples/jsm/libs/tween.module.min.js'

const { randFloat, randFloatSpread } = THREE.MathUtils
const raycaster = new THREE.Raycaster()

/* MATH */

export const mapRange = (number, inMin, inMax, outMin, outMax) =>
  (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin

export function randomInCircle(radius, emptyCenter = 0) {
  const random = emptyCenter ? randFloat(emptyCenter, 1) : Math.random()
  const r = Math.sqrt(random) * radius
  const angle = Math.random() * Math.PI * 2
  const x = Math.cos(angle) * r
  const z = Math.sin(angle) * r
  return { x, z }
}

const randomBool = () => Math.random() < 0.5

const randomInRangeExcluded = (min, max, minExclude, maxExclude) =>
  randomBool() ? randFloat(min, minExclude) : randFloat(maxExclude, max)

export function randomInSquare(size, emptyCenter = 0) {
  const halfSize = size * .5
  const x = randFloatSpread(size)
  const z = x > -emptyCenter && x < emptyCenter
    ? randomInRangeExcluded(-halfSize, halfSize, -emptyCenter, emptyCenter)
    : randFloatSpread(size)
  return randomBool() ? { x, y: 0, z } : { x: z, y: 0, z: x }
}

/*
  @return shuffled coordinates for given mapSize
*/
export function getAllCoords({
  mapSize = 400, fieldSize = 20, offSet = fieldSize * .5, emptyCenter = 0
} = {}) {
  const halfSize = mapSize * .5
  const coords = []
  for (let x = -halfSize; x < halfSize; x += fieldSize)
    for (let z = -halfSize; z < halfSize; z += fieldSize)
      if ((x <= -emptyCenter || x >= emptyCenter || z <= -emptyCenter || z >= emptyCenter)) {
        const xOffset = randFloatSpread(offSet), zOffset = randFloatSpread(offSet)
        coords.push({ x: x + xOffset, y: 0, z: z + zOffset })
      }

  shuffle(coords)
  return coords
}

export const maxItems = (mapSize, fieldSize) => Math.pow(mapSize / fieldSize, 2)

/* MOUSE / CURSOR */

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

export const getCursorPosition = e => {
  const clientX = e.targetTouches ? e.targetTouches[0].pageX : e.clientX
  const clientY = e.targetTouches ? e.targetTouches[0].pageY : e.clientY
  return { x: clientX, y: clientY }
}

/* MESHES */

export const getMesh = obj => {
  if (obj.type == 'Mesh') return obj
  let mesh = obj
  obj.traverse(child => {
    if (child.type == 'Mesh') mesh = child
    return
  })
  return mesh
}

export const isCollide = (bounds1, bounds2) =>
  bounds1.xMin <= bounds2.xMax && bounds1.xMax >= bounds2.xMin &&
  bounds1.yMin <= bounds2.yMax && bounds1.yMax >= bounds2.yMin &&
  bounds1.zMin <= bounds2.zMax && bounds1.zMax >= bounds2.zMin

/* @param key: x, y or z (represents width, height and depth) */
export const getSize = (mesh, key) => {
  const box = new THREE.Box3().setFromObject(mesh)

  return key
    ? box.max[key] - box.min[key]
    : {
      x: box.max.x - box.min.x,
      y: box.max.y - box.min.y,
      z: box.max.z - box.min.z,
    }
}

export const getHeight = mesh => getSize(mesh, 'y')

// geometry.center() not working for groups stackoverflow.com/questions/28848863
export const centerMesh = mesh => {
  const box = new THREE.Box3().setFromObject(mesh)
  box.getCenter(mesh.position) // re-sets mesh position
  mesh.position.multiplyScalar(-1)
}

// different from geometry.center(), not adjusting height
export const centerGeometry = geometry => {
  const _offset = new THREE.Vector3()
  geometry.computeBoundingBox()
  geometry.boundingBox.getCenter(_offset).negate()
  geometry.translate(_offset.x, 0, _offset.z)
}

export const adjustHeight = mesh => mesh.translateY(getHeight(mesh) / 2)

/**
   * Add solid objects for player to collide
   * @param {array} oldSolids pass by reference
   * @param {array or mesh} newSolids
   */
export const addSolids = (oldSolids, ...newSolids) => {
  const pushUnique = obj => {
    if (!oldSolids.includes(obj)) oldSolids.push(obj)
  }
  newSolids.forEach(solid => {
    if (Array.isArray(solid)) solid.forEach(pushUnique)
    else pushUnique(solid)
  })
}

export const getScene = object => {
  if (object.parent.type === 'Scene') return object.parent
  return getScene(object.parent)
}

export const getParent = (object, name) => {
  if (object.name === name) return object
  return getParent(object.parent, name)
}

export const belongsTo = (object, name) => {
  if (!object) return false
  if (object.name === name) return true
  return belongsTo(object.parent, name)
}

export const findChild = (parent, name) => {
  let found = null
  parent.traverse(child => {
    if (child.name === name) found = child
  })
  return found
}

/* COLORS */

export const randomColor = () => new THREE.Color(Math.random() * 0xffffff)

export function randomGray(min = 175, max = 250) { // range 0-255
  const v = (randFloat(min, max) | 0).toString(16)
  return '#' + v + v + v
}

// colorful = 0 for gray nianses only
export function randomGrayish({ min = .3, max = .7, colorful = .02 } = {}) {
  const gray = randFloat(min, max)
  const color = new THREE.Color(
    gray + (colorful ? randFloat(-colorful, colorful) : 0),
    gray + (colorful ? randFloat(-colorful, colorful) : 0),
    gray + (colorful ? randFloat(-colorful, colorful) : 0)
  )
  return color
}

// @param color hex, return THREE.Color()
export function similarColor(color, range = .25) {
  const factor = randFloat(-range, range)
  const hsl = {}
  const { h, s, l } = new THREE.Color(color).getHSL(hsl)
  const newCol = new THREE.Color().setHSL(h + h * factor, s, l + l * factor / 4)
  return newCol
}

/* RAYCAST */

export const getIntersects = (raycaster, target = defaultScene) => (
  Array.isArray(target)
    ? raycaster.intersectObjects(target)
    : raycaster.intersectObject(target)
).filter(x => x.object.type != 'Points') // ignore particles

const distanceTo = ({ pos, solids }, direction) => {
  if (!pos || !solids.length) return Infinity
  raycaster.set(pos, direction)
  const intersects = getIntersects(raycaster, solids)

  const point = intersects[0]?.point
  return point ? pos.distanceTo(point) : Infinity
}

export const distanceFront = ({ mesh, solids }) => {
  const direction = dir.forward.applyQuaternion(mesh.quaternion)
  return distanceTo({ pos: mesh.position, solids }, direction)
}

export const distanceDown = ({ pos, solids }) => distanceTo({ pos, solids }, dir.down)

export function findGround({ solids, pos, y = 200 }) {
  const origin = { x: pos.x, y: pos.y + y, z: pos.z }
  raycaster.set(origin, dir.down)
  const intersects = getIntersects(raycaster, solids)
  return intersects?.[0]
}

export const getGroundY = ({ solids, pos, y }) => findGround({ solids, pos, y })?.point?.y || 0

export const putOnGround = (mesh, solids, adjustment = 0) => {
  mesh.position.y = getGroundY({ solids, pos: mesh.position }) + adjustment
}

// TODO: use coords, remove recursive
export const findGroundRecursive = (terrain, size, counter = 0) => {
  const coord = randomInSquare(size)
  const intersect = findGround({ solids: terrain, pos: coord, y: 200 })
  if (intersect?.point?.y > 0) return intersect.point
  if (counter > 5) return null
  return findGroundRecursive(terrain, size, counter + 1)
}

export const raycast = (mesh, solids, dir, height, rayLength) => {
  const direction = dir.clone().applyQuaternion(mesh.quaternion)
  const bodyCenter = mesh.position.clone()
  bodyCenter.y += height * .5
  const raycaster = new THREE.Raycaster(bodyCenter, direction, 0, rayLength)
  return getIntersects(raycaster, solids)
}

export const directionBlocked = (mesh, solids, currDir) => {
  if (!mesh || !solids.length || !currDir) return false
  const { y, z } = getSize(mesh)
  const rayLength = currDir == dir.forward ? z : y
  const intersects = raycast(mesh, solids, currDir, y, rayLength)
  return intersects.length > 0
}

export function getMouseIntersects(e, camera = defaultCamera, target = defaultScene) {
  const mouse = normalizeMouse(e)
  raycaster.setFromCamera(mouse, camera)
  return getIntersects(raycaster, target)
}

export function getCameraIntersects(camera, target) {
  raycaster.set(camera.getWorldPosition(new THREE.Vector3()), camera.getWorldDirection(new THREE.Vector3()))
  return getIntersects(raycaster, target)
}

/* TEXTURES */

export const getTexture = ({ file, repeat = 1 } = {}) => {
  const texture = new THREE.TextureLoader().load(`/assets/textures/${file}`)
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.magFilter = THREE.NearestFilter
  // texture.minFilter = THREE.LinearMipMapLinearFilter
  texture.repeat.set(repeat, repeat)
  return texture
}

export const addTexture = ({ mesh, file = 'terrain/concrete.jpg', repeat = 1 } = {}) => {
  const texture = getTexture({ file, repeat })
  mesh.traverse(child => {
    if (child.isMesh) {
      child.material = new THREE.MeshLambertMaterial()
      child.material.map = texture
    }
  })
}

/* CAMERA */

export function shakeCamera(camera, range = .1, callback, recoil = false) {
  const oldPosition = new THREE.Vector3().copy(camera.position)

  const offset = recoil
    ? new THREE.Vector3(0, 0, randFloat(range * .5, range))
    : new THREE.Vector3(randFloat(-range, range), randFloat(-range, range), randFloat(-range, range))
  camera.position.add(offset)

  const duration = recoil ? range * 250 : range * 1000

  const tween = new TWEEN.Tween(camera.position)
    .to(oldPosition, duration)
    .start()

  tween.onComplete(() => {
    if (callback) callback()
  })
}

export const recoil = camera => shakeCamera(camera, .7, null, true)

export function createChaseCamera(mesh, camera = defaultCamera) {
  const chaseCam = new THREE.Object3D()
  chaseCam.position.set(0, 0, 0)
  const pivot = new THREE.Object3D()
  pivot.position.set(0, 2, 4)
  pivot.name = 'pivot'
  chaseCam.add(pivot)
  mesh.add(chaseCam)

  camera.position.copy(mesh.position)

  return function() {
    const v = new THREE.Vector3()
    camera.lookAt(mesh.position)
    pivot.getWorldPosition(v)
    if (v.y < 1) v.y = 1
    camera.position.lerpVectors(camera.position, v, 0.05)
  }
}

/* JS HELPERS */

export const isEmpty = obj => Object.keys(obj).length === 0

export const sample = arr => arr[Math.floor(Math.random() * arr.length)]

export function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
