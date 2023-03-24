import * as THREE from 'three'
import { scene, renderer, camera, clock, createOrbitControls } from '/utils/scene.js'
import { createGround } from '/utils/ground.js'

import { SorceressPlayer } from '/utils/actors/fantasy/Sorceress.js'
import { dirLight, lightFollow } from '/utils/light.js'
import { createStoneCircles } from '/utils/geometry/towers.js'

camera.position.y = 15
createOrbitControls()

const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.5)
scene.add(ambientLight)

const stones = createStoneCircles({ radius: 5 })
scene.add(stones)

const plane = createGround({ size: 20 })
scene.add(plane)

const player = new SorceressPlayer()
scene.add(player.mesh)

const light = dirLight({ target: player.mesh, mapSize: 1024, area: 10 })

/* LOOP */

void function loop() {
  lightFollow(light, player.mesh, [12, 18, 1])

  const delta = clock.getDelta()
  player.update(delta)

  renderer.render(scene, camera)
  requestAnimationFrame(loop)
}()