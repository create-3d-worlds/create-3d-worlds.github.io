import * as THREE from 'three'
import Avatar from '/utils/player/Avatar.js'
import { scene, renderer, camera, clock } from '/utils/scene.js'
import { createSun } from '/utils/light.js'
import { createGround } from '/utils/ground.js'

scene.add(createSun())

scene.background = new THREE.Color(0x8FBCD4)
scene.add(createGround({ size: 100 }))

const player = new Avatar({ camera })
scene.add(player.mesh)

/* LOOP */

void function update() {
  requestAnimationFrame(update)
  const delta = clock.getDelta()
  player.update(delta)
  renderer.render(scene, camera)
}()
