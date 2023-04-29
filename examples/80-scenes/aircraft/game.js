import * as THREE from 'three'
import { scene, renderer, camera, clock } from '/utils/scene.js'
import { createSun } from '/utils/light.js'
import { loadModel } from '/utils/loaders.js'
import { createGround, rotateGround } from '/utils/terrain/cylinder-ground.js'
import Aircraft from './Aircraft.js'

camera.position.set(-68, 143, -90)

scene.fog = new THREE.Fog(0xE5C5AB, 200, 950)
scene.add(new THREE.HemisphereLight(0xD7D2D2, 0x302B2F, .25))
scene.add(createSun({ pos: [50, 250, 50] }))

const ground = createGround({ r: 3000, color: 0x91A566 })

const mesh = await loadModel({ file: '/aircraft/messerschmitt-bf-109/scene.gltf', size: 20 })
const aircraft = new Aircraft({ mesh })

scene.add(aircraft.mesh, ground)

/* LOOP */

void function update() {
  requestAnimationFrame(update)
  const delta = clock.getDelta()

  rotateGround(ground)
  aircraft.update(delta)
  camera.lookAt(mesh.position)

  renderer.render(scene, camera)
}()
