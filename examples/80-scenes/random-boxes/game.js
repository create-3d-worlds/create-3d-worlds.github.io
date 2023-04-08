import { scene, camera, renderer, clock } from '/utils/scene.js'
import { createRandomBoxes } from '/utils/geometry.js'
import { createGround } from '/utils/ground.js'
import { hemLight, createSun } from '/utils/light.js'
import Avatar from '/utils/actor/Avatar.js'
import Coin from '/utils/actor/child/Coin.js'
import Score from '/utils/ui/Score.js'

const numBoxes = 400
const numCoins = numBoxes / 4

hemLight()
scene.add(createSun({ intensity: .25 }))

const floor = createGround({ file: 'terrain/ground.jpg' })
scene.add(floor)
const boxes = createRandomBoxes({ n: numBoxes, mapSize: 200 })
scene.add(...boxes)

const coins = []
for (let i = 0; i < numCoins; i++) {
  const coin = new Coin({ pos: boxes[i].position })
  coin.mesh.translateZ(-6.15)
  coins.push(coin)
  scene.add(coin.mesh)
}

const player = new Avatar({ camera, solids: [floor, ...boxes], jumpStyle: 'DOUBLE_JUMP' })
player.cameraFollow.distance = 6
scene.add(player.mesh)

const score = new Score({ title: 'POINTS', subtitle: 'coins left', totalPoints: coins.length })

/* functions */

function checkCollision(coin) {
  if (player.distanceTo(coin.mesh) > 1.4) return
  coins.splice(coins.findIndex(c => c === coin), 1)
  coin.dispose()
  score.render(1, coins.length)
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
  renderer.render(scene, camera)
}()
