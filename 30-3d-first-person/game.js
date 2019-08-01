import {createTree} from '../utils/3d-helpers.js'

let hoda_levo, hoda_desno, hoda_napred, hoda_nazad

const clock = new THREE.Clock(true)
const scene = new THREE.Scene()

// container for camera and avatara
const container = new THREE.Object3D()
scene.add(container)

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000)
camera.position.z = 500
container.add(camera)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const tekstura = new THREE.MeshNormalMaterial()
const telo = new THREE.SphereGeometry(100)
const avatar = new THREE.Mesh(telo, tekstura)
container.add(avatar)

const ud = new THREE.SphereGeometry(50)
const desna_ruka = new THREE.Mesh(ud, tekstura)
desna_ruka.position.set(-150, 0, 0)
avatar.add(desna_ruka)

const leva_ruka = new THREE.Mesh(ud, tekstura)
leva_ruka.position.set(150, 0, 0)
avatar.add(leva_ruka)

const desna_noga = new THREE.Mesh(ud, tekstura)
desna_noga.position.set(70, -120, 0)
avatar.add(desna_noga)

const leva_noga = new THREE.Mesh(ud, tekstura)
leva_noga.position.set(-70, -120, 0)
avatar.add(leva_noga)

/* FUNCTIONS */

function isMoving() {
  if (hoda_desno) return true
  if (hoda_levo) return true
  if (hoda_nazad) return true
  if (hoda_napred) return true
  return false
}

function updateMove() {
  if (!isMoving()) return
  const elapsed = Math.sin(clock.getElapsedTime() * 5) * 100
  leva_ruka.position.z = -elapsed
  desna_ruka.position.z = elapsed
  leva_noga.position.z = -elapsed
  desna_noga.position.z = elapsed
}

function updateAngle() {
  let ugao = 0
  if (hoda_napred) ugao = Math.PI
  if (hoda_nazad) ugao = 0
  if (hoda_desno) ugao = Math.PI / 2
  if (hoda_levo) ugao = -Math.PI / 2
  avatar.rotation.y = ugao
}

function animate() {
  requestAnimationFrame(animate)
  updateMove()
  updateAngle()
  renderer.render(scene, camera)
}

/* INIT */

[[500, 0], [-500, 0], [300, -200], [-200, -800], [-750, -1000], [500, -1000]]
  .map(pos => scene.add(createTree(...pos)))
animate()

/* EVENTS */

document.addEventListener('keydown', event => {
  const {keyCode} = event
  if (keyCode == 37) {
    container.position.x -= 10
    hoda_levo = true
  }
  if (keyCode == 39) {
    container.position.x += 10
    hoda_desno = true
  }
  if (keyCode == 38) {
    container.position.z -= 10
    hoda_napred = true
  }
  if (keyCode == 40) {
    container.position.z += 10
    hoda_nazad = true
  }
  // a i d pomera kameru (nastavlja da prati igraca pod drugim uglom)
  if (keyCode == 65) camera.position.x += 10
  if (keyCode == 68) camera.position.x -= 10
})

document.addEventListener('keyup', event => {
  const {keyCode} = event
  if (keyCode == 37) hoda_levo = false
  if (keyCode == 39) hoda_desno = false
  if (keyCode == 38) hoda_napred = false
  if (keyCode == 40) hoda_nazad = false
})
