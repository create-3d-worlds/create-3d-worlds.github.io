import * as THREE from '/node_modules/three108/build/three.module.js'
import {randomInRange, randomColor} from './helpers.js'
const loader = new THREE.TextureLoader()

export function createGround({ r = 4000, color = 0x509f53, file } = {}) {
  const options = {
    side: THREE.DoubleSide // for debugin
  }
  if (file) {
    const texture = loader.load(`/assets/textures/${file}`)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(r / 10, r / 10)
    options.map = texture
  } else
    options.color = color

  const geometry = new THREE.CircleGeometry(r, 32)
  geometry.rotateX(-Math.PI / 2)
  const material = new THREE.MeshLambertMaterial(options)
  const mesh = new THREE.Mesh(geometry, material)
  mesh.receiveShadow = true
  return mesh
}

// TODO: add color param
export function createTerrain(size = 1000, segments = 50) {
  const geometry = new THREE.PlaneGeometry(size, size, segments, segments)
  geometry.rotateX(- Math.PI / 2)
  geometry.vertices.forEach(vertex => {
    vertex.x += randomInRange(-10, 10)
    vertex.y += randomInRange(-5, 15)
    vertex.z += randomInRange(-10, 10)
  })
  geometry.faces.forEach(face => {
    face.vertexColors.push(randomColor(), randomColor(), randomColor())
  })
  const material = new THREE.MeshLambertMaterial({ vertexColors: THREE.VertexColors })
  const mesh = new THREE.Mesh(geometry, material)
  mesh.receiveShadow = true
  return mesh
}

export function createWater(size = 1000, opacity = 0.75, file) {
  const geometry = new THREE.PlaneGeometry(size, size, 1, 1)
  geometry.rotateX(-Math.PI / 2)
  const material = new THREE.MeshLambertMaterial({
    transparent: true,
    opacity
  })
  if (file) {
    const texture = loader.load(`/assets/textures/${file}`)
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(5, 5)
    material.map = texture
  } else
    material.color.setHex(0x6699ff)

  const mesh = new THREE.Mesh(geometry, material)
  mesh.receiveShadow = true
  return mesh
}
