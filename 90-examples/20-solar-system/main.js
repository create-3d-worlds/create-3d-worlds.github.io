import * as THREE from '/node_modules/three108/build/three.module.js'
import { scene, renderer, addUIControls } from '/utils/scene.js'

// TODO: dodati UI kontrole

let time = 0,
  speed = 1,
  pause = false

const ratio = window.innerWidth / window.innerHeight
const mainCamera = new THREE.PerspectiveCamera(75, ratio, 1, 1e6)
const earthCameraSun = new THREE.PerspectiveCamera(75, ratio, 1, 1e6)
const earthCameraMoon = new THREE.PerspectiveCamera(75, ratio, 1, 1e6)

mainCamera.position.z = 1000
scene.add(mainCamera)
let defaultCamera = mainCamera

const ambient = new THREE.AmbientLight(0xffffff)
scene.add(ambient)

const sun = createSun()
scene.add(sun)

const earth = createEarth()
const earthOrbit = createEarthOrbit(earth, earthCameraSun)
sun.add(earthOrbit)

const moon = createMoon()
const moonOrbit = createMoonOrbit(moon, earthCameraMoon)
earth.add(moonOrbit)

scene.add(createStars())

/* FUNCTIONS */

function createSun() {
  const material = new THREE.MeshBasicMaterial({ color: 0xFFD700 })
  const geometry = new THREE.SphereGeometry(50, 28, 21)
  const sun = new THREE.Mesh(geometry, material)
  const sunLight = new THREE.PointLight(0xffffff, 5, 1000)
  sun.add(sunLight)
  return sun
}

function createEarth() {
  const material = new THREE.MeshBasicMaterial({ color: 0x0000cd })
  const geometry = new THREE.SphereGeometry(20, 20, 32)
  return new THREE.Mesh(geometry, material)
}

function createEarthOrbit(earth, earthCameraSun) {
  const earthOrbit = new THREE.Object3D()
  earthOrbit.add(earth)
  earth.position.set(250, 0, 0)
  // earthCameraSun.rotation.set(Math.PI / 2, 0, 0)
  earthOrbit.add(earthCameraSun)
  return earthOrbit
}

function createMoon() {
  const material = new THREE.MeshBasicMaterial({ color: 0xffffff })
  const geometry = new THREE.SphereGeometry(15, 30, 25)
  const moon = new THREE.Mesh(geometry, material)
  return moon
}

function createMoonOrbit(moon, earthCameraMoon) {
  const moonOrbit = new THREE.Object3D()
  moonOrbit.add(moon)
  moon.position.set(0, 100, 0)
  moonOrbit.add(earthCameraMoon)
  earthCameraMoon.rotation.set(Math.PI / 2, 0, 0)
  return moonOrbit
}

function createStars() {
  const geometry = new THREE.Geometry()
  while (geometry.vertices.length < 1e4) {
    const lat = Math.PI * Math.random() - Math.PI / 2
    const lon = 2 * Math.PI * Math.random()
    geometry.vertices.push(new THREE.Vector3(1e5 * Math.cos(lon) * Math.cos(lat), 1e5 * Math.sin(lon) * Math.cos(lat), 1e5 * Math.sin(lat)))
  }
  const material = new THREE.PointsMaterial({ size: 500 })
  return new THREE.Points(geometry, material)
}

function orbitPlanets() {
  time += speed
  const earthSpeed = time * 0.001
  earth.position.set(250 * Math.cos(earthSpeed), 250 * Math.sin(earthSpeed), 0)
  const moonSpeed = time * 0.02
  moonOrbit.rotation.set(0, 0, moonSpeed)
}

function updateCamera() {
  const angle = Math.atan2(sun.position.x - earth.position.x, sun.position.y - earth.position.y)
  earthCameraSun.rotation.set(Math.PI / 2, -angle, 0)
  earthCameraSun.position.set(earth.position.x, earth.position.y, 22)
}

/* LOOP */

void function animiraj() {
  requestAnimationFrame(animiraj)
  renderer.render(scene, defaultCamera)
  if (pause) return
  orbitPlanets()
  updateCamera()
}()

/* EVENTS */

const commands = {
  Q: 'earthCameraSun',
  W: 'earthCameraMoon',
  E: 'mainCamera',
  P: 'pause',
  1: 'speed 1',
  2: 'speed 2',
  3: 'speed 3',
}
addUIControls({ commands })

document.addEventListener('keydown', event => {
  const code = event.keyCode
  if (code == 81)  // Q
    defaultCamera = earthCameraSun
  if (code == 87)  // W
    defaultCamera = earthCameraMoon
  if (code == 69)  // E
    defaultCamera = mainCamera
  if (code == 80)
    pause = !pause // P
  if (code == 49)
    speed = 1 // 1
  if (code == 50)
    speed = 2 // 2
  if (code == 51)
    speed = 10 // 3
})
