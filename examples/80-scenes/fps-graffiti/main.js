import * as THREE from 'three'
import { camera, scene, renderer, clock } from '/utils/scene.js'
import { createMoon } from '/utils/light.js'
import { createGraffitiCity } from '/utils/city.js'
import { getAllCoords } from '/utils/helpers.js'
import FPSPlayer from '/utils/player/FPSPlayer.js'
import { SSSoldierAI } from '/utils/actors/ww2/SSSoldier.js'

const mapSize = 200
const coords = getAllCoords({ mapSize })

scene.fog = new THREE.FogExp2(0xF6F1D5, 0.0055)
scene.add(createMoon())
scene.background = new THREE.Color(0x070b34)

/* PLAYER */

const player = new FPSPlayer({ camera, coords, mapSize, pointerLockId: 'instructions' })
scene.add(player.mesh)

const solids = []

const enemies = []
for (let i = 0; i < 10; i++) {
  const enemy = new SSSoldierAI({ coords, mapSize, target: player.mesh })
  enemies.push(enemy)
  solids.push(enemy.mesh)
  scene.add(enemy.mesh)
}

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)
  renderer.render(scene, camera)
  if (!document.pointerLockElement) return

  const delta = clock.getDelta()
  player.update(delta)
  enemies.forEach(enemy => enemy.update(delta))
}()

const city = createGraffitiCity({ scene, mapSize, coords })
scene.add(city)

player.addSolids(city, enemies.map(e => e.mesh))
enemies.forEach(enemy => enemy.addSolids(city))