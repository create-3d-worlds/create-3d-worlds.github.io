import { scene, renderer, camera, clock, createOrbitControls } from '/utils/scene.js'
import { createSun } from '/utils/light.js'
import { loadModel } from '/utils/loaders.js'
import { terrainFromHeightmap } from '/utils/terrain/heightmap.js'
import { putOnTerrain, findChild } from '/utils/helpers.js'
import { createFlag } from '/utils/geometry.js'
import { wave } from '/utils/ground.js'
import { ResistanceFighterPlayer } from '/utils/actor/child/ww2/ResistanceFighter.js'

createOrbitControls()
camera.position.y = 50

scene.add(createSun())

const terrain = await terrainFromHeightmap({ file: 'yu-crop.png', scale: 3, snow: false })
scene.add(terrain)

/* SPOMENIKS */

const offset = terrain.position.y

const { mesh: kosmaj } = await loadModel({ file: 'building/monument/kosmaj.fbx', size: 30 })
scene.add(kosmaj)
kosmaj.position.set(-46, 0, -20)
putOnTerrain(kosmaj, terrain, offset)

const { mesh: kosovskaMitrovica } = await loadModel({ file: 'building/monument/kosovska-mitrovica.fbx', size: 19 })
scene.add(kosovskaMitrovica)
kosovskaMitrovica.position.set(-5, 0, -65)
kosovskaMitrovica.rotateY(Math.PI * .6)
putOnTerrain(kosovskaMitrovica, terrain, offset)

const { mesh: podgaric } = await loadModel({ file: 'building/monument/podgaric.fbx', size: 10 })
scene.add(podgaric)
podgaric.position.set(50, 0, -20)
podgaric.rotateY(Math.PI * .5)
putOnTerrain(podgaric, terrain, offset)

const { mesh: kadinjaca } = await loadModel({ file: 'building/monument/kadinjaca.fbx', size: 15 })
scene.add(kadinjaca)
kadinjaca.position.set(0, 0, -4)
putOnTerrain(kadinjaca, terrain, offset)

const { mesh: ilirskaBistrica } = await loadModel({ file: 'building/monument/ilirska-bistrica.fbx', size: 8 })
scene.add(ilirskaBistrica)
ilirskaBistrica.position.set(40, 0, 20)
putOnTerrain(ilirskaBistrica, terrain, offset)

/* FLAGS */

const redFlag = createFlag({ file: 'prva-proleterska.jpg' })
scene.add(redFlag)
redFlag.position.x = -1
putOnTerrain(redFlag, terrain, offset)

const yuFlag = createFlag({ file: 'sfrj.png' })
scene.add(yuFlag)
yuFlag.position.x = 1
putOnTerrain(yuFlag, terrain, offset)

/* PLAYER */

const player = new ResistanceFighterPlayer({ solids: terrain, camera, altitude: .5 })
scene.add(player.mesh)

/* LOOP */

let time = 0

void function loop() {
  requestAnimationFrame(loop)
  const delta = clock.getDelta()
  time += delta

  wave({ geometry: findChild(redFlag, 'plane').geometry, time: time * 2, amplitude: 2.5, frequency: 2 })
  wave({ geometry: findChild(yuFlag, 'plane').geometry, time: time * 2, amplitude: 2.5, frequency: 2 })
  player.update(delta)

  renderer.render(scene, camera)
}()
