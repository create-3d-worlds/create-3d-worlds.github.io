import * as THREE from 'three'
import { dir } from '/core/constants.js'

const { randFloat, randFloatSpread } = THREE.MathUtils
const raycaster = new THREE.Raycaster()

/* MATH */

export const mapRange = (value, inMin, inMax, outMin, outMax) =>
  (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin

/*
  @return shuffled coordinates for given mapSize
*/
export function getEmptyCoords({
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

export const adjustHeight = mesh => mesh.translateY(getHeight(mesh) / 2)

export const belongsTo = (object, name) => {
  if (!object) return false
  if (object.name === name) return true
  return belongsTo(object.parent, name)
}

/* COLORS */

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

export const getIntersects = (raycaster, target) => (
  Array.isArray(target)
    ? raycaster.intersectObjects(target)
    : raycaster.intersectObject(target)
).filter(x => x.object.type != 'Points') // ignore particles

export function findGround({ solids, pos, y = 200 }) {
  const origin = { x: pos.x, y: pos.y + y, z: pos.z }
  raycaster.set(origin, dir.down)
  const intersects = getIntersects(raycaster, solids)
  return intersects?.[0]
}

export const getGroundY = ({ solids, pos, y }) => findGround({ solids, pos, y })?.point?.y || 0

export const putOnSolids = (mesh, solids, adjustment = 0) => {
  mesh.position.y = getGroundY({ solids, pos: mesh.position }) + adjustment
}

const raycast = (mesh, dir, y) => {
  const direction = dir.clone().applyQuaternion(mesh.quaternion)
  const bodyCenter = mesh.position.clone()
  bodyCenter.y += y
  raycaster.set(bodyCenter, direction)
  return raycaster
}

export const intersect = (mesh, solids, dir, height = getHeight(mesh) * .5) => {
  const raycaster = raycast(mesh, dir, height)
  return getIntersects(raycaster, solids)
}

const defaultLength = (currDir, mesh) =>
  currDir == dir.forward ? getSize(mesh, 'z') : getSize(mesh, 'y')

export const directionBlocked = (mesh, solids, currDir, rayLength = defaultLength(currDir, mesh)) => {
  const intersects = intersect(mesh, solids, currDir)
  return intersects.length && intersects[0].distance < rayLength
}

export function getCameraIntersects(camera, target) {
  raycaster.set(camera.getWorldPosition(new THREE.Vector3()), camera.getWorldDirection(new THREE.Vector3()))
  return getIntersects(raycaster, target)
}

/* TEXTURES */

export const createTexture = ({ file, repeat = 1 } = {}) => {
  const texture = new THREE.TextureLoader().load(`/assets/textures/${file}`)
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.magFilter = THREE.NearestFilter
  // texture.minFilter = THREE.LinearMipMapLinearFilter
  texture.repeat.set(repeat, repeat)
  return texture
}

/* ARRAYS */

export const sample = arr => arr[Math.floor(Math.random() * arr.length)]

export function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
