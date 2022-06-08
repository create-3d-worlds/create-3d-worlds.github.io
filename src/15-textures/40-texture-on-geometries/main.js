import * as THREE from '/node_modules/three127/build/three.module.js'
import { camera, scene, renderer, createOrbitControls } from '/utils/scene.js'
import { createGround } from '/utils/ground.js'
import { createBarrel } from '/utils/geometry.js'
import { createCrate } from '/utils/geometry.js'
import { createMoon } from '/utils/planets.js'

createOrbitControls()

const light = new THREE.PointLight(0xffffff)
light.position.set(0, 15, 10)
scene.add(light)
const light2 = new THREE.AmbientLight(0x444444)
scene.add(light2)

/* GEOMETRIES */

const floor = createGround()
scene.add(floor)

const moon = createMoon({ r: .5 })
moon.position.set(-2, .5, 0)
scene.add(moon)

const crate = createCrate({ size: 1 })
crate.position.set(0, 0, 0)
scene.add(crate)

const cylinder = createBarrel({ r: .4, height: 1 })
cylinder.position.set(2, .5, 0)
scene.add(cylinder)

/* UPDATE */

void function update() {
  requestAnimationFrame(update)
  renderer.render(scene, camera)
}()
