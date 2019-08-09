import { scene, camera, renderer, createOrbitControls } from '../utils/three-scene.js'

const brojCigli = 20
const brojSpratova = 13
const razmak = 10.2
const d = razmak * brojCigli

camera.position.set(55, 150, 250)
createOrbitControls()

/* FUNCTIONS */

function createBlock(x, y, z) {
  const blok = new THREE.Mesh(new THREE.BoxGeometry(10, 10, 10), new THREE.MeshNormalMaterial())
  blok.position.set(x, y, z)
  return blok
}

function buildFloor(y, i) {
  if (i > d + 1) return
  ;[[i, y, 0], [i, y, d], [0, y, i], [d, y, i]].map(kord => scene.add(createBlock(...kord)))
  buildFloor(y, i + razmak)
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

;[[0, 0], [0, d], [d, 0], [d, d]].map(kord => buildTower(...kord))

/* INIT **/

void function buildCastle(y) {
  if (y > razmak * brojSpratova) return
  const start = Math.floor(y / razmak) % 2 == 0 ? 0 : razmak / 2
  buildFloor(y, start)
  buildCastle(y + razmak)
}(0)

void function update() {
  window.requestAnimationFrame(update)
  renderer.render(scene, camera)
}()
