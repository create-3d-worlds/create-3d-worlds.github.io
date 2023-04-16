import * as THREE from 'three'
import { createSphere } from '/utils/geometry.js'
import { sample, similarColor } from '/utils/helpers.js'

import { material as fractalMaterial } from '/utils/shaders/fractal-planet.js'
import { material as fireMaterial } from '/utils/shaders/fireball.js'
import { material as lavaMaterial } from '/utils/shaders/lava.js'

const { randFloat } = THREE.MathUtils

const textureLoader = new THREE.TextureLoader()
textureLoader.setPath('/assets/textures/planets/')

const textures = ['jupiter.jpg', 'saturn.jpg', 'venus.jpg', 'mars.jpg']
const materials = [fractalMaterial, fireMaterial, lavaMaterial]

/* EARTH */

export function createEarth({ r = 15, segments = 64 } = {}) {
  const map = textureLoader.load('earthmap4k.jpg') // max width is 4096
  const bumpMap = textureLoader.load('earthbump4k.jpg')
  const specularMap = textureLoader.load('earthspec4k.jpg')
  const material = new THREE.MeshPhongMaterial({ map, specularMap, bumpMap, displacementMap: bumpMap, displacementScale: 1.75 })

  const geometry = new THREE.SphereGeometry(r, segments, segments)
  const mesh = new THREE.Mesh(geometry, material)
  mesh.castShadow = mesh.receiveShadow = true
  return mesh
}

/* MOON */

export const createMoon = ({ r = 2, segments = 32 } = {}) =>
  createSphere({ r, segments, file: 'planets/moon.jpg' })

/* SATURN */

function createRing(radius, tube, color) {
  const geometry = new THREE.TorusGeometry(radius, tube, 2, 35)
  const material = new THREE.MeshBasicMaterial({ color })
  const ring = new THREE.Mesh(geometry, material)
  ring.rotation.x = Math.PI * .5
  return ring
}

export function addRings(planet) {
  const r = planet.geometry.parameters.radius
  const colors = [0xDDBC77, 0x665E4E, 0x7C776B]
  const color = sample(colors)
  planet.add(createRing(r * 1.4, r * .24, similarColor(color, .33)))
  planet.add(createRing(r * 1.9, r * .24, similarColor(color, .33)))
  planet.add(createRing(r * 2.4, r * .24, similarColor(color, .33)))
  return planet
}

export function createSaturn({ r = 1 } = {}) {
  const planet = createSphere({ r, file: 'planets/saturn.jpg' }) // color: 0xDDBC77
  return addRings(planet)
}

/* JUPITER */

export const createJupiter = ({ r = 10, segments = 32 } = {}) =>
  createSphere({ r, segments, file: 'planets/jupiter.jpg' })

/* RANDOM PLANET */

function addMoon(planet, r) {
  const moon = createMoon({ r: r * .33 })
  moon.translateX(r * 2.5)
  planet.userData.moon = moon
  planet.add(moon)
}

/**
 * i = 0: fractal
 * i = 1: fire
 * i = 2: lava
 * i > 2: random texture
 */
export function createPlanet({ r = randFloat(2, 5), pos, i = 0 } = {}) {
  const file = `planets/${textures[i % textures.length]}`
  const planet = createSphere({ file, r })
  if (pos) planet.position.copy(pos)
  planet.userData.angleSpeed = randFloat(-1, 1)

  if (i < materials.length)
    planet.material = materials[i]
  else if (r > 3 && Math.abs(planet.userData.angleSpeed) > .5)
    addMoon(planet, r)
  else if (Math.random() > .75)
    addRings(planet)

  return planet
}

export class Planet {
  constructor(params) {
    this.mesh = createPlanet(params)
    this.time = 0
  }

  /* rotate planet and update shader animation */
  update(delta) {
    const { mesh } = this
    const { angleSpeed, moon } = mesh.userData

    mesh.rotateY(angleSpeed * delta)
    if (moon)
      moon.rotateY(angleSpeed * delta)

    if (mesh.material.uniforms)
      mesh.material.uniforms.time.value = this.time

    this.time += delta
  }
}

/* MOVE */

export function orbiting(planet, time, radiusX = 8, axis = 0, radiusZ = radiusX) {
  const x = Math.cos(time) * radiusX
  const z = Math.sin(time) * radiusZ

  switch (axis) {
    case 1:
      planet.position.x = x
      planet.position.y = z
      break
    case 2:
      planet.position.set(x, z, z)
      break
    case 3:
      planet.position.set(x, x, z)
      break
    default:
      planet.position.x = x
      planet.position.z = z
      break
  }
}

export function orbitAround({ moon, planet, time, radiusX = 8, axis = 0, radiusZ = radiusX }) {
  orbiting(moon, time, radiusX, axis, radiusZ)
  moon.position.x += planet.position.x
  moon.position.y = planet.position.y
  moon.position.z += planet.position.z
}