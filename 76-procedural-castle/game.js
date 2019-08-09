import { scene, camera, renderer, createOrbitControls } from '../utils/three-scene.js'

const blockSize = 1
const blockWidth = blockSize * 2
const space = .03
const blocksInRow = 20
const rowsInWall = 10

camera.position.set(5, 15, 25)
createOrbitControls()

/* FUNCTIONS */

function createBlock(x, y, z) {
  const blok = new THREE.Mesh(new THREE.BoxGeometry(blockWidth, blockSize, blockSize), new THREE.MeshNormalMaterial())
  blok.position.set(x, y, z)
  return blok
}

function createRow(y) {
  const group = new THREE.Group()
  for (let i = 0; i < blocksInRow; i++) {
    const x = y % 2 ? i : i + blockSize / 2
    group.add(createBlock(x * (blockWidth + space), y * (blockSize + space), 0))
  }
  return group
}

function createWall() {
  const group = new THREE.Group()
  for (let y = 0; y < rowsInWall; y++) {
    group.add(createRow(y))
  }
  return group
}

/* INIT **/

scene.add(createWall())

void function update() {
  window.requestAnimationFrame(update)
  renderer.render(scene, camera)
}()
