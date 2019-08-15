
import { scene, camera, renderer, createOrbitControls } from '../utils/three-scene.js'
import createDjavoljaVarosh from '../utils/createDjavoljaVarosh.js'

camera.position.set(150, 150, 150)
createOrbitControls()

const spotLight = new THREE.SpotLight(0xffffff)
spotLight.position.set(10, 300, 10)
scene.add(spotLight)

scene.add(createDjavoljaVarosh())

/* INIT */

void function render() {
  renderer.render(scene, camera)
  requestAnimationFrame(render)
}()
