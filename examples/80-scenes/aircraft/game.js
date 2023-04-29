import * as THREE from 'three'
import { scene, renderer, camera, clock } from '/utils/scene.js'
import { createSun } from '/utils/light.js'
import { createGround, rotateGround } from '/utils/terrain/cylinder-ground.js'
import Warplane from './Warplane.js'

camera.position.set(-68, 143, -90)

scene.fog = new THREE.Fog(0xE5C5AB, 200, 950)
scene.add(new THREE.HemisphereLight(0xD7D2D2, 0x302B2F, .25))
scene.add(createSun({ pos: [50, 250, 50] }))

const ground = createGround({ r: 3000, color: 0x91A566 })
const aircraft = new Warplane()

scene.add(aircraft.mesh, ground)

/* LOOP */

void function update() {
  requestAnimationFrame(update)
  const delta = clock.getDelta()

  rotateGround(ground)
  aircraft.update(delta)
  camera.lookAt(aircraft.mesh.position)

  renderer.render(scene, camera)
}()
