import * as THREE from '/node_modules/three108/build/three.module.js'
import {camera, scene, renderer} from '/utils/scene.js'

const rotSpeed = 0.005
const bumpScale = 1

camera.position.set(0, 10, 20)
camera.lookAt(scene.position)

const dirLight = new THREE.DirectionalLight(0xffffff)
dirLight.position.set(20, 20, 20)
scene.add(dirLight)

const dirLight2 = new THREE.DirectionalLight(0xffffff)
dirLight2.position.set(-20, 20, 20)
scene.add(dirLight2)

/* CUBE */

const geometry = new THREE.BoxGeometry(15, 15, 15)

const material = new THREE.MeshPhongMaterial()
material.map = THREE.ImageUtils.loadTexture('/assets/textures/bricks.jpg')
const cube = new THREE.Mesh(geometry, material)
cube.position.set(-13, 0, -5)
scene.add(cube)

const bumpMaterial = material.clone()
bumpMaterial.bumpMap = THREE.ImageUtils.loadTexture('/assets/textures/gray-bricks.jpg')
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
