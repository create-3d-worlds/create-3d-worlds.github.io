import * as THREE from '../node_modules/three/src/Three.js'
import {scene, controls, renderer, camera, loader} from './scene.js'
// import model from '../maps/small-map.js'

// console.table(model)

function createCube() {
  const crateTexture = loader.load('../assets/textures/crate.gif')
  const geometry = new THREE.BoxGeometry(1, 1, 1)
  const material = new THREE.MeshBasicMaterial({ map: crateTexture })
  const cube = new THREE.Mesh(geometry, material)
  cube.position.y = 0.5
  return cube
}

function createFloor() {
  const moonTexture = loader.load('../assets/textures/moon.jpg')
  const floorMaterial = new THREE.MeshBasicMaterial({
    side: THREE.DoubleSide,
    map: moonTexture
  })
  const floorGeometry = new THREE.PlaneGeometry(100, 100)
  const floor = new THREE.Mesh(floorGeometry, floorMaterial)
  floor.rotation.x = Math.PI / 2
  return floor
}

scene.add(createCube())
scene.add(createFloor())

void function gameLoop() {
  requestAnimationFrame(gameLoop)
  controls.update()
  renderer.render(scene, camera)
}()
