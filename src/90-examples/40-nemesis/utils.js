import * as THREE from '/node_modules/three119/build/three.module.js'
import { camera, scene } from '/utils/scene.js'
import { UNITSIZE, BULLETMOVESPEED, PROJECTILEDAMAGE, MOVESPEED } from './constants.js'
import { randomInt } from '/utils/helpers.js'
import { nemesis } from '/data/maps.js'
import { create3DMap } from '/utils/maps.js'

const textureLoader = new THREE.TextureLoader()
const mapW = nemesis.length
const mapH = nemesis[0].length

export function createHealth() {
  const healthcube = new THREE.Mesh(
    new THREE.BoxGeometry(30, 30, 30),
    new THREE.MeshBasicMaterial({ map: textureLoader.load('images/health.png') })
  )
  healthcube.position.set(-UNITSIZE - 15, 35, -UNITSIZE - 15)
  return healthcube
}

export function getMapCell(vec) {
  const x = Math.floor((vec.x + UNITSIZE / 2) / UNITSIZE + mapW / 2)
  const z = Math.floor((vec.z + UNITSIZE / 2) / UNITSIZE + mapW / 2)
  return { x, z }
}

export function createEnemy({ x, z }) {
  const geometry = new THREE.BoxGeometry(40, 40, 40)
  const material = new THREE.MeshBasicMaterial({ map: textureLoader.load('images/face.png') })
  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.set(x, UNITSIZE * 0.15, z)
  mesh.health = 100
  mesh.pathPos = 1
  mesh.lastRandomX = Math.random()
  mesh.lastRandomZ = Math.random()
  mesh.lastShot = Date.now() // Higher-fidelity timers aren'THREE a big deal here.
  return mesh
}

export function isWall(v) {
  const c = getMapCell(v)
  return nemesis[c.x][c.z] > 0
}

export function createFloor() {
  const floor = new THREE.Mesh(
    new THREE.BoxGeometry(mapW * UNITSIZE, 10, mapW * UNITSIZE),
    new THREE.MeshLambertMaterial({ color: 0xEDCBA0 })
  )
  return floor
}

export function createWalls(matrix = nemesis, size = UNITSIZE) {
  const group = new THREE.Group()
  const WALLHEIGHT = size / 3
  const cube = new THREE.BoxGeometry(size, WALLHEIGHT, size)
  const materials = [
    new THREE.MeshLambertMaterial({ map: textureLoader.load('images/wall-1.jpg') }),
    new THREE.MeshLambertMaterial({ map: textureLoader.load('images/wall-2.jpg') }),
    new THREE.MeshLambertMaterial({ color: 0xFBEBCD }),
  ]
  matrix.forEach((row, rowIndex) => row.forEach((val, columnIndex) => {
    if (!val) return
    const x = (rowIndex - mapW / 2) * size
    const y = WALLHEIGHT / 2
    const z = (columnIndex - mapW / 2) * size
    const wall = new THREE.Mesh(cube, materials[val - 1])
    wall.position.set(x, y, z)
    group.add(wall)
  }))
  return group
}

export const createMap = () => create3DMap({ matrix: nemesis, size: UNITSIZE })

export function createBullet(obj, target) {
  const material = new THREE.MeshBasicMaterial({ color: 0x333333 })
  const geometry = new THREE.SphereGeometry(2, 6, 6)
  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.set(obj.position.x, obj.position.y * 0.8, obj.position.z)
  let vector
  if (target) { // player is shooting
    vector = new THREE.Vector3(target.x, target.y, 1)
    vector.unproject(obj)
  } else
    vector = camera.position.clone()

  mesh.ray = new THREE.Ray(obj.position, vector.sub(obj.position).normalize())
  mesh.owner = obj
  return mesh
}

export const distance = (a, b) => Math.sqrt((b.x - a.x) * (b.x - a.x) + (b.z - a.z) * (b.z - a.z))

export const isHit = (bullet, target) => {
  const bulletPos = bullet.position
  const targetPos = target.position
  const vec = target.geometry.vertices[0]
  const x = Math.abs(vec.x)
  const z = Math.abs(vec.z)
  return bulletPos.x < targetPos.x + x && bulletPos.x > targetPos.x - x
      && bulletPos.z < targetPos.z + z && bulletPos.z > targetPos.z - z
      && bullet.owner != target
}

export const randomXZ = () => {
  let x, z
  const c = getMapCell(camera.position)
  do {
    x = randomInt(0, mapW - 1)
    z = randomInt(0, mapH - 1)
  } while (nemesis[x][z] > 0 || (x == c.x && z == c.z))

  x = Math.floor(x - mapW / 2) * UNITSIZE
  z = Math.floor(z - mapW / 2) * UNITSIZE
  return { x, z }
}

export const moveBullet = (b, delta) => {
  const speed = delta * BULLETMOVESPEED
  b.translateX(speed * b.ray.direction.x)
  b.translateZ(speed * b.ray.direction.z)
}

export const remove = (arr, el, i) => {
  const index = i ? i : arr.findIndex(x => el.uuid == x.uuid)
  arr.splice(index, 1)
  scene.remove(el)
}

export const hitEnemy = enemy => {
  enemy.health -= PROJECTILEDAMAGE
  const { color } = enemy.material
  const percent = enemy.health / 100
  color.setRGB(percent * color.r, percent * color.g, percent * color.b)
}

export const moveEnemy = (enemy, delta) => {
  const speed = delta * MOVESPEED
  if (Math.random() > 0.995) {
    enemy.lastRandomX = Math.random() * 2 - 1
    enemy.lastRandomZ = Math.random() * 2 - 1
  }
  enemy.translateX(speed * enemy.lastRandomX)
  enemy.translateZ(speed * enemy.lastRandomZ)
  if (isWall(enemy.position)) {
    enemy.translateX(-2 * speed * enemy.lastRandomX)
    enemy.translateZ(-2 * speed * enemy.lastRandomZ)
    enemy.lastRandomX = Math.random() * 2 - 1
    enemy.lastRandomZ = Math.random() * 2 - 1
  }
}
