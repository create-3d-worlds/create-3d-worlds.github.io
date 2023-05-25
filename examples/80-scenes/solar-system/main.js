import * as THREE from 'three'
import { scene, renderer, addUIControls, createOrbitControls } from '/utils/scene.js'
import { createSphere } from '/utils/geometry.js'
import { createEarth, orbiting } from '/utils/geometry/planets.js'
import { createSun } from '/utils/light.js'
import { Stars } from '/utils/Particles.js'

createOrbitControls()
renderer.setClearColor(0x000000)

let time = 0
let speed = 1
let pause = false

const ratio = window.innerWidth / window.innerHeight
const universalCamera = new THREE.PerspectiveCamera(75, ratio, 1, 1e6)
const earthToSunCamera = new THREE.PerspectiveCamera(75, ratio, 1, 1e6)
const earthToMoonCamera = new THREE.PerspectiveCamera(75, ratio, 1, 1e6)
let defaultCamera = universalCamera

universalCamera.position.z = 1000
scene.add(universalCamera)

const sun = createSun({ r: 50, file: 'planets/sun.jpg' })
scene.add(sun)

const earth = createEarth({ r: 20 })
earth.position.set(250, 0, 0)
const earthGroup = createEarthGroup(earth, earthToSunCamera)
sun.add(earthGroup)

const moon = createSphere({ r: 15, file: 'planets/moon.jpg' })
moon.rotateZ(Math.PI / 2)
moon.position.set(0, 100, 0)
const moonGroup = createMoonGroup(moon, earthToMoonCamera)
earth.add(moonGroup)

const stars = new Stars()
scene.add(stars.mesh)

/* FUNCTIONS */

function createEarthGroup(earth, earthToSunCamera) {
  const group = new THREE.Group()
  group.add(earth)
  group.add(earthToSunCamera)
  return group
}

function createMoonGroup(moon, earthToMoonCamera) {
  const group = new THREE.Group()
  group.add(moon)
  group.add(earthToMoonCamera)
  earthToMoonCamera.rotation.set(Math.PI / 2, 0, 0)
  return group
}

function updatePlanets() {
  time += speed
  orbiting(earth, time * 0.001, 250, 1)
  moonGroup.rotation.set(0, 0, time * 0.02)
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
  updatePlanets()
  updateCamera()
}()

/* EVENTS */

document.addEventListener('keydown', event => {
  switch (event.code) {
    case 'KeyQ': defaultCamera = earthToSunCamera; break
    case 'KeyW': defaultCamera = earthToMoonCamera; break
    case 'KeyE': defaultCamera = universalCamera; break
    case 'KeyP': pause = !pause; break
    case 'Digit1': speed = 1; break
    case 'Digit2': speed = 2; break
  }
})

const commands = {
  Q: 'Earth to Sun camera',
  W: 'Earth to Moon camera',
  E: 'Universal camera',
  P: 'pause',
  1: 'speed 1',
  2: 'speed 2',
}
addUIControls({ commands })
