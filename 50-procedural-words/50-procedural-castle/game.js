import * as THREE from '/node_modules/three108/build/three.module.js'
import { scene, camera, renderer, createOrbitControls } from '/utils/scene.js'

camera.position.y = 250

const rows = 10
const brickInWall = 24  // ne sme mnogo zbog rekurzije
const rowSize = 10
const spacing = 0.2
const brickSize = rowSize + spacing
const wallWidth = brickSize * brickInWall
const towerRadius = 15
const towers = [
  [0, 0],
  [0, wallWidth],
  [wallWidth, 0],
  [wallWidth, wallWidth]
]

createOrbitControls()

/* FUNCTIONS */

const notDoor = (x, y) => (x < wallWidth * 3 / 8 || x > wallWidth * 5 / 8) || y > rows * brickSize / 2  // not in center and not to hight

const isEven = y => Math.floor(y / brickSize) % 2 == 0

function addBlock(x, y, z) {
  const block = new THREE.Mesh(new THREE.BoxGeometry(rowSize, rowSize, rowSize), new THREE.MeshNormalMaterial())
  block.position.set(x, y, z)
  scene.add(block)
}

function addFourBlocks(x, y) {
  addBlock(x, y, 0)
  addBlock(x, y, wallWidth)
  addBlock(0, y, x)
  if (notDoor(x, y)) addBlock(wallWidth, y, x)
}

function buildRow(y, x) {
  if (x > wallWidth + 1) return
  if (y < brickSize * (rows - 1))
    addFourBlocks(x, y)
  else if (isEven(x)) addFourBlocks(x, y)
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
  const startX = isEven(y) ? 0 : brickSize / 2
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
