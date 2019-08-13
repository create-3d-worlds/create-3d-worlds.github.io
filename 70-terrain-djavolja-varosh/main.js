
import { scene, camera, renderer, createOrbitControls } from '../utils/three-scene.js'
import createDjavoljaVarosh from '../utils/createDjavoljaVarosh.js'

camera.position.set(100, 100, 100)
createOrbitControls()

const spotLight = new THREE.SpotLight(0xffffff)
spotLight.position.set(10, 300, 10)
scene.add(spotLight)

/* INIT */

scene.add(createDjavoljaVarosh())

void function render() {
  renderer.render(scene, camera)
  requestAnimationFrame(render)
}()
