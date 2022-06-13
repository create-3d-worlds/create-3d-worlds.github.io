import { scene, camera, renderer, initLights, createOrbitControls, addUIControls } from '/utils/scene.js'
import { createGround } from '/utils/ground.js'
import keyboard from '/classes/Keyboard.js'
import { loadModel } from '/utils/loaders.js'

camera.position.set(1.5, 2.5, -6.5)
const controls = createOrbitControls()

renderer.setClearColor(0x63adef, 1.0)

const ground = createGround({ size: 50, color: 0x23ef13 })
scene.add(ground)

initLights()

const { mesh } = await loadModel({ file: 'building/medieval-house/house1-02.obj', mtl: 'building/medieval-house/house1-02.mtl', size: 12 })
scene.add(mesh)

addUIControls({ commands: {
  '1': 'inside',
  '2': 'outside',
}, title: 'Change camera' })

/* FUNCTIONS */

const updateCamera = () => {
  if (keyboard.pressed.Digit1) camera.position.set(1.5, 2.5, -6.5)
  if (keyboard.pressed.Digit2) camera.position.set(10, 20, 25)
}

/* LOOP */

void function update() {
  controls.update()
  updateCamera()
  requestAnimationFrame(update)
  renderer.render(scene, camera)
}()