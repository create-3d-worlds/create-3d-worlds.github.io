import * as THREE from '/node_modules/three108/build/three.module.js'
import { scene, renderer } from '/utils/scene.js'

let vreme = 0,
  brzina = 1,
  pauza = false

const razmera = window.innerWidth / window.innerHeight
const glavna_kamera = new THREE.PerspectiveCamera(75, razmera, 1, 1e6)
const kamera_zemlja_sunce = new THREE.PerspectiveCamera(75, razmera, 1, 1e6)
const kamera_zemlja_mesec = new THREE.PerspectiveCamera(75, razmera, 1, 1e6)

glavna_kamera.position.z = 1000
scene.add(glavna_kamera)
let defaultCamera = glavna_kamera

const ambijent = new THREE.AmbientLight(0xffffff)
scene.add(ambijent)

const sunce = praviSunce()
scene.add(sunce)

const zemlja = praviZemlju()
const zemljina_orbita = praviZemljinuOrbitu(zemlja, kamera_zemlja_sunce)
sunce.add(zemljina_orbita)

const mesec = praviMesec()
const meseceva_orbita = praviMesecevuOrbitu(mesec, kamera_zemlja_mesec)
zemlja.add(meseceva_orbita)

scene.add(praviZvezde())

/* FUNCTIONS */

function praviSunce() {
  const surface = new THREE.MeshBasicMaterial({color: 0xFFD700})
  const zvezda = new THREE.SphereGeometry(50, 28, 21)
  const sunce = new THREE.Mesh(zvezda, surface)
  const sunceva_svetlost = new THREE.PointLight(0xffffff, 5, 1000)
  sunce.add(sunceva_svetlost)
  return sunce
}

function praviZemlju() {
  const surface = new THREE.MeshBasicMaterial({color: 0x0000cd})
  const planeta = new THREE.SphereGeometry(20, 20, 32)
  return new THREE.Mesh(planeta, surface)
}

function praviZemljinuOrbitu(zemlja, kamera_zemlja_sunce) {
  const zemljina_orbita = new THREE.Object3D()
  zemljina_orbita.add(zemlja)
  zemlja.position.set(250, 0, 0)
  // kamera_zemlja_sunce.rotation.set(Math.PI / 2, 0, 0)
  zemljina_orbita.add(kamera_zemlja_sunce)
  return zemljina_orbita
}

function praviMesec() {
  const surface = new THREE.MeshBasicMaterial({color: 0xffffff})
  const planeta = new THREE.SphereGeometry(15, 30, 25)
  const mesec = new THREE.Mesh(planeta, surface)
  return mesec
}

function praviMesecevuOrbitu(mesec, kamera_zemlja_mesec) {
  const meseceva_orbita = new THREE.Object3D()
  meseceva_orbita.add(mesec)
  mesec.position.set(0, 100, 0)
  meseceva_orbita.add(kamera_zemlja_mesec)
  kamera_zemlja_mesec.rotation.set(Math.PI / 2, 0, 0)
  return meseceva_orbita
}

function praviZvezde() {
  const gemetry = new THREE.Geometry()
  while (gemetry.vertices.length < 1e4) {
    const lat = Math.PI * Math.random() - Math.PI / 2
    const lon = 2 * Math.PI * Math.random()
    gemetry.vertices.push(new THREE.Vector3(1e5 * Math.cos(lon) * Math.cos(lat), 1e5 * Math.sin(lon) * Math.cos(lat), 1e5 * Math.sin(lat)))
  }
  const material = new THREE.PointsMaterial({size: 500})
  return new THREE.Points(gemetry, material)
}

function okreciPlanete() {
  vreme += brzina
  const brzina_zemlje = vreme * 0.001
  zemlja.position.set(250 * Math.cos(brzina_zemlje), 250 * Math.sin(brzina_zemlje), 0)
  const brzina_meseca = vreme * 0.02
  meseceva_orbita.rotation.set(0, 0, brzina_meseca)
}

function racunajUgao() {
  const y_razlika_zemlja_sunce = sunce.position.y - zemlja.position.y
  const x_razlika_zemlja_sunce = sunce.position.x - zemlja.position.x
  const ugao_zemlja_sunce = Math.atan2(x_razlika_zemlja_sunce, y_razlika_zemlja_sunce)
  kamera_zemlja_sunce.rotation.set(Math.PI / 2, -ugao_zemlja_sunce, 0)
  kamera_zemlja_sunce.position.set(zemlja.position.x, zemlja.position.y, 22)
}

/* LOOP */

void function animiraj() {
  requestAnimationFrame(animiraj)
  renderer.render(scene, defaultCamera)
  if (pauza) return
  okreciPlanete()
  racunajUgao()
}()

/* EVENTS */

document.addEventListener('keydown', event => {
  const code = event.keyCode
  if (code == 81)  // Q
    defaultCamera = kamera_zemlja_sunce
  if (code == 87)  // W
    defaultCamera = kamera_zemlja_mesec
  if (code == 69)  // E
    defaultCamera = glavna_kamera
  if (code == 80)
    pauza = !pauza // P
  if (code == 49)
    brzina = 1 // 1
  if (code == 50)
    brzina = 2 // 2
  if (code == 51)
    brzina = 10 // 3
})
