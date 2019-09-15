import * as THREE from '/node_modules/three/build/three.module.js'
import {randomInRange} from '/utils/helpers.js'

const windowColor = night => {
  const value = randomInRange(0, 84, true)
  if (night) {
    const chance = Math.random()
    if (chance > .98) return `rgb(${value * 3}, ${value}, ${value})`
    if (chance > .9) return `rgb(${value * 2}, ${value * 2}, ${value})`
    if (chance > .85) return `rgb(${value * 2}, ${value * 2}, ${value * 2})`
  }
  return `rgb(${value}, ${value}, ${value})`
}

export function generateCityTexture(night) {
  const canvas = document.createElement('canvas')
  canvas.width = 32
  canvas.height = 64
  const context = canvas.getContext('2d')
  context.fillStyle = night ? '#000000' : '#ffffff'
  context.fillRect(0, 0, canvas.width, canvas.height)
  for (let y = 2; y < canvas.height; y += 2)
    for (let x = 0; x < canvas.width; x += 2) {
      context.fillStyle = windowColor(night)
      context.fillRect(x, y, 2, 1)
    }
  return canvas
}

export function generateBuilding(size, texture, night) {
  const geometry = new THREE.CubeGeometry(1, 1, 1)
  geometry.faces.splice(6, 2) // remove floor for optimization
  const num = night ? randomInRange(0, 30, true) : randomInRange(100, 256, true)
  const color = new THREE.Color(`rgb(${num}, ${num}, ${num})`) // random gray
  const materials = [
    new THREE.MeshLambertMaterial({ map: texture }),
    new THREE.MeshLambertMaterial({ map: texture }),
    new THREE.MeshLambertMaterial({ color }),
    new THREE.MeshLambertMaterial({ map: texture }),
    new THREE.MeshLambertMaterial({ map: texture }),
    new THREE.MeshLambertMaterial({ map: texture }),
  ]
  const mesh = new THREE.Mesh(geometry, materials)
  mesh.rotation.y = Math.random()
  mesh.scale.x = mesh.scale.z = randomInRange(10, 20)
  const scaleY = Math.random() * mesh.scale.x * 4 + 4
  mesh.scale.y = scaleY
  mesh.position.set(randomInRange(-size, size), scaleY / 2, randomInRange(-size, size))
  return mesh
}

export function generateCity(size = 100, night = true) {
  const texture = new THREE.Texture(generateCityTexture(night))
  texture.needsUpdate = true
  const group = new THREE.Group()
  for (let i = 0; i < size; i++)
    group.add(generateBuilding(size, texture, night))
  return group
}