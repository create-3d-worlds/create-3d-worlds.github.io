import { scene, renderer, camera, clock, createOrbitControls } from '/utils/scene.js'
import { createSun } from '/utils/light.js'
import { loadModel } from '/utils/loaders.js'
import { terrainFromHeightmap } from '/utils/terrain/heightmap.js'
import { putOnTerrain, findChild } from '/utils/helpers.js'
import { createFlag } from '/utils/geometry.js'
import { wave } from '/utils/ground.js'

scene.add(createSun())
createOrbitControls()

const terrain = await terrainFromHeightmap({ file: 'yu.png', scale: 3, snow: false })
terrain.position.y = -10
scene.add(terrain)

/* SPOMENIKS */

const { mesh: ilirskaBistrica } = await loadModel({ file: 'building/monument/ilirska-bistrica.fbx' })
scene.add(ilirskaBistrica)
ilirskaBistrica.position.set(-10, 0, 0)
putOnTerrain(ilirskaBistrica, terrain, -8)

const { mesh: kadinjaca } = await loadModel({ file: 'building/monument/kadinjaca.fbx' })
scene.add(kadinjaca)
kadinjaca.position.set(10, 0, 0)
putOnTerrain(kadinjaca, terrain, -8)

const { mesh: kosmaj } = await loadModel({ file: 'building/monument/kosmaj.fbx' })
scene.add(kosmaj)
kosmaj.position.set(0, 0, -10)
putOnTerrain(kosmaj, terrain, -8)

const { mesh: kosovskaMitrovica } = await loadModel({ file: 'building/monument/kosovska-mitrovica.fbx' })
scene.add(kosovskaMitrovica)
kosovskaMitrovica.position.set(-10, 0, -10)
putOnTerrain(kosovskaMitrovica, terrain, -8)

const { mesh: podgaric } = await loadModel({ file: 'building/monument/podgaric.fbx' })
scene.add(podgaric)
podgaric.position.set(10, 0, -10)
putOnTerrain(podgaric, terrain, -8)

/* FLAGS */

const flag = createFlag({ file: 'prva-proleterska.jpg' })
scene.add(flag)
flag.position.x = -1

const flag2 = createFlag({ file: 'sfrj.png' })
scene.add(flag2)
flag2.position.x = 1

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)

  const time = clock.getElapsedTime()
  wave({ geometry: findChild(flag, 'plane').geometry, time, amplitude: 2.5, frequency: 2 })
  wave({ geometry: findChild(flag2, 'plane').geometry, time, amplitude: 2.5, frequency: 2 })

  renderer.render(scene, camera)
}()