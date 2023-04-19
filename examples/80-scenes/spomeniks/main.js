import { scene, renderer, camera, clock } from '/utils/scene.js'
import { createSun } from '/utils/light.js'
import { loadModel } from '/utils/loaders.js'
import { terrainFromHeightmap } from '/utils/terrain/heightmap.js'
import { createFlag } from '/utils/geometry.js'
import { wave } from '/utils/ground.js'
import { ResistanceFighterPlayer } from '/utils/actor/child/ww2/ResistanceFighter.js'
import { createTreesOnTerrain } from '/utils/geometry/trees.js'

const solids = []

scene.add(createSun())

const terrain = await terrainFromHeightmap({ file: 'yu-crop.png', scale: 3, snow: false })

const trees = createTreesOnTerrain({ terrain, mapSize: 200, size: 3.5, name: terrain.name })

/* SPOMENIKS */

const { mesh: kosmaj } = await loadModel({ file: 'building/monument/kosmaj.fbx', size: 30, texture: 'terrain/beton.gif' })
kosmaj.position.set(-46, 14.2, -20)

const { mesh: kosovskaMitrovica } = await loadModel({ file: 'building/monument/kosovska-mitrovica.fbx', size: 19, texture: 'walls/concrete_wall_2b.jpg' })
kosovskaMitrovica.position.set(-50, 6, -100)
kosovskaMitrovica.rotateY(-Math.PI * .125)

const { mesh: podgaric } = await loadModel({ file: 'building/monument/podgaric.fbx', size: 10, texture: 'terrain/concrete.jpg' })
podgaric.position.set(40, 10, -40)
podgaric.rotateY(Math.PI * .75)

const { mesh: kadinjaca } = await loadModel({ file: 'building/monument/kadinjaca.fbx', size: 15 })
kadinjaca.position.set(0, 11, -4)

const { mesh: ilirskaBistrica } = await loadModel({ file: 'building/monument/ilirska-bistrica.fbx', size: 8, texture: 'terrain/beton.gif' })
ilirskaBistrica.position.set(40, 10.6, 20)

/* FLAGS */

const redFlag = createFlag({ file: 'prva-proleterska.jpg' })
redFlag.position.set(-1.5, 11.2, 0)

const yuFlag = createFlag({ file: 'sfrj.png' })
yuFlag.position.set(1.5, 11, 0)

/* PLAYER */

solids.push(terrain, trees, kosmaj, kosovskaMitrovica, podgaric, kadinjaca, ilirskaBistrica, redFlag, yuFlag)

const player = new ResistanceFighterPlayer({ solids, camera, altitude: .6 })
player.position.z = 2

scene.add(player.mesh, ...solids)

/* LOOP */

let time = 0

const redCanvas = redFlag.getObjectByName('canvas')
const yuCanvas = yuFlag.getObjectByName('canvas')

void function loop() {
  requestAnimationFrame(loop)
  const delta = clock.getDelta()
  time += delta

  wave({ geometry: redCanvas.geometry, time: time * 2, amplitude: 2.5, frequency: 2 })
  wave({ geometry: yuCanvas.geometry, time: time * 2, amplitude: 2.5, frequency: 2 })
  player.update(delta)

  renderer.render(scene, camera)
}()
