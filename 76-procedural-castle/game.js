import { scene, camera, renderer, createOrbitControls } from '../utils/three-scene.js'

const blockSize = 1
const blockWidth = blockSize * 2
const space = .03
const blocksInRow = 20
const rowsInWall = 10
const fullBlockWidth = blockWidth + space
const fullBlockHeight = blockSize + space
const wallWidth = fullBlockWidth * blocksInRow

camera.position.set(5, 15, 25)
createOrbitControls()

/* FUNCTIONS */

function createBlock(x, y, z, rotated) {
  const block = new THREE.Mesh(new THREE.BoxGeometry(blockWidth, blockSize, blockSize), new THREE.MeshNormalMaterial())
  block.position.set(x, y, z)
  if (rotated) block.rotateY(Math.PI / 2)
  return block
}

function createRow(row, startX, z) {
  const group = new THREE.Group()
  for (let x = 0; x < wallWidth; x += fullBlockWidth) {
    const adjX = row % 2 ? x : x + blockSize / 2
    group.add(createBlock(startX + adjX, row * fullBlockHeight, z))
  }
  return group
}

function createWall(x, z) {
  const group = new THREE.Group()
  for (let row = 0; row < rowsInWall; row++) {
    group.add(createRow(row, x, z))
  }
  return group
}

/* INIT **/

var axesHelper = new THREE.AxesHelper(10);
scene.add( axesHelper );

scene.add(createWall(0, -wallWidth / 2))
scene.add(createWall(0, wallWidth / 2))

for (let z = -wallWidth / 2; z < wallWidth / 2; z+=fullBlockWidth) {
  scene.add(createBlock(0, 0, z, true))  
}

void function update() {
  window.requestAnimationFrame(update)
  renderer.render(scene, camera)
}()
