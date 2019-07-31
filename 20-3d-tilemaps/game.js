import * as THREE from '../node_modules/three/src/Three.js'
import {scene, controls, renderer, camera, loader} from './scene.js'
import model from '../maps/small-map.js'

function createCube(y, x) {
  const crateTexture = loader.load('../assets/textures/crate.gif')
  const geometry = new THREE.BoxGeometry(1, 1, 1)
  const material = new THREE.MeshBasicMaterial({ map: crateTexture })
  const cube = new THREE.Mesh(geometry, material)
  cube.position.y = 0.5
  cube.position.z = y
  cube.position.x = x
  return cube
}

function createFloor() {
  const texture = loader.load('../assets/textures/moon.jpg')
  const floorMaterial = new THREE.MeshBasicMaterial({
    side: THREE.DoubleSide,
    map: texture
  })
  const floorGeometry = new THREE.PlaneGeometry(100, 100)
  const floor = new THREE.Mesh(floorGeometry, floorMaterial)
  floor.rotation.x = Math.PI / 2
  return floor
}

for (let y = 0; y < model.length; y++)
  for (let x = 0; x < model.length; x++)
    if (model[y][x]) scene.add(createCube(y, x))

scene.add(createFloor())

void function gameLoop() {
  requestAnimationFrame(gameLoop)
  controls.update()
  renderer.render(scene, camera)
}()
