import { scene, renderer, camera, clock } from '/utils/scene.js'
import { createSun } from '/utils/light.js'
import { loadModel } from '/utils/loaders.js'
import { terrainFromHeightmap } from '/utils/terrain/heightmap.js'
import { createFlag } from '/utils/geometry.js'
import { wave } from '/utils/ground.js'
import Player from '/utils/actor/Player.js'
import { createTreesOnTerrain } from '/utils/geometry/trees.js'

scene.add(createSun())

const loaded = await Promise.all([
  await terrainFromHeightmap({ file: 'yu-crop.png', scale: 3, snow: false }),
  await loadModel({ file: 'building/monument/kosmaj.fbx', size: 30, texture: 'terrain/beton.gif' }),
])

console.log(loaded)

const [terrain] = loaded

const trees = createTreesOnTerrain({ terrain, mapSize: 200, size: 3.5, name: terrain.name })

/* SPOMENIKS */

const kosmaj = await loadModel({ file: 'building/monument/kosmaj.fbx', size: 30, texture: 'terrain/beton.gif' })
kosmaj.position.set(-46, 14.2, -20)

const kosovskaMitrovica = await loadModel({ file: 'building/monument/kosovska-mitrovica.fbx', size: 19, texture: 'walls/concrete_wall_2b.jpg' })
kosovskaMitrovica.position.set(-50, 6, -100)
kosovskaMitrovica.rotateY(-Math.PI * .125)

const podgaric = await loadModel({ file: 'building/monument/podgaric.fbx', size: 10, texture: 'terrain/concrete.jpg' })
podgaric.position.set(40, 10, -40)
podgaric.rotateY(Math.PI * .75)

const kadinjaca = await loadModel({ file: 'building/monument/kadinjaca.fbx', size: 15 })
kadinjaca.position.set(0, 11, -4)

const ilirskaBistrica = await loadModel({ file: 'building/monument/ilirska-bistrica.fbx', size: 8, texture: 'terrain/beton.gif' })
ilirskaBistrica.position.set(40, 10.6, 20)

/* FLAGS */

const redFlag = createFlag({ file: 'prva-proleterska.jpg' })
redFlag.position.set(-1.5, 11.2, 0)

const yuFlag = createFlag({ file: 'sfrj.png' })
yuFlag.position.set(1.5, 11, 0)

/* PLAYER */

const solids = [terrain, redFlag, yuFlag, trees, kadinjaca, kosmaj, kosovskaMitrovica]
const problematicSolids = [podgaric, kosovskaMitrovica, ilirskaBistrica] // player falling if added initially

export const animDict = {
  idle: 'Rifle Idle',
  walk: 'Rifle Walk',
  run: 'Rifle Run',
}

const mesh = await loadModel({ file: 'resistance-fighter.fbx', angle: Math.PI, animDict, prefix: 'character/soldier/', fixColors: true, size: 1.8 })

const twoHandedWeapon = await loadModel({ file: 'weapon/rifle.fbx', scale: 1.25, angle: Math.PI })

const player = new Player({ mesh, animations: mesh.userData.animations, animDict, twoHandedWeapon, solids, camera, altitude: .6, attackStyle: 'ONCE' })

player.addSolids(problematicSolids)

player.cameraFollow.distance = 1.5
player.position.z = 2

scene.add(player.mesh, ...solids, ...problematicSolids)

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
