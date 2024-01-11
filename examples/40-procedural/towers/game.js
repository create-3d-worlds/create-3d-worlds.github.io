import { scene, camera, renderer, createOrbitControls } from '/utils/scene.js'
import { createTerrain } from '/utils/ground.js'
import { dirLight, hemLight } from '/utils/light.js'
import { createBabelTower, createDarkTower, createRingTower } from '/utils/geometry/towers.js'

dirLight({ intensity: Math.PI * .2 })
hemLight({ intensity: Math.PI * .75 })

camera.position.set(0, 150, 150)
createOrbitControls()

const babelTower = createBabelTower({ floors: 6 })
const baradDur = createDarkTower()
const spaceTower = createRingTower()

baradDur.position.x = 200
spaceTower.position.z = -200

const terrain = createTerrain({ size: 500, max: 1 })

scene.add(terrain, babelTower, baradDur, spaceTower)

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)
  renderer.render(scene, camera)
}()
