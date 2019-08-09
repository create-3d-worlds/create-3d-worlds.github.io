import { scene, camera, renderer, createOrbitControls } from '../utils/three-scene.js'

const brickInWall = 20  // ne sme mnogo zbog rekurzije
const numRows = 10
const brickWidth = 10.2
const wallWidth = brickWidth * brickInWall
const towers = [
  [0, 0],
  [0, wallWidth],
  [wallWidth, 0],
  [wallWidth, wallWidth]
]

camera.position.set(55, 150, 250)
createOrbitControls()

/* FUNCTIONS */

// if not in center and not to hight
const notDoor = (x, y) => (x < wallWidth * 3 / 8 || x > wallWidth * 5 / 8) || y > numRows * brickWidth / 2

function addBlock(x, y, z) {
  const block = new THREE.Mesh(new THREE.BoxGeometry(10, 10, 10), new THREE.MeshNormalMaterial())
  block.position.set(x, y, z)
  scene.add(block)
}

function buildRow(y, x) {
  if (x > wallWidth + 1) return
  addBlock(x, y, 0)
  addBlock(x, y, wallWidth)
  addBlock(0, y, x)
  if (notDoor(x, y)) addBlock(wallWidth, y, x)
  buildRow(y, x + brickWidth)
}

function buildTower(x, z) {
  const radius = 15
  const kula = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, 150, 100), new THREE.MeshNormalMaterial())
  kula.position.set(x, 70, z)
  scene.add(kula)
  const krov = new THREE.Mesh(new THREE.CylinderGeometry(0, radius * 1.2, 50, 100), new THREE.MeshNormalMaterial())
  krov.position.set(x, 170, z)
  scene.add(krov)
}

function buildCastle(y) {
  if (y > brickWidth * numRows) return
  const start = Math.floor(y / brickWidth) % 2 == 0 ? 0 : brickWidth / 2
  buildRow(y, start)
  buildCastle(y + brickWidth)
}

/* INIT **/

buildCastle(0)

towers.forEach(coord => buildTower(...coord))

void function update() {
  window.requestAnimationFrame(update)
  renderer.render(scene, camera)
}()
