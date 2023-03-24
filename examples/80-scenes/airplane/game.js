import * as THREE from 'three'
import { scene, renderer, camera } from '/utils/scene.js'
import { createSkySphere } from '/utils/geometry.js'
import { createTerrain } from '/utils/ground.js'
import { createFirTrees } from '/utils/geometry/trees.js'
import Airplane from '/utils/classes/aircrafts/Airplane.js'
import { loadModel } from '/utils/loaders.js'
import { createSun } from '/utils/light.js'

const terrain = createTerrain({ size: 8000, segments: 200 })
const trees = createFirTrees({ n: 500, mapSize: 4000, size: 25 })

scene.fog = new THREE.Fog(0xE5C5AB, 1, 5000)
scene.add(createSkySphere(), createSun(), terrain, trees)

const { mesh } = await loadModel({
  file: 'aircraft/biplane-sopwith/model.fbx',
  size: 2,
  angle: -Math.PI * .5,
  // fixColors: true
})

const avion = new Airplane({ mesh })
scene.add(avion.mesh)

camera.position.set(0, 3, 20)
avion.mesh.add(camera)
avion.addSolids(terrain)

/* UPDATE */

void function loop() {
  requestAnimationFrame(loop)
  avion.update()
  renderer.render(scene, camera)
}()
