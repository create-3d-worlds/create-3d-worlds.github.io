import { scene, renderer, camera, clock } from '/utils/scene.js'
import { createSun } from '/utils/light.js'
import { loadModel } from '/utils/loaders.js'
import { terrainFromHeightmap } from '/utils/terrain/heightmap.js'
import { createFlag } from '/utils/geometry.js'
import { wave } from '/utils/ground.js'
import Player from '/utils/actor/Player.js'

scene.add(createSun())

const terrain = await terrainFromHeightmap({ file: 'yu-crop.png', scale: 3, snow: false })
scene.add(terrain)

const redFlag = createFlag({ file: 'prva-proleterska.jpg' })
redFlag.position.set(-1.5, 11.2, 0)

const yuFlag = createFlag({ file: 'sfrj.png' })
yuFlag.position.set(1.5, 11, 0)

/* PLAYER */

const animDict = {
  idle: 'Rifle Idle',
  walk: 'Rifle Walk',
  run: 'Rifle Run',
}

const [mesh, twoHandedWeapon] = await Promise.all([
  await loadModel({ file: 'resistance-fighter.fbx', angle: Math.PI, animDict, prefix: 'character/soldier/', fixColors: true, size: 1.8 }),
  await loadModel({ file: 'weapon/rifle.fbx', scale: 1.25, angle: Math.PI }),
])

const player = new Player({ mesh, animations: mesh.userData.animations, animDict, twoHandedWeapon, solids: terrain, camera, altitude: .6, attackStyle: 'ONCE' })
player.cameraFollow.distance = 1.5
player.position.z = 2

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
  player?.update(delta)

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

const solids = [redFlag, yuFlag, kadinjaca, kosmaj, kosovskaMitrovica, podgaric, kosovskaMitrovica, ilirskaBistrica]

player.addSolids(solids)
scene.add(player.mesh, ...solids)
