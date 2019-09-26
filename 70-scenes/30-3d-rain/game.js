import { createFloor } from '/utils/floor.js'
import { randomMatrix } from '/utils/maps.js'
import { scene, renderer, camera, createOrbitControls } from '/utils/scene.js'
import Tilemap from '/classes/Tilemap.js'
import Rain from '/classes/rain/Rain.js'

createOrbitControls()

const map = new Tilemap(randomMatrix(), 100, { x: -500, z: -500 })

scene.add(createFloor())
scene.add(map.create3DMap())

const rain = new Rain()

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
  rain.update()
}()
