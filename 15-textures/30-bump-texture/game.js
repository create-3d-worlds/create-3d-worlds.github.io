import * as THREE from '/node_modules/three119/build/three.module.js'
import { camera, scene, renderer } from '/utils/scene.js'
import { initLights } from '/utils/light.js'

const rotSpeed = 0.005
const bumpScale = 1
const loader = new THREE.TextureLoader()

camera.position.set(0, 10, 20)
camera.lookAt(scene.position)
initLights()

/* CUBE */

const geometry = new THREE.BoxGeometry(15, 15, 15)

const material = new THREE.MeshPhongMaterial()
material.map = loader.load('/assets/textures/bricks.jpg')
const cube = new THREE.Mesh(geometry, material)
cube.position.set(-13, 0, -5)
scene.add(cube)

const bumpMaterial = material.clone()
bumpMaterial.bumpMap = loader.load('/assets/textures/gray-bricks.jpg')
const bumpCube = new THREE.Mesh(geometry, bumpMaterial)
bumpCube.material.bumpScale = bumpScale
bumpCube.position.set(13, 0, -5)
scene.add(bumpCube)

/* LOOP */

void function render() {
  renderer.render(scene, camera)
  cube.rotation.y += rotSpeed
  bumpCube.rotation.y -= rotSpeed
  requestAnimationFrame(render)
}()
