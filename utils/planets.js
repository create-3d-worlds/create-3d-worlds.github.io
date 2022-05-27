import * as THREE from '/node_modules/three119/build/three.module.js'

const textureLoader = new THREE.TextureLoader()

/* TEXTURED EARTH */

export function createEarth({ r = 15, segments = 60 } = {}) {
  // 4096 is the maximum width for maps
  const map = textureLoader.load('/assets/textures/earth/earthmap4k.jpg')
  const bumpMap = textureLoader.load('/assets/textures/earth/earthbump4k.jpg')
  const specularMap = textureLoader.load('/assets/textures/earth/earthspec4k.jpg')
  const material = new THREE.MeshPhongMaterial({ map, specularMap, bumpMap })

  const geometry = new THREE.SphereGeometry(r, segments, segments)
  const earth = new THREE.Mesh(geometry, material)
  earth.name = 'earth'
  return earth
}

export function createEarthClouds({ r = 15.2, segments = 60 } = {}) {
  const map = textureLoader.load('/assets/textures/earth/fair_clouds_4k.png')
  const material = new THREE.MeshPhongMaterial({ map, transparent: true })

  const geometry = new THREE.SphereGeometry(r, segments, segments)
  const clouds = new THREE.Mesh(geometry, material)
  clouds.name = 'clouds'
  return clouds
}

/* TEXTURED MOON */

export function createMoon({ r = 2, segments = 20 } = {}) {
  const map = textureLoader.load('textures/moon_1024.jpg')
  const bumpMap = textureLoader.load('textures/cloud.png')
  const material = new THREE.MeshPhongMaterial({ map, bumpMap })
  const geometry = new THREE.SphereGeometry(r, segments, segments)
  const mesh = new THREE.Mesh(geometry, material)
  return mesh
}

/* SIMPLE */

export function createSimpleEarth({ r = 20, segments = 64 } = {}) {
  const material = new THREE.MeshBasicMaterial({ color: 0x0000cd })
  const geometry = new THREE.SphereGeometry(r, segments, segments)
  return new THREE.Mesh(geometry, material)
}

export function createSimpleMoon({ r = 15, segments = 32 } = {}) {
  const material = new THREE.MeshBasicMaterial({ color: 0xffffff })
  const geometry = new THREE.SphereGeometry(r, segments, segments)
  const moon = new THREE.Mesh(geometry, material)
  return moon
}

export function createSimpleSun({ r = 50, segments = 32 } = {}) {
  const material = new THREE.MeshBasicMaterial({ color: 0xFFD700 })
  const geometry = new THREE.SphereGeometry(r, segments, segments)
  const sun = new THREE.Mesh(geometry, material)
  const sunLight = new THREE.PointLight(0xffffff, 5, 1000)
  sun.add(sunLight)
  return sun
}
