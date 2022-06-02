import * as THREE from '/node_modules/three125/build/three.module.js'
import { scene, camera, renderer, createOrbitControls } from '/utils/scene.js'
import createDjavoljaVarosh from '/utils/ground/createDjavoljaVarosh.js'

camera.position.set(150, 150, 150)
createOrbitControls()

const spotLight = new THREE.SpotLight(0xffffff)
spotLight.position.set(10, 300, 10)
scene.add(spotLight)

scene.add(createDjavoljaVarosh())

/* LOOP */

void function render() {
  renderer.render(scene, camera)
  requestAnimationFrame(render)
}()
