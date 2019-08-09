import { OrbitControls } from '../node_modules/three/examples/jsm/controls/OrbitControls.js'

const brojCigli = 20
const brojSpratova = 13
const razmak = 10.2
const d = razmak * brojCigli

/** SCENA **/

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera()
camera.position.set(55, 50, 250)

const controls = new OrbitControls(camera)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

/** GEOMETRIJA **/

function praviCiglu(x, y, z) {
  const blok = new THREE.Mesh(new THREE.BoxGeometry(10, 10, 10), new THREE.MeshNormalMaterial())
  blok.position.set(x, y, z)
  scene.add(blok)
}

function praviSprat(y, i) {
  if (i > d + 1) return
  ;[[i, y, 0], [i, y, d], [0, y, i], [d, y, i]].map(kord => praviCiglu(...kord))
  praviSprat(y, i + razmak)
}

function praviKulu(x, z) {
  const precnik = 15
  const kula = new THREE.Mesh(new THREE.CylinderGeometry(precnik, precnik, 150, 100), new THREE.MeshNormalMaterial())
  kula.position.set(x, 70, z)
  scene.add(kula)
  const krov = new THREE.Mesh(new THREE.CylinderGeometry(0, precnik, 50, 100), new THREE.MeshNormalMaterial())
  krov.position.set(x, 170, z)
  scene.add(krov)
}

;[[0, 0], [0, d], [d, 0], [d, d]].map(kord => praviKulu(...kord))

/** UPDATE **/

void function praviZgradu(y) {
  if (y > razmak * brojSpratova) return
  const start = Math.floor(y / razmak) % 2 == 0 ? 0 : razmak / 2
  praviSprat(y, start)
  praviZgradu(y + razmak)
}(0)

void function update() {
  window.requestAnimationFrame(update)
  controls.update()
  renderer.render(scene, camera)
}()
