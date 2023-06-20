import { scene, camera, renderer, clock } from '/utils/scene.js'
import { createRandomBoxes, createSkySphere } from '/utils/geometry/index.js'
import { createGround, createLava } from '/utils/ground.js'
import { hemLight, createSun } from '/utils/light.js'
import Avatar from '/utils/actor/Avatar.js'
import Coin from '/utils/objects/Coin.js'
import Score from '/utils/io/Score.js'
import Platform from '/utils/objects/Platform.js'

const numBoxes = 400, mapSize = 200, lavaSize = 50
const numCoins = numBoxes / 4
const platforms = []

hemLight()
scene.add(createSun({ intensity: .25 }))
scene.add(await createSkySphere())

const floor = createGround({ file: 'terrain/ground.jpg' })
scene.add(floor)
const boxes = createRandomBoxes({ n: numBoxes, mapSize })
scene.add(...boxes)

const coins = []
for (let i = 0; i < numCoins; i++) {
  const pos = boxes[i].position.clone()
  pos.y += 6.15

  if (Math.random() > .5) {
    const platform = new Platform({ pos, file: null })
    platforms.push(platform)
    scene.add(platform.mesh)
  }

  const coin = new Coin({ pos })
  coins.push(coin)
  scene.add(coin.mesh)
}

const solids = [floor, ...boxes, ...platforms.map(x => x.mesh)]
const player = new Avatar({ camera, solids, jumpStyle: 'DOUBLE_JUMP' })
player.chaseCamera.distance = 6
scene.add(player.mesh)

const messageDict = {
  1: 'Well, that\'s a good start!',
  10: 'Keep up the good work!',
  25: 'Nice result so far...',
  50: 'Half down, half to go!',
  75: 'You smell victory in the air...',
}
const score = new Score({ title: 'POINTS', subtitle: 'coins left', total: coins.length, endText: 'BRAVO!<br>You have collected all coins', messageDict })

const lava = await createLava({ size: lavaSize })
lava.translateY(.1)
scene.add(lava)

/* FUNCTIONS */

function checkCollision(coin) {
  if (player.distanceTo(coin.mesh) > 1.4) return
  coins.splice(coins.findIndex(c => c === coin), 1)
  scene.remove(coin.mesh)
  score.update(1, coins.length)
}

const withinCircle = position => Math.pow(position.x, 2) + Math.pow(position.z, 2) < Math.pow(lavaSize, 2)

const inLava = () => player.position.y <= .1 && withinCircle(player.position)

/* LOOP */

let time = 0

void function loop() {
  requestAnimationFrame(loop)
  const delta = clock.getDelta()
  time += delta

  player.update(delta)
  coins.forEach(coin => {
    coin.update(delta)
    checkCollision(coin)
  })

  if (inLava()) player.energy -= .1

  platforms.forEach(platform => platform.update(delta))
  lava.material.uniforms.time.value = time * .5
  renderer.render(scene, camera)
}()
