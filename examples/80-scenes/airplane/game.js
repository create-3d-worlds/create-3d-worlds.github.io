import { scene, renderer, camera, clock } from '/utils/scene.js'
import { createTerrain } from '/utils/ground.js'
import { createFirTrees } from '/utils/geometry/trees.js'
import Airplane from '/utils/aircraft/Airplane.js'
import { loadModel } from '/utils/loaders.js'
import { createSun } from '/utils/light.js'

const terrain = createTerrain({ size: 8000, segments: 200 })
const trees = createFirTrees({ n: 500, mapSize: 4000, size: 15 })
const sun = createSun()

scene.add(sun, terrain, trees)

const mesh = await loadModel({ file: 'aircraft/airplane/biplane-sopwith/model.fbx', size: 2, angle: -Math.PI * .5,
  // fixColors: true
})

const avion = new Airplane({ mesh, solids: terrain })
scene.add(avion.mesh)

camera.position.set(0, 3, 10)
avion.mesh.add(camera)

/* UPDATE */

void function loop() {
  requestAnimationFrame(loop)
  const delta = clock.getDelta()

  avion.update(delta)
  renderer.render(scene, camera)
}()
