import { scene, renderer, camera, clock } from '/utils/scene.js'
import { createSun } from '/utils/light.js'
import { loadModel } from '/utils/loaders.js'
import { terrainFromHeightmap } from '/utils/terrain/heightmap.js'
import { createFlag } from '/utils/geometry/index.js'
import { wave } from '/utils/ground.js'
import { ResistanceWalkerPlayer } from '/utils/actor/derived/ww2/ResistanceWalker.js'

let time = 0

scene.add(createSun())

const terrain = await terrainFromHeightmap({ file: 'yu-crop.png', heightFactor: 3, snow: false })
scene.add(terrain)

const redFlag = createFlag({ file: 'prva-proleterska.jpg' })
redFlag.position.set(-1.5, 11.2, 0)
const redCanvas = redFlag.getObjectByName('canvas')

const yuFlag = createFlag({ file: 'sfrj.png' })
yuFlag.position.set(1.5, 11, 0)
const yuCanvas = yuFlag.getObjectByName('canvas')

/* PLAYER */

const player = new ResistanceWalkerPlayer({ solids: terrain, camera })
player.position.z = 2

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)
  const delta = clock.getDelta()
  time += delta

  wave({ geometry: redCanvas.geometry, time: time * 2, amplitude: 2.5, frequency: 2 })
  wave({ geometry: yuCanvas.geometry, time: time * 2, amplitude: 2.5, frequency: 2 })
  player.update(delta)

  renderer.render(scene, camera)
}()

/* LAZY LOADING */

const [kosmaj, kosovskaMitrovica, podgaric, kadinjaca, ilirskaBistrica] = await Promise.all([
  await loadModel({ file: 'building/monument/kosmaj.fbx', size: 30, texture: 'terrain/beton.gif' }),
  await loadModel({ file: 'building/monument/kosovska-mitrovica.fbx', size: 19, texture: 'walls/concrete_wall_2b.jpg' }),
  await loadModel({ file: 'building/monument/podgaric.fbx', size: 10, texture: 'terrain/concrete.jpg' }),
  await loadModel({ file: 'building/monument/kadinjaca.fbx', size: 15 }),
  await loadModel({ file: 'building/monument/ilirska-bistrica.fbx', size: 8, texture: 'terrain/beton.gif' }),
])

kosovskaMitrovica.position.set(-50, 6, -100)
kosovskaMitrovica.rotateY(-Math.PI * .125)

podgaric.position.set(40, 10, -40)
podgaric.rotateY(Math.PI * .75)

kosmaj.position.set(-46, 14.2, -20)
kadinjaca.position.set(0, 11, -4)
ilirskaBistrica.position.set(40, 10.6, 20)

const solids = [terrain, redFlag, yuFlag, kadinjaca, kosmaj, kosovskaMitrovica, podgaric, kosovskaMitrovica, ilirskaBistrica]

player.addSolids(solids)
scene.add(player.mesh, ...solids)
