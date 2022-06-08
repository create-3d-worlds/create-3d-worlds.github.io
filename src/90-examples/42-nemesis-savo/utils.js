import * as THREE from '/node_modules/three127/build/three.module.js'
import { camera, scene } from '/utils/scene.js'
import { UNITSIZE, BULLETMOVESPEED, PROJECTILEDAMAGE, MOVESPEED, mapWidth, mapHeight } from './constants.js'
import { randomInt } from '/utils/helpers.js'
import { nemesis } from '/data/maps.js'
import { getMapPosition } from '/utils/maps.js'

const textureLoader = new THREE.TextureLoader()

export function createHealth() {
  const healthcube = new THREE.Mesh(
    new THREE.BoxGeometry(30, 30, 30),
    new THREE.MeshBasicMaterial({ map: textureLoader.load('images/health.png') })
  )
  healthcube.position.set(-UNITSIZE - 15, 35, -UNITSIZE - 15)
  return healthcube
}

export const getMapCell = obj => getMapPosition({ obj, cellSize: UNITSIZE, map: nemesis })

export function createEnemy({ x, z, size = UNITSIZE * .2 }) {
  const geometry = new THREE.BoxGeometry(size, size, size)
  const material = new THREE.MeshBasicMaterial({ map: textureLoader.load('images/face.png') })
  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.set(x, UNITSIZE * .1, z)
  mesh.health = 100
  mesh.pathPos = 1
  mesh.lastRandomX = Math.random()
  mesh.lastRandomZ = Math.random()
  mesh.lastShot = Date.now()
  return mesh
}

export function isWall(v) {
  const c = getMapCell(v)
  return nemesis[c.z][c.x] > 0
}

export const distance = (a, b) => Math.sqrt((b.x - a.x) * (b.x - a.x) + (b.z - a.z) * (b.z - a.z))

export const isHit = (bullet, target) => {
  const bulletPos = bullet.position
  const targetPos = target.position

  const { position } = target.geometry.attributes
  const vec = new THREE.Vector3()
  vec.fromBufferAttribute(position, 0)
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
    x = randomInt(0, mapWidth - 1)
    z = randomInt(0, mapHeight - 1)
  } while (nemesis[z][x] > 0 || (x == c.x && z == c.z))

  x = Math.floor(x - mapWidth / 2) * UNITSIZE
  z = Math.floor(z - mapWidth / 2) * UNITSIZE
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
