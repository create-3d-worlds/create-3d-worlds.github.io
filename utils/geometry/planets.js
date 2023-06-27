import * as THREE from 'three'
import { createSphere } from '/utils/geometry/index.js'
import { sample, similarColor } from '/utils/helpers.js'

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
