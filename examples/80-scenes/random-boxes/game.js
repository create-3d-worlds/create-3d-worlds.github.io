import { scene, camera, renderer, clock } from '/utils/scene.js'
import { createRandomBoxes } from '/utils/geometry.js'
import { createGround } from '/utils/ground.js'
import { hemLight, createSun } from '/utils/light.js'
import Avatar from '/utils/actor/Avatar.js'
import Coin from '/utils/objects/Coin.js'
import Score from '/utils/io/Score.js'
import Platform from '/utils/objects/Platform.js'

const numBoxes = 400
const numCoins = numBoxes / 4
const platforms = []

hemLight()
scene.add(createSun({ intensity: .25 }))

const floor = createGround({ file: 'terrain/ground.jpg' })
scene.add(floor)
const boxes = createRandomBoxes({ n: numBoxes, mapSize: 200 })
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

const score = new Score({ title: 'POINTS', subtitle: 'coins left', totalPoints: coins.length })

/* FUNCTIONS */

function checkCollision(coin) {
  if (player.distanceTo(coin.mesh) > 1.4) return
  coins.splice(coins.findIndex(c => c === coin), 1)
  coin.dispose()
  score.update(1, coins.length)
}

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)
  const delta = clock.getDelta()
  player.update(delta)
  coins.forEach(coin => {
    coin.update(delta)
    checkCollision(coin)
  })
  platforms.forEach(platform => platform.update(delta))
  renderer.render(scene, camera)
}()
