import * as THREE from '../node_modules/three/build/three.module.js'
import {randomInRange, randomColor} from './helpers.js'
const loader = new THREE.TextureLoader()

export function createFloor(r = 1000, file = 'ground.jpg', color = 0x60bf63) {
  const options = {
    side: THREE.DoubleSide // just for debugin
  }
  if (file) {
    const texture = loader.load(`../assets/textures/${file}`)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(r / 10, r / 10)
    options.map = texture
  } else
    options.color = color
  const material = new THREE.MeshBasicMaterial(options)
  const geometry = new THREE.CircleGeometry(r, 32)
  geometry.rotateX(-Math.PI / 2)
  return new THREE.Mesh(geometry, material)
}

export function createTerrain() {
  const geometry = new THREE.PlaneGeometry(1000, 1000, 50, 50)
  geometry.rotateX(- Math.PI / 2)
  geometry.vertices.forEach(vertex => {
    vertex.x += randomInRange(-10, 10)
    vertex.y += randomInRange(-5, 15)
    vertex.z += randomInRange(-10, 10)
  })
  geometry.faces.forEach(face => {
    face.vertexColors.push(randomColor(), randomColor(), randomColor())
  })
  const material = new THREE.MeshBasicMaterial({ vertexColors: THREE.VertexColors })
  return new THREE.Mesh(geometry, material)
}

export function createWater(size = 1000, opacity = 0.75, file) {
  const geometry = new THREE.PlaneGeometry(size, size, 1, 1)
  geometry.rotateX(-Math.PI / 2)
  const material = new THREE.MeshBasicMaterial({
    transparent: true,
    opacity
  })
  if (file) {
    const texture = loader.load(`../assets/textures/${file}`)
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(5, 5)
    material.map = texture
  } else
    material.color.setHex(0x6699ff)

  return new THREE.Mesh(geometry, material)
}
