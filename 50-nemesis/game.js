import {FirstPersonControls} from '../node_modules/three/examples/jsm/controls/FirstPersonControls.js'
import {nemesis as map} from '../data/maps.js'
import {randomInRange} from '../utils/helpers.js'
import { scene, camera, renderer, clock } from '../utils/3d-scene.js'
import Tilemap3D from '../classes/Tilemap3D.js'

const UNITSIZE = 250,
  MOVESPEED = 100,
  NUM_AI = 5

const tilemap = new Tilemap3D(map, UNITSIZE)
scene.add(tilemap.createFloor())
scene.add(tilemap.createWalls())

const ai = []
const loader = new THREE.TextureLoader()

camera.position.y = 30

const controls = new FirstPersonControls(camera)
controls.movementSpeed = MOVESPEED
controls.lookSpeed = 0.075
controls.lookVertical = false // inace propada kroz pod bez kolizije

const directionalLight1 = new THREE.DirectionalLight(0xF7EFBE, 0.7)
directionalLight1.position.set(0.5, 1, 0.5)
scene.add(directionalLight1)
const directionalLight2 = new THREE.DirectionalLight(0xF7EFBE, 0.5)
directionalLight2.position.set(-0.5, -1, -0.5)
scene.add(directionalLight2)


function addAI() {
  let x, z
  const c = tilemap.getMapSector(camera.position)
  const aiGeo = new THREE.CubeGeometry(40, 40, 40)
  const aiMaterial = new THREE.MeshBasicMaterial({ map: loader.load('images/face.png')})
  const o = new THREE.Mesh(aiGeo, aiMaterial)
  do {
    x = randomInRange(0, map[0].length - 1)
    z = randomInRange(0, map.length - 1)
  } while (map[x][z] > 0 || (x == c.x && z == c.z))
  x = Math.floor(x - map[0].length / 2) * UNITSIZE
  z = Math.floor(z - map.length / 2) * UNITSIZE
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
    const c = tilemap.getMapSector(a.position)
    if (c.x < 0 || c.x >= map[0].length || c.y < 0 || c.y >= map.length || tilemap.checkWallCollision(a.position)) {
      a.translateX(-2 * aispeed * a.lastRandomX)
      a.translateZ(-2 * aispeed * a.lastRandomZ)
      a.lastRandomX = Math.random() * 2 - 1
      a.lastRandomZ = Math.random() * 2 - 1
    }
    if (c.x < -1 || c.x > map[0].length || c.z < -1 || c.z > map.length) {
      ai.splice(i, 1)
      scene.remove(a)
      addAI()
    }
  }
}

/* INIT */

for (let i = 0; i < NUM_AI; i++) addAI()

void function animate() {
  requestAnimationFrame(animate)	
  const delta = clock.getDelta()
  controls.update(delta)
  updateAI(delta)
  renderer.render(scene, camera)
}()