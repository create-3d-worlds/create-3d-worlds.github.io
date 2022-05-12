import { scene, camera, renderer, clock } from '/utils/scene.js'
import { createTerrain } from '/utils/ground.js'
import Kamenko from '/classes/Kamenko.js'
import { dirLight, hemLight } from '/utils/light.js'
import { createBabelTower } from '/utils/towers.js'

dirLight()
hemLight({ intensity: .75 })

camera.position.z = 20
camera.position.y = 10

const tower = createBabelTower({ floors: 6 })
const terrain = createTerrain()
scene.add(terrain, tower)

const avatar = new Kamenko({ size: 5, skin: 0 })
avatar.position.set(120, 10, 0)
avatar.add(camera)
avatar.addSolids(terrain, tower)
scene.add(avatar.mesh)

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  const delta = clock.getDelta()
  avatar.update(delta)
  renderer.render(scene, camera)
}()
