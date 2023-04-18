import { scene, renderer, camera, clock, createOrbitControls } from '/utils/scene.js'
import { createSun } from '/utils/light.js'
import { loadModel } from '/utils/loaders.js'
import { terrainFromHeightmap } from '/utils/terrain/heightmap.js'
import { putOnTerrain, findChild } from '/utils/helpers.js'
import { createFlag } from '/utils/geometry.js'
import { wave, createWater } from '/utils/ground.js'
import { ResistanceFighterPlayer } from '/utils/actor/child/ww2/ResistanceFighter.js'

scene.add(createSun())

const terrain = await terrainFromHeightmap({ file: 'yu-crop.png', scale: 3, snow: false })
// terrain.position.y = -4.5
scene.add(terrain)

const water = createWater({ size: 256 }) // mozda izvaciti vodu?
scene.add(water)

const player = new ResistanceFighterPlayer({ solids: terrain, camera })
scene.add(player.mesh)
console.log(player.height)

/* SPOMENIKS */

const offset = terrain.position.y + .5

const { mesh: kosmaj } = await loadModel({ file: 'building/monument/kosmaj.fbx', size: 5 })
scene.add(kosmaj)
kosmaj.position.set(-38, 0, -25.5)
putOnTerrain(kosmaj, terrain, offset)

const { mesh: kosovskaMitrovica } = await loadModel({ file: 'building/monument/kosovska-mitrovica.fbx', size: 6 })
scene.add(kosovskaMitrovica)
kosovskaMitrovica.position.set(15, 0, -52)
kosovskaMitrovica.rotateY(Math.PI * .5)
putOnTerrain(kosovskaMitrovica, terrain, offset)

const { mesh: podgaric } = await loadModel({ file: 'building/monument/podgaric.fbx', size: 6 })
scene.add(podgaric)
podgaric.position.set(50, 0, -20)
podgaric.rotateY(Math.PI * .5)
putOnTerrain(podgaric, terrain, offset)

const { mesh: kadinjaca } = await loadModel({ file: 'building/monument/kadinjaca.fbx', size: 8 })
scene.add(kadinjaca)
kadinjaca.position.set(-2, 0, -3)
putOnTerrain(kadinjaca, terrain, offset)

const { mesh: ilirskaBistrica } = await loadModel({ file: 'building/monument/ilirska-bistrica.fbx', size: 4 })
scene.add(ilirskaBistrica)
ilirskaBistrica.position.set(40, 0, 20)
putOnTerrain(ilirskaBistrica, terrain, offset)

/* FLAGS */

const flag = createFlag({ file: 'prva-proleterska.jpg', scale: '.5' })
scene.add(flag)
flag.position.x = -1
putOnTerrain(flag, terrain, offset)

const flag2 = createFlag({ file: 'sfrj.png', scale: '.5' })
scene.add(flag2)
flag2.position.x = 1
putOnTerrain(flag2, terrain, offset)

/* LOOP */

let time = 0

void function loop() {
  requestAnimationFrame(loop)
  const delta = clock.getDelta()
  time += delta

  wave({ geometry: findChild(flag, 'plane').geometry, time: time * 2, amplitude: 2.5, frequency: 2 })
  wave({ geometry: findChild(flag2, 'plane').geometry, time: time * 2, amplitude: 2.5, frequency: 2 })
  wave({ geometry: water.geometry, time: time * .5, amplitude: .2, frequency: .2 })

  player.update(delta)

  renderer.render(scene, camera)
}()
