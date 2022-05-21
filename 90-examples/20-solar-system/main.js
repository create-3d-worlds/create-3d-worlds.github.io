import * as THREE from '/node_modules/three108/build/three.module.js'
import { scene, renderer, addUIControls, createOrbitControls } from '/utils/scene.js'
import { createSimpleStars } from '/utils/particles.js'

createOrbitControls()

let time = 0,
  speed = 1,
  pause = false

const ratio = window.innerWidth / window.innerHeight
const mainCamera = new THREE.PerspectiveCamera(75, ratio, 1, 1e6)
const earthCameraSun = new THREE.PerspectiveCamera(75, ratio, 1, 1e6)
const earthCameraMoon = new THREE.PerspectiveCamera(75, ratio, 1, 1e6)
let defaultCamera = mainCamera

mainCamera.position.z = 1000
scene.add(mainCamera)

const sun = createSun()
scene.add(sun)

const earth = createEarth()
const earthGroup = createEarthGroup(earth, earthCameraSun)
sun.add(earthGroup)

const moon = createMoon()
const moonGroup = createMoonGroup(moon, earthCameraMoon)
earth.add(moonGroup)

scene.add(createSimpleStars())

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
  const geometry = new THREE.SphereGeometry(20, 20, 64)
  return new THREE.Mesh(geometry, material)
}

function createEarthGroup(earth, earthCameraSun) {
  const group = new THREE.Group()
  group.add(earth)
  earth.position.set(250, 0, 0)
  group.add(earthCameraSun)
  return group
}

function createMoon() {
  const material = new THREE.MeshBasicMaterial({ color: 0xffffff })
  const geometry = new THREE.SphereGeometry(15, 30, 25)
  const moon = new THREE.Mesh(geometry, material)
  return moon
}

function createMoonGroup(moon, earthCameraMoon) {
  const group = new THREE.Group()
  group.add(moon)
  moon.position.set(0, 100, 0)
  group.add(earthCameraMoon)
  earthCameraMoon.rotation.set(Math.PI / 2, 0, 0)
  return group
}

function orbit() {
  time += speed
  const earthSpeed = time * 0.001
  earth.position.set(250 * Math.cos(earthSpeed), 250 * Math.sin(earthSpeed), 0)
  const moonSpeed = time * 0.02
  moonGroup.rotation.set(0, 0, moonSpeed)
}

function updateCamera() {
  const angle = Math.atan2(sun.position.x - earth.position.x, sun.position.y - earth.position.y)
  earthCameraSun.rotation.set(Math.PI / 2, -angle, 0)
  earthCameraSun.position.set(earth.position.x, earth.position.y, 22)
}

/* LOOP */

void function update() {
  requestAnimationFrame(update)
  renderer.render(scene, defaultCamera)
  if (pause) return
  orbit()
  updateCamera()
}()

/* EVENTS */

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
