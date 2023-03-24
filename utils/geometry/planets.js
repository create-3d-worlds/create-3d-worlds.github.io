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

/* SUN */

export function createSun({ r = 50, segments = 32 } = {}) {
  const mesh = createSphere({ r, segments, color: 0xFFD700, file: 'planets/sun.jpg' })
  mesh.geometry.rotateX(Math.PI / 2)

  const sunLight = new THREE.PointLight(0xffffff, 5, 1000)
  mesh.add(sunLight)
  addGlow(mesh, r * 3)

  return mesh
}

function addGlow(sun, distance = 50) {
  const intensity = 5
  const angle = Math.PI / 7

  for (let i = 0; i < 6; i++) {
    const spotlight = new THREE.SpotLight(0xFFFFFF, intensity, distance, angle)
    const pos = i % 2 ? -distance : distance
    const x = i < 2 ? pos : 0
    const y = i >= 2 && i < 4 ? pos : 0
    const z = i >= 4 ? pos : 0
    spotlight.position.set(x, y, z)
    sun.add(spotlight)
  }
}

/* SATURN */

function createRing(radius, tube, color) {
  const geometry = new THREE.TorusGeometry(radius, tube, 2, 35)
  const material = new THREE.MeshBasicMaterial({ color })
  const ring = new THREE.Mesh(geometry, material)
  ring.rotation.x = Math.PI * .5
  return ring
}

export function createSaturn() {
  const group = new THREE.Group()
  group.add(createSphere({ file: 'planets/saturn.jpg' })) // color: 0xDDBC77
  group.add(createRing(1.4, .2, 0x665E4E))
  group.add(createRing(1.9, .2, 0x7C776B))
  group.add(createRing(2.4, .2, 0x645F52))
  return group
}

/* JUPITER */

export const createJupiter = ({ r = 10, segments = 32 } = {}) =>
  createSphere({ r, segments, file: 'planets/jupiter.jpg' })
