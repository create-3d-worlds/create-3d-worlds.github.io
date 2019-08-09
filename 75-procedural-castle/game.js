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

const notDoors = (x, y) => (x < wallWidth * 3 / 8 || x > wallWidth * 5 / 8) || y > numRows * brickWidth / 2

function createBlock(x, y, z) {
  const blok = new THREE.Mesh(new THREE.BoxGeometry(10, 10, 10), new THREE.MeshNormalMaterial())
  blok.position.set(x, y, z)
  return blok
}

function buildRow(y, x) {
  if (x > wallWidth + 1) return
  ;[
    [x, y, 0],
    [x, y, wallWidth],
    [0, y, x],
    // [wallWidth, y, x]
  ].forEach(coord => scene.add(createBlock(...coord)))
  if (notDoors(x, y)) scene.add(createBlock(...[wallWidth, y, x]))
  buildRow(y, x + brickWidth)
}

function buildTower(x, z) {
  const precnik = 15
  const kula = new THREE.Mesh(new THREE.CylinderGeometry(precnik, precnik, 150, 100), new THREE.MeshNormalMaterial())
  kula.position.set(x, 70, z)
  scene.add(kula)
  const krov = new THREE.Mesh(new THREE.CylinderGeometry(0, precnik, 50, 100), new THREE.MeshNormalMaterial())
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
// buildRow(0, brickWidth)
// buildRow(10, brickWidth / 2)
towers.forEach(coord => buildTower(...coord))

void function update() {
  window.requestAnimationFrame(update)
  renderer.render(scene, camera)
}()
