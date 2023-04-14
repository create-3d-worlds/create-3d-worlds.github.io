import * as THREE from 'three'
import { createSphere } from '/utils/geometry.js'

const textureLoader = new THREE.TextureLoader()
textureLoader.setPath('/assets/textures/planets/')

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
  planet.add(createRing(r * 1.4, r * .2, 0x665E4E))
  planet.add(createRing(r * 1.9, r * .2, 0x7C776B))
  planet.add(createRing(r * 2.4, r * .2, 0x645F52))
  return planet
}

export function createSaturn({ r = 1 } = {}) {
  const planet = createSphere({ r, file: 'planets/saturn.jpg' }) // color: 0xDDBC77
  return addRings(planet)
}

/* JUPITER */

export const createJupiter = ({ r = 10, segments = 32 } = {}) =>
  createSphere({ r, segments, file: 'planets/jupiter.jpg' })

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