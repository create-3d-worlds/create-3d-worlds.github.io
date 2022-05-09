import * as THREE from '/node_modules/three108/build/three.module.js'
import { scene, camera, renderer, clock, createOrbitControls } from '/utils/scene.js'
import { dirLight } from '/utils/light.js'
import { loadGlb } from '/utils/loaders.js'
import Player from '/classes/Player.js'
import { createGround } from '/utils/ground.js'

dirLight({ intensity: 1.5 })

camera.position.set(0, 5, 10)
createOrbitControls()

const { model, mixer } = await loadGlb({ glb: 'robot.glb', scale: 1 })
const group = new THREE.Group()
model.rotateY(Math.PI)
group.add(model)

scene.add(group)

const player = new Player({ mesh: group })

scene.add(createGround({ size: 100 }))

// LOOP

void function animate() {
  requestAnimationFrame(animate)
  const delta = clock.getDelta()
  // if (mixer) mixer.update(delta)
  player.update(delta)
  renderer.render(scene, camera)
}()
