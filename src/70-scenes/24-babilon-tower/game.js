import { scene, camera, renderer, clock } from '/utils/scene.js'
import { createTerrain } from '/utils/ground.js'
import Avatar from '/classes/Avatar.js'
import { dirLight, hemLight } from '/utils/light.js'
import { createBabelTower, spomenik, spaceStructure } from '/utils/towers.js'

dirLight()
hemLight({ intensity: .75 })

const tower = createBabelTower({ floors: 6 })
const monument = spomenik()
monument.position.x = 200
const structure = spaceStructure()
structure.position.z = -200

const terrain = createTerrain()
scene.add(terrain, tower, monument, structure)

const avatar = new Avatar({ skin: 0 })
avatar.position.set(60, 2, 0)
avatar.addSolids(terrain, tower, monument, structure)
scene.add(avatar.mesh)

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  const delta = clock.getDelta()
  avatar.update(delta)
  renderer.render(scene, camera)
}()
