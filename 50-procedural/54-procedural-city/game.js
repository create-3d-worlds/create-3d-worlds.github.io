// TODO: change roof color or texture
import * as THREE from '/node_modules/three/build/three.module.js'
import { scene, camera, renderer, clock, createOrbitControls } from '/utils/scene.js'
import { createFloor } from '/utils/floor.js'
import {randomInRange} from '/utils/helpers.js'

const size = 100

camera.position.set(80, 80, 80)
createOrbitControls()

scene.fog = new THREE.FogExp2(0xd0e0f0, 0.0025)
scene.add(createFloor(size * 2, null, 0x101018))

const texture = new THREE.Texture(generateTexture())
texture.needsUpdate = true

for (let i = 0; i < size * 2; i++) {
  const building = generateBuilding()
  scene.add(building)
}

/* FUNCTIONS */

function generateTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 32
  canvas.height = 64
  const context = canvas.getContext('2d')
  context.fillStyle = '#ffffff'
  context.fillRect(0, 0, canvas.width, canvas.height)
  for (let y = 2; y < canvas.height; y += 2)
    for (let x = 0; x < canvas.width; x += 2) {
      const value = Math.floor(Math.random() * canvas.height)
      context.fillStyle = `rgb(${value}, ${value}, ${value})`
      context.fillRect(x, y, 2, 1)
    }
  return canvas
}

function generateBuilding() {
  const geometry = new THREE.CubeGeometry(1, 1, 1)
  geometry.faces.splice(6, 2) // remove floor for optimization
  const material = new THREE.MeshLambertMaterial({map: texture})
  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.set(randomInRange(-size, size), 0, randomInRange(-size, size))
  mesh.rotation.y = Math.random()
  mesh.scale.x = mesh.scale.z = randomInRange(10, 20)
  mesh.scale.y = (Math.random() * Math.random() * Math.random() * mesh.scale.x) * 8 + 8
  return mesh
}

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}()
