import * as THREE from '/node_modules/three108/build/three.module.js'
import {randomInRange, randomColor} from './helpers.js'
const loader = new THREE.TextureLoader()

// TODO: merge createGround and createFloor
export function createGround(size = 10000, file = 'ground.jpg', color = 0xffffff) {
  const options = {
    side: THREE.DoubleSide // for debugin
  }
  if (file) {
    const texture = loader.load(`/assets/textures/${file}`)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(size / 10, size / 10)
    options.map = texture
  } else
    options.color = color
  const geometry = new THREE.PlaneGeometry(size, size)
  const material = new THREE.MeshLambertMaterial(options)
  material.color.setHSL(0.095, 1, 0.75)

  const ground = new THREE.Mesh(geometry, material)
  ground.receiveShadow = true
  ground.rotateX(-Math.PI / 2)
  return ground
}

export function createFloor(r = 1000, file = 'ground.jpg', color = 0x60bf63) {
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
  const material = new THREE.MeshBasicMaterial(options)

  const mesh = new THREE.Mesh(geometry, material)
  mesh.receiveShadow = true
  return new THREE.Mesh(geometry, material)
}

export function createTerrain(width = 1000, height = 1000, widthSegments = 50, heightSegments = 50) {
  const geometry = new THREE.PlaneGeometry(width, height, widthSegments, heightSegments)
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
    const texture = loader.load(`/assets/textures/${file}`)
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(5, 5)
    material.map = texture
  } else
    material.color.setHex(0x6699ff)

  return new THREE.Mesh(geometry, material)
}
