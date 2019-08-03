import {FirstPersonControls} from '../node_modules/three/examples/jsm/controls/FirstPersonControls.js'
import {nemesis as map} from '../data/maps.js'
import {randomInRange} from '../utils/helpers.js'
import { scene, camera, renderer, clock } from '../utils/3d-scene.js'

const mapW = map.length
const mapH = map[0].length

const UNITSIZE = 250,
  WALLHEIGHT = UNITSIZE / 3,
  MOVESPEED = 100,
  LOOKSPEED = 0.075,
  NUMAI = 5

const ai = []

const floor = new THREE.Mesh(
  new THREE.CubeGeometry(mapW * UNITSIZE, 10, mapW * UNITSIZE),
  new THREE.MeshLambertMaterial({color: 0xEDCBA0})
)
scene.add(floor)

camera.position.y = UNITSIZE * .2

const controls = new FirstPersonControls(camera)
controls.movementSpeed = MOVESPEED
controls.lookSpeed = LOOKSPEED
controls.lookVertical = false // Temporary solution; play on flat surfaces only
controls.noFly = true

function getMapSector(v) {
  const x = Math.floor((v.x + UNITSIZE / 2) / UNITSIZE + mapW / 2)
  const z = Math.floor((v.z + UNITSIZE / 2) / UNITSIZE + mapW / 2)
  return {x, z}
}

function checkWallCollision(v) {
  const c = getMapSector(v)
  return map[c.x][c.z] > 0
}

function addAI() {
  let x, z
  const c = getMapSector(camera.position)
  const aiGeo = new THREE.CubeGeometry(40, 40, 40)
  const aiMaterial = new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture('images/face.png')})
  const o = new THREE.Mesh(aiGeo, aiMaterial)
  do {
    x = randomInRange(0, mapW - 1)
    z = randomInRange(0, mapH - 1)
  } while (map[x][z] > 0 || (x == c.x && z == c.z))
  x = Math.floor(x - mapW / 2) * UNITSIZE
  z = Math.floor(z - mapW / 2) * UNITSIZE
  o.position.set(x, UNITSIZE * 0.15, z)
  o.pathPos = 1
  o.lastRandomX = Math.random()
  o.lastRandomZ = Math.random()
  o.lastShot = Date.now()
  ai.push(o)
  scene.add(o)
}

function updateAI(delta) {
  const aispeed = delta * MOVESPEED
  for (let i = ai.length - 1; i >= 0; i--) {
    const a = ai[i]
    const r = Math.random()
    if (r > 0.995) {
      a.lastRandomX = Math.random() * 2 - 1
      a.lastRandomZ = Math.random() * 2 - 1
    }
    a.translateX(aispeed * a.lastRandomX)
    a.translateZ(aispeed * a.lastRandomZ)
    const c = getMapSector(a.position)
    if (c.x < 0 || c.x >= mapW || c.y < 0 || c.y >= mapH || checkWallCollision(a.position)) {
      a.translateX(-2 * aispeed * a.lastRandomX)
      a.translateZ(-2 * aispeed * a.lastRandomZ)
      a.lastRandomX = Math.random() * 2 - 1
      a.lastRandomZ = Math.random() * 2 - 1
    }
    if (c.x < -1 || c.x > mapW || c.z < -1 || c.z > mapH) {
      ai.splice(i, 1)
      scene.remove(a)
      addAI()
    }
  }
}

function render() {
  const delta = clock.getDelta()
  controls.update(delta)
  updateAI(delta)
  renderer.render(scene, camera)
}

function setupScene() {
  const cube = new THREE.CubeGeometry(UNITSIZE, WALLHEIGHT, UNITSIZE)
  const materials = [
    new THREE.MeshLambertMaterial({ map: THREE.ImageUtils.loadTexture('images/wall-1.jpg')}),
    new THREE.MeshLambertMaterial({ map: THREE.ImageUtils.loadTexture('images/wall-2.jpg')}),
    new THREE.MeshLambertMaterial({color: 0xFBEBCD}),
  ]
  for (let i = 0; i < mapW; i++) 
    for (let j = 0, m = map[i].length; j < m; j++) 
      if (map[i][j]) {
        const wall = new THREE.Mesh(cube, materials[map[i][j] - 1])
        wall.position.x = (i - mapW / 2) * UNITSIZE
        wall.position.y = WALLHEIGHT / 2
        wall.position.z = (j - mapW / 2) * UNITSIZE
        scene.add(wall)
      }

  const directionalLight1 = new THREE.DirectionalLight(0xF7EFBE, 0.7)
  directionalLight1.position.set(0.5, 1, 0.5)
  scene.add(directionalLight1)
  const directionalLight2 = new THREE.DirectionalLight(0xF7EFBE, 0.5)
  directionalLight2.position.set(-0.5, -1, -0.5)
  scene.add(directionalLight2)
}

function setupAI() {
  for (let i = 0; i < NUMAI; i++) addAI()
}

/* INIT */

setupScene()
setupAI()

void function animate() {
  requestAnimationFrame(animate)	
  render()
}()