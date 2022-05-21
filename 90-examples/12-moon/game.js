import * as THREE from '/node_modules/three119/build/three.module.js'
import { camera, scene, renderer, clock, createOrbitControls } from '/utils/scene.js'

const textureLoader = new THREE.TextureLoader()

const controls = createOrbitControls()
camera.position.z = 8

const group = new THREE.Group()

let light = new THREE.DirectionalLight(0xffffff, 2)
light.position.set(.5, 0, 1)
group.add(light)
light = new THREE.AmbientLight(0) // 0x222222 );
group.add(light)

const map = textureLoader.load('textures/moon_1024.jpg')
const bumpMap = textureLoader.load('textures/cloud.png')
const material = new THREE.MeshPhongMaterial({ map, bumpMap })
const geometry = new THREE.SphereGeometry(2, 20, 20)
const mesh = new THREE.Mesh(geometry, material)

group.add(mesh)
scene.add(group)

/* LOOP */

void function run() {
  requestAnimationFrame(run)
  const dt = clock.getDelta()
  mesh.rotation.y += dt / 10
  controls.update()
  renderer.render(scene, camera)
}()
