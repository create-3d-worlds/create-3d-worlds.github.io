import { scene, camera, renderer, createOrbitControls } from '../utils/three-scene.js'

const rowSize = 1
const spacing = .03
const brickSize = rowSize + spacing
const blocksInRow = 20
const rows = 10
const wallWidth = brickSize * blocksInRow

camera.position.set(5, 15, 25)
createOrbitControls()

/* FUNCTIONS */

const isOdd = x => x % 2

function createBlock(x, y, z) {
  const block = new THREE.Mesh(new THREE.BoxGeometry(rowSize, rowSize, rowSize), new THREE.MeshNormalMaterial())
  block.position.set(x, y, z)
  return block
}

function createRow(row, startX, z) {
  const group = new THREE.Group()
  for (let x = 0; x < wallWidth; x += brickSize) {
    const adjX = isOdd(row) ? x : x + brickSize / 2
    group.add(createBlock(startX + adjX, row * brickSize, z))
  }
  return group
}

function createWall(x, z) {
  const group = new THREE.Group()
  for (let row = 0; row < rows; row++) {
    group.add(createRow(row, x, z))
  }
  return group
}

/* INIT **/

var axesHelper = new THREE.AxesHelper(10)
scene.add(axesHelper)

scene.add(createWall(0, -wallWidth / 2))
scene.add(createWall(0, wallWidth / 2))

for (let z = -wallWidth / 2; z < wallWidth / 2; z+=brickSize) {
  scene.add(createBlock(0, 0, z))  
}

for (let z = -wallWidth / 2; z < wallWidth / 2; z+=brickSize) {
  scene.add(createBlock(0, brickSize, z + brickSize / 2))  
}

void function update() {
  window.requestAnimationFrame(update)
  renderer.render(scene, camera)
}()
