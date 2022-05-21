import { scene, camera, renderer, createOrbitControls } from '/utils/scene.js'
import Rain from '/classes/nature/Rain.js'

const size = 500
const dropsNum = 1000

createOrbitControls()

const rain = new Rain({ size, dropsNum })
scene.add(...rain.drops)

/* LOOP */

void function render() {
  requestAnimationFrame(render)
  rain.update()
  renderer.render(scene, camera)
}()
