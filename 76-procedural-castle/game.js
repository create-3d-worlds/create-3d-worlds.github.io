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

function createBlock(x, y, z) {
  const blok = new THREE.Mesh(new THREE.BoxGeometry(blockWidth, blockSize, blockSize), new THREE.MeshNormalMaterial())
  blok.position.set(x, y, z)
  return blok
}

function createRow(row, startX, startZ) {
  const group = new THREE.Group()
  for (let x = 0; x < wallWidth; x += fullBlockWidth) {
    const adjX = row % 2 ? x : x + blockSize / 2
    group.add(createBlock(startX + adjX, row * fullBlockHeight, startZ))
  }
  return group
}

function createWall(startX, startZ) {
  const group = new THREE.Group()
  for (let row = 0; row < rowsInWall; row++) {
    group.add(createRow(row, startX, startZ))
  }
  return group
}

/* INIT **/

var axesHelper = new THREE.AxesHelper(10);
scene.add( axesHelper );

scene.add(createWall(0, -wallWidth / 2))
scene.add(createWall(0, wallWidth / 2))

void function update() {
  window.requestAnimationFrame(update)
  renderer.render(scene, camera)
}()
