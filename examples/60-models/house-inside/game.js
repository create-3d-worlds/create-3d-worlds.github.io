import { scene, camera, renderer, createOrbitControls } from '/utils/scene.js'
import { createGround } from '/utils/ground.js'
import input from '/utils/io/Keyboard.js'
import { loadModel } from '/utils/loaders.js'
import { createSun } from '/utils/light.js'
import GUI from '/utils/io/GUI.js'

camera.position.set(1.5, 2.5, -6.5)
const controls = await createOrbitControls()

renderer.setClearColor(0x63adef, 1.0)

const ground = createGround({ size: 50, color: 0x23ef13 })
scene.add(ground)

scene.add(createSun())

const mesh = await loadModel({ file: 'building/house/medieval/house1-02.obj', mtl: 'building/house/medieval/house1-02.mtl', size: 12 })
scene.add(mesh)

new GUI({ controls: {
  '1': 'inside',
  '2': 'outside',
}, controlsTitle: 'CAMERA CONTROLS', scoreTitle: '', controlsOpen: true })

/* FUNCTIONS */

const updateCamera = () => {
  if (input.pressed.Digit1) camera.position.set(1.5, 2.5, -6.5)
  if (input.pressed.Digit2) camera.position.set(10, 20, 25)
}

/* LOOP */

void function update() {
  controls.update()
  updateCamera()
  requestAnimationFrame(update)
  renderer.render(scene, camera)
}()