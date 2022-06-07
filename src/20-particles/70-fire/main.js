import * as THREE from '/node_modules/three127/build/three.module.js'
import { scene, camera, renderer } from '/utils/scene.js'
import { Fire } from './Fire.js'
import { candle, campfire, torch } from './params.js'

camera.position.z = 25
scene.background = new THREE.Color(0x000000)

const plane = new THREE.PlaneBufferGeometry(20, 20)
const fire = new Fire(plane, {
  ...torch,
  textureWidth: 512,
  textureHeight: 512,
})
fire.position.z = - 2
scene.add(fire)

fire.clearSources()
fire.addSource(0.5, 0.1, 0.1, 1.0, 0.0, 1.0)

void function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}()