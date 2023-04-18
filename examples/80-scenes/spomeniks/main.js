import { scene, renderer, camera, clock, createOrbitControls } from '/utils/scene.js'
import { createSun } from '/utils/light.js'
import { loadModel } from '/utils/loaders.js'
import { terrainFromHeightmap } from '/utils/terrain/heightmap.js'
import { putOnTerrain, findChild } from '/utils/helpers.js'
import { createFlag } from '/utils/geometry.js'
import { wave, createWater } from '/utils/ground.js'

scene.add(createSun())
camera.position.y = 15
createOrbitControls()

const terrain = await terrainFromHeightmap({ file: 'yu-crop.png', scale: 3, snow: false })
const offset = terrain.position.y = -4.5
scene.add(terrain)

const water = createWater({ size: 256 }) // mozda izvaciti vodu?
scene.add(water)

/* SPOMENIKS */

const { mesh: ilirskaBistrica } = await loadModel({ file: 'building/monument/ilirska-bistrica.fbx' })
scene.add(ilirskaBistrica)
ilirskaBistrica.position.set(-10, 0, 0)
putOnTerrain(ilirskaBistrica, terrain, offset)

const { mesh: kadinjaca } = await loadModel({ file: 'building/monument/kadinjaca.fbx' })
scene.add(kadinjaca)
kadinjaca.position.set(10, 0, 0)
putOnTerrain(kadinjaca, terrain, offset)

const { mesh: kosmaj } = await loadModel({ file: 'building/monument/kosmaj.fbx' })
scene.add(kosmaj)
kosmaj.position.set(0, 0, -10)
putOnTerrain(kosmaj, terrain, offset)

const { mesh: kosovskaMitrovica } = await loadModel({ file: 'building/monument/kosovska-mitrovica.fbx' })
scene.add(kosovskaMitrovica)
kosovskaMitrovica.position.set(-10, 0, -10)
putOnTerrain(kosovskaMitrovica, terrain, offset)

const { mesh: podgaric } = await loadModel({ file: 'building/monument/podgaric.fbx' })
scene.add(podgaric)
podgaric.position.set(10, 0, -10)
putOnTerrain(podgaric, terrain, offset)

/* FLAGS */

const flag = createFlag({ file: 'prva-proleterska.jpg' })
scene.add(flag)
flag.position.x = -1
putOnTerrain(flag, terrain, offset)

const flag2 = createFlag({ file: 'sfrj.png' })
scene.add(flag2)
flag2.position.x = 1
putOnTerrain(flag2, terrain, offset)

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)

  const time = clock.getElapsedTime()
  wave({ geometry: findChild(flag, 'plane').geometry, time: time * 2, amplitude: 2.5, frequency: 2 })
  wave({ geometry: findChild(flag2, 'plane').geometry, time: time * 2, amplitude: 2.5, frequency: 2 })
  wave({ geometry: water.geometry, time: time * .5, amplitude: .2, frequency: .2 })

  renderer.render(scene, camera)
}()