import * as THREE from '/node_modules/three119/build/three.module.js'
import { camera, scene } from '/utils/scene.js'
import { randomInt } from '/utils/helpers.js'
import { nemesis } from '/data/maps.js'
import { UNITSIZE, BULLETMOVESPEED, PROJECTILEDAMAGE } from './constants.js'

const textureLoader = new THREE.TextureLoader()
const mapW = nemesis.length
const mapH = nemesis[0].length

const WALLHEIGHT = UNITSIZE / 3

export function createHealth() {
  const healthcube = new THREE.Mesh(
    new THREE.BoxGeometry(30, 30, 30),
    new THREE.MeshBasicMaterial({ map: textureLoader.load('images/health.png') })
  )
  healthcube.position.set(-UNITSIZE - 15, 35, -UNITSIZE - 15)
  return healthcube
}

export function getMapSector(v) {
  const x = Math.floor((v.x + UNITSIZE / 2) / UNITSIZE + mapW / 2)
  const z = Math.floor((v.z + UNITSIZE / 2) / UNITSIZE + mapW / 2)
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
  const c = getMapSector(v)
  return nemesis[c.x][c.z] > 0
}

export function createFloor() {
  const floor = new THREE.Mesh(
    new THREE.BoxGeometry(mapW * UNITSIZE, 10, mapW * UNITSIZE),
    new THREE.MeshLambertMaterial({ color: 0xEDCBA0 })
  )
  return floor
}

export function createWalls() {
  const group = new THREE.Group()
  const cube = new THREE.BoxGeometry(UNITSIZE, WALLHEIGHT, UNITSIZE)
  const materials = [
    new THREE.MeshLambertMaterial({ map: textureLoader.load('images/wall-1.jpg') }),
    new THREE.MeshLambertMaterial({ map: textureLoader.load('images/wall-2.jpg') }),
    new THREE.MeshLambertMaterial({ color: 0xFBEBCD }),
  ]
  for (let i = 0; i < mapW; i++)
    for (let j = 0, m = nemesis[i].length; j < m; j++)
      if (nemesis[i][j]) {
        const wall = new THREE.Mesh(cube, materials[nemesis[i][j] - 1])
        wall.position.x = (i - mapW / 2) * UNITSIZE
        wall.position.y = WALLHEIGHT / 2
        wall.position.z = (j - mapW / 2) * UNITSIZE
        group.add(wall)
      }
  return group
}

export function createBullet(obj, mouse) {
  if (!obj) obj = camera // eslint-disable-line

  const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x333333 })
  const sphereGeo = new THREE.SphereGeometry(2, 6, 6)

  const sphere = new THREE.Mesh(sphereGeo, sphereMaterial)
  sphere.position.set(obj.position.x, obj.position.y * 0.8, obj.position.z)
  let vector
  if (obj instanceof THREE.Camera) {
    vector = new THREE.Vector3(mouse.x, mouse.y, 1)
    vector.unproject(obj)
  } else
    vector = camera.position.clone()

  sphere.ray = new THREE.Ray(obj.position, vector.sub(obj.position).normalize())
  sphere.owner = obj
  return sphere
}

export function distance(x1, y1, x2, y2) {
  return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1))
}

export const distanceTo = (a, b) => a.position.distanceTo(b.position)

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
  const c = getMapSector(camera.position)
  do {
    x = randomInt(0, mapW - 1)
    z = randomInt(0, mapH - 1)
  } while (nemesis[x][z] > 0 || (x == c.x && z == c.z))

  x = Math.floor(x - mapW / 2) * UNITSIZE
  z = Math.floor(z - mapW / 2) * UNITSIZE
  return { x, z }
}

export const updateBullet = (b, delta) => {
  const speed = delta * BULLETMOVESPEED
  b.translateX(speed * b.ray.direction.x)
  b.translateZ(speed * b.ray.direction.z)
}

export const remove = (arr, el, i) => {
  const index = i ? i : arr.findIndex(x => el.uuid == x.uuid)
  arr.splice(index, 1)
  scene.remove(el)
}

export const hitEnemy = ai => {
  ai.health -= PROJECTILEDAMAGE
  const { color } = ai.material
  const percent = ai.health / 100
  color.setRGB(percent * color.r, percent * color.g, percent * color.b)
}
