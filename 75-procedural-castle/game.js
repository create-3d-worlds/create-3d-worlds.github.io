import { scene, camera, renderer, createOrbitControls } from '../utils/three-scene.js'

const rows = 10
const brickInWall = 24  // ne sme mnogo zbog rekurzije
const brickSize = 10.2
const wallWidth = brickSize * brickInWall
const towerRadius = 15
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
const notDoor = (x, y) => (x < wallWidth * 3 / 8 || x > wallWidth * 5 / 8) || y > rows * brickSize / 2

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
  buildRow(y, x + brickSize)
}

function buildTower(x, z) {
  const tower = new THREE.Mesh(new THREE.CylinderGeometry(towerRadius, towerRadius, 150, 100), new THREE.MeshNormalMaterial())
  tower.position.set(x, 70, z)
  scene.add(tower)
  const cone = new THREE.Mesh(new THREE.CylinderGeometry(0, towerRadius * 1.2, 50, 100), new THREE.MeshNormalMaterial())
  cone.position.set(x, 170, z)
  scene.add(cone)
}

function buildCastle(y) {
  if (y > brickSize * rows) return
  const startX = Math.floor(y / brickSize) % 2 == 0 ? 0 : brickSize / 2
  buildRow(y, startX)
  buildCastle(y + brickSize)
}

/* INIT **/

buildCastle(0)

towers.forEach(coord => buildTower(...coord))

void function update() {
  window.requestAnimationFrame(update)
  renderer.render(scene, camera)
}()
