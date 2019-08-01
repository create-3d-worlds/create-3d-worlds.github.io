let hoda_levo, hoda_desno, hoda_napred, hoda_nazad

const clock = new THREE.Clock(true)
const scene = new THREE.Scene()

// okvir za kameru i avatara
const okvir = new THREE.Object3D()
scene.add(okvir)

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000)
camera.position.z = 500
okvir.add(camera)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const tekstura = new THREE.MeshNormalMaterial()
const telo = new THREE.SphereGeometry(100)
const avatar = new THREE.Mesh(telo, tekstura)
okvir.add(avatar)

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

function praviDrvo(x, z) {
  const stablo = new THREE.Mesh(new THREE.CylinderGeometry(50, 50, 200), new THREE.MeshBasicMaterial({color: 0xA0522D}))
  const krosnja = new THREE.Mesh(new THREE.SphereGeometry(150), new THREE.MeshBasicMaterial({color: 0x228b22}))
  krosnja.position.y = 175
  stablo.add(krosnja)
  stablo.position.set(x, -75, z)
  return stablo
}

function jelHoda() {
  if (hoda_desno) return true
  if (hoda_levo) return true
  if (hoda_nazad) return true
  if (hoda_napred) return true
  return false
}

function azurirajPokret() {
  if (!jelHoda()) return
  const elapsed = Math.sin(clock.getElapsedTime() * 5) * 100
  leva_ruka.position.z = -elapsed
  desna_ruka.position.z = elapsed
  leva_noga.position.z = -elapsed
  desna_noga.position.z = elapsed
}

function azurirajUgao() {
  let ugao = 0
  if (hoda_napred) ugao = Math.PI
  if (hoda_nazad) ugao = 0
  if (hoda_desno) ugao = Math.PI / 2
  if (hoda_levo) ugao = -Math.PI / 2
  avatar.rotation.y = ugao
}

function animate() {
  requestAnimationFrame(animate)
  azurirajPokret()
  azurirajUgao()
  renderer.render(scene, camera)
}

/* INIT */

[[500, 0], [-500, 0], [300, -200], [-200, -800], [-750, -1000], [500, -1000]]
  .map(pos => scene.add(praviDrvo(...pos)))
animate()

/* EVENTS */

document.addEventListener('keydown', event => {
  const {keyCode} = event
  if (keyCode == 37) {
    okvir.position.x -= 10
    hoda_levo = true
  }
  if (keyCode == 39) {
    okvir.position.x += 10
    hoda_desno = true
  }
  if (keyCode == 38) {
    okvir.position.z -= 10
    hoda_napred = true
  }
  if (keyCode == 40) {
    okvir.position.z += 10
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
