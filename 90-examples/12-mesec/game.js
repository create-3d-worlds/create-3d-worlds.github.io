import * as THREE from '/node_modules/three108/build/three.module.js'
import { camera, scene, renderer, clock } from '/utils/scene.js'

camera.position.z = 8

const root = new THREE.Object3D

let light = new THREE.DirectionalLight(0xffffff, 2)
light.position.set(.5, 0, 1)
root.add(light)
light = new THREE.AmbientLight(0) // 0x222222 );
root.add(light)

const group = new THREE.Object3D
root.add(group)

const textureLoader = new THREE.TextureLoader()
const map = textureLoader.load('textures/moon_1024.jpg')
const bumpMap = textureLoader.load('textures/cloud.png')
const material = new THREE.MeshPhongMaterial({ map, bumpMap })

const geometry = new THREE.SphereGeometry(2, 20, 20)
const mesh = new THREE.Mesh(geometry, material)
mesh.visible = true
group.add(mesh)

scene.add(root)

/* LOOP */

void function run() {
  requestAnimationFrame(run)
  const dt = clock.getDelta()
  group.rotation.y += dt / 10 // rotate sphere group
  renderer.render(scene, camera)
}()
