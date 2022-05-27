import * as THREE from '/node_modules/three119/build/three.module.js'

const textureLoader = new THREE.TextureLoader()

export function createEarth() {
  // 4096 is the maximum width for maps
  const map = textureLoader.load('/assets/textures/earth/earthmap4k.jpg')
  const bumpMap = textureLoader.load('/assets/textures/earth/earthbump4k.jpg')
  const specularMap = textureLoader.load('/assets/textures/earth/earthspec4k.jpg')
  const material = new THREE.MeshPhongMaterial({ map, specularMap, bumpMap })

  const geometry = new THREE.SphereGeometry(15, 60, 60)
  const earth = new THREE.Mesh(geometry, material)
  earth.name = 'earth'
  return earth
}

export function createEarthClouds() {
  const map = textureLoader.load('/assets/textures/earth/fair_clouds_4k.png')
  const material = new THREE.MeshPhongMaterial({ map, transparent: true })

  const geometry = new THREE.SphereGeometry(15.2, 60, 60)
  const clouds = new THREE.Mesh(geometry, material)
  clouds.name = 'clouds'
  return clouds
}