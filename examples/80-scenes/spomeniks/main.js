import { scene, renderer, camera, clock } from '/core/scene.js'
import { createSun } from '/core/light.js'
import { loadModel } from '/core/loaders.js'
import { terrainFromHeightmap } from '/core/terrain/heightmap.js'
import { createFlag } from '/core/geometry/index.js'
import { wave } from '/core/ground.js'

let player
let time = 0

camera.position.y = 20
scene.add(createSun({ intensity: 2 * Math.PI }))

const terrain = await terrainFromHeightmap({ file: 'yu-crop.png', heightFactor: 3, snow: false })
scene.add(terrain)

const redFlag = createFlag({ file: 'prva-proleterska.jpg' })
redFlag.position.set(-1.5, 11.2, 0)
const redCanvas = redFlag.getObjectByName('canvas')

const yuFlag = createFlag({ file: 'sfrj.png' })
yuFlag.position.set(1.5, 11, 0)
const yuCanvas = yuFlag.getObjectByName('canvas')

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)
  renderer.render(scene, camera)
  const delta = clock.getDelta()
  time += delta

  wave({ geometry: redCanvas.geometry, time: time * 2, amplitude: 2.5, frequency: 2 })
  wave({ geometry: yuCanvas.geometry, time: time * 2, amplitude: 2.5, frequency: 2 })
  player?.update(delta)
}()

/* LAZY LOAD */

const { PartisanPlayer } = await import('/core/actor/derived/ww2/Partisan.js')
player = new PartisanPlayer({ camera, solids: terrain, altitude: .7 })
player.position.z = 2

const GUI = await import('/core/io/GUI.js')
new GUI.default({ player, scoreTitle: '' })

const [kosmaj, kosovskaMitrovica, podgaric, kadinjaca, ilirskaBistrica] = await Promise.all([
  await loadModel({ file: 'building/monument/kosmaj.fbx', size: 30, texture: 'terrain/beton.gif' }),
  await loadModel({ file: 'building/monument/kosovska-mitrovica.fbx', size: 19, texture: 'walls/concrete_wall_2b.jpg' }),
  await loadModel({ file: 'building/monument/podgaric.fbx', size: 10, texture: 'terrain/concrete.jpg' }),
  await loadModel({ file: 'building/monument/kadinjaca.fbx', size: 15, texture: 'terrain/beton.gif' }),
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
