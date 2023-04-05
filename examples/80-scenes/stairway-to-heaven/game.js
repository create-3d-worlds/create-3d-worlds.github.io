import * as THREE from 'three'
import { scene, camera, renderer, clock } from '/utils/scene.js'
import { createSkySphere } from '/utils/geometry.js'
import { createSpiralStairs } from '/utils/geometry/towers.js'
import { createGround, createTerrain } from '/utils/ground.js'
import { hemLight, createSun } from '/utils/light.js'
import Avatar from '/utils/actor/Avatar.js'

scene.add(createGround())
scene.add(createSkySphere())
const light = createSun()
scene.add(light)
scene.fog = new THREE.Fog(0xffffff, 1, 5000)
hemLight({ scene, intensity: 0.5 })

const terrain = createTerrain()
scene.add(terrain)

const stairsLeft = createSpiralStairs({ floors: 5 })
const stairsRight = createSpiralStairs({ floors: 5 })
scene.add(stairsRight)
scene.add(stairsLeft)

stairsLeft.position.x = 50
stairsLeft.rotateY(Math.PI / 2)
stairsRight.position.x = -50
stairsRight.rotateY(-Math.PI / 4)

const avatar = new Avatar({ camera })
avatar.addSolids(terrain, stairsRight, stairsLeft)
avatar.mesh.rotateY(Math.PI)
scene.add(avatar.mesh)

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)
  const delta = clock.getDelta()
  avatar.update(delta)

  renderer.render(scene, camera)
}()
