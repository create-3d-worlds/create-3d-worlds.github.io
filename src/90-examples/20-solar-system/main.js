import * as THREE from '/node_modules/three119/build/three.module.js'
import { scene, renderer, addUIControls, createOrbitControls } from '/utils/scene.js'
import { createSimpleStars } from '/utils/particles.js'
import { createSimpleEarth, createSimpleMoon, createSimpleSun } from '/utils/planets.js'

createOrbitControls()

let time = 0,
  speed = 1,
  pause = false

const ratio = window.innerWidth / window.innerHeight
const mainCamera = new THREE.PerspectiveCamera(75, ratio, 1, 1e6)
const earthToSunCamera = new THREE.PerspectiveCamera(75, ratio, 1, 1e6)
const earthToMoonCamera = new THREE.PerspectiveCamera(75, ratio, 1, 1e6)
let defaultCamera = mainCamera

mainCamera.position.z = 1000
scene.add(mainCamera)

const sun = createSimpleSun({ r: 50 })
scene.add(sun)

const earth = createSimpleEarth({ r: 20 })
const earthGroup = createEarthGroup(earth, earthToSunCamera)
sun.add(earthGroup)

const moon = createSimpleMoon({ r: 15 })
const moonGroup = createMoonGroup(moon, earthToMoonCamera)
earth.add(moonGroup)

scene.add(createSimpleStars())

/* FUNCTIONS */

function createEarthGroup(earth, earthToSunCamera) {
  const group = new THREE.Group()
  group.add(earth)
  earth.position.set(250, 0, 0)
  group.add(earthToSunCamera)
  return group
}

function createMoonGroup(moon, earthToMoonCamera) {
  const group = new THREE.Group()
  group.add(moon)
  moon.position.set(0, 100, 0)
  group.add(earthToMoonCamera)
  earthToMoonCamera.rotation.set(Math.PI / 2, 0, 0)
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
  earthToSunCamera.rotation.set(Math.PI / 2, -angle, 0)
  earthToSunCamera.position.set(earth.position.x, earth.position.y, 22)
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
    defaultCamera = earthToSunCamera
  if (code == 87)  // W
    defaultCamera = earthToMoonCamera
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
  Q: 'earthToSunCamera',
  W: 'earthToMoonCamera',
  E: 'mainCamera',
  P: 'pause',
  1: 'speed 1',
  2: 'speed 2',
  3: 'speed 3',
}
addUIControls({ commands })
