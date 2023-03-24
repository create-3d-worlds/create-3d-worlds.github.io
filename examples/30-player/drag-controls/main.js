import * as THREE from 'three'
import { DragControls } from '/node_modules/three/examples/jsm/controls/DragControls.js'
import { camera, scene, renderer } from '/utils/scene.js'
import { createCrate } from '/utils/geometry.js'

const { randInt } = THREE.MathUtils

const light = new THREE.AmbientLight(0xffffff)
scene.add(light)

camera.position.z = 600

const objects = []
for (let i = 0; i < 200; i ++) {
  const object = createCrate({ size: 40 })

  object.position.x = randInt(-500, 500)
  object.position.y = randInt(-300, 300)
  object.position.z = randInt(-400, 400)

  scene.add(object)
  objects.push(object)
}

new DragControls(objects, camera, renderer.domElement)

/* LOOP */

void function render() {
  requestAnimationFrame(render)
  renderer.render(scene, camera)
}()
