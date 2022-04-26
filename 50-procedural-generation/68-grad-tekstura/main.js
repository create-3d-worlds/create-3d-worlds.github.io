import * as THREE from '/node_modules/three108/build/three.module.js'
import { scene, camera, renderer, createOrbitControls, addLights } from '/utils/scene.js'
import { createFloor } from '/utils/helpers.js'
import { createCity } from '/utils/city.js'

const size = 2000
const numBuildings = 10000

addLights()
const controls = createOrbitControls()
camera.position.set(0, 100, 400)
camera.lookAt(new THREE.Vector3(0, 100, 0))

scene.fog = new THREE.FogExp2(0xd0e0f0, 0.0025)
renderer.setClearColor(0x7ec0ee)

scene.add(createFloor({ size, circle: false }))
scene.add(createCity({ numBuildings, size, circle: false, rotateEvery: 2, enlargeEvery: 10, addTexture: true, addWindows: false, colorParams: { colorful: .035, max: 1 } }))

/* INIT */

void function animate() {
  requestAnimationFrame(animate)
  controls.update()
  renderer.render(scene, camera)
}()
