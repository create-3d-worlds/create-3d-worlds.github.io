import { scene, camera, renderer, createOrbitControls } from '/core/scene.js'
import { createGround } from '/core/ground.js'
import { keyboard } from '/core/io/Keyboard.js'
import { loadModel } from '/core/loaders.js'
import { createSun } from '/core/light.js'
import GUI from '/core/io/GUI.js'

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
}, controlsTitle: 'CAMERA CONTROLS', useBaseControls: false, scoreTitle: '', controlsOpen: true })

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