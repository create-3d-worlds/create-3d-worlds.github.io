import * as THREE from '/node_modules/three119/build/three.module.js'
import { camera } from '/utils/scene.js'
import { nemesis as map } from '/data/maps.js'

const textureLoader = new THREE.TextureLoader()
const mapW = map.length

export const UNITSIZE = 250
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

export function drawRadar(ai) {
  const c = getMapSector(camera.position)
  const context = document.getElementById('radar').getContext('2d')
  for (let i = 0; i < mapW; i++)
    for (let j = 0, m = map[i].length; j < m; j++) {
      let d = 0
      for (let k = 0, n = ai.length; k < n; k++) {
        const e = getMapSector(ai[k].position)
        if (i == e.x && j == e.z) d++
      }
      if (i == c.x && j == c.z && d == 0) {
        context.fillStyle = '#0000FF'
        context.fillRect(i * 20, j * 20, (i + 1) * 20, (j + 1) * 20)
      } else if (i == c.x && j == c.z) {
        context.fillStyle = '#AA33FF'
        context.fillRect(i * 20, j * 20, (i + 1) * 20, (j + 1) * 20)
        context.fillStyle = '#000000'
        context.fillText('' + d, i * 20 + 8, j * 20 + 12)
      } else if (d > 0 && d < 10) {
        context.fillStyle = '#FF0000'
        context.fillRect(i * 20, j * 20, (i + 1) * 20, (j + 1) * 20)
        context.fillStyle = '#000000'
        context.fillText('' + d, i * 20 + 8, j * 20 + 12)
      } else if (map[i][j] > 0) {
        context.fillStyle = '#666666'
        context.fillRect(i * 20, j * 20, (i + 1) * 20, (j + 1) * 20)
      } else {
        context.fillStyle = '#CCCCCC'
        context.fillRect(i * 20, j * 20, (i + 1) * 20, (j + 1) * 20)
      }
    }
}

export function createAi({ x, z }) {
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

export function checkWallCollision(v) {
  const c = getMapSector(v)
  return map[c.x][c.z] > 0
}

export function createFloor() {
  const floor = new THREE.Mesh(
    new THREE.BoxGeometry(mapW * UNITSIZE, 10, mapW * UNITSIZE),
    new THREE.MeshLambertMaterial({ color: 0xEDCBA0 })
  )
  return floor
}

export function createMap() {
  const group = new THREE.Group()
  const cube = new THREE.BoxGeometry(UNITSIZE, WALLHEIGHT, UNITSIZE)
  const materials = [
    new THREE.MeshLambertMaterial({ map: textureLoader.load('images/wall-1.jpg') }),
    new THREE.MeshLambertMaterial({ map: textureLoader.load('images/wall-2.jpg') }),
    new THREE.MeshLambertMaterial({ color: 0xFBEBCD }),
  ]
  for (let i = 0; i < mapW; i++)
    for (let j = 0, m = map[i].length; j < m; j++)
      if (map[i][j]) {
        const wall = new THREE.Mesh(cube, materials[map[i][j] - 1])
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
