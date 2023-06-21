import { scene, camera, renderer, clock } from '/utils/scene.js'
import { createRandomBoxes, createSkySphere } from '/utils/geometry/index.js'
import { createGround, createLava } from '/utils/ground.js'
import { hemLight, createSun } from '/utils/light.js'
import Coin from '/utils/objects/Coin.js'
import Score from '/utils/io/Score.js'
import Platform from '/utils/objects/Platform.js'

const startScreen = document.getElementById('start-screen')

const numBoxes = 400, mapSize = 200, lavaSize = 50
const numCoins = numBoxes / 4
const platforms = []
const coins = []

let player
let pause = true
let time = 0

hemLight()
scene.add(createSun({ intensity: .25 }))
scene.add(await createSkySphere())

const floor = createGround({ file: 'terrain/ground.jpg' })
scene.add(floor)

const boxes = createRandomBoxes({ n: numBoxes, mapSize })
scene.add(...boxes)

const messageDict = {
  1: 'Well, that\'s a good start!',
  10: 'Keep up the good work!',
  25: 'Nice result so far...',
  50: 'Half down, half to go!',
  75: 'You smell victory in the air...',
}
const score = new Score({ title: 'POINTS', subtitle: 'coins left', total: numCoins, endText: 'BRAVO!<br>You have collected all coins', messageDict })

const lava = await createLava({ size: lavaSize })
scene.add(lava)

/* FUNCTIONS */

const withinCircle = position => Math.pow(position.x, 2) + Math.pow(position.z, 2) < Math.pow(lavaSize, 2)

const inLava = () => player.position.y <= .1 && withinCircle(player.position)

function checkCollision(coin) {
  if (player.distanceTo(coin.mesh) > 1.4) return
  coins.splice(coins.findIndex(c => c === coin), 1)
  scene.remove(coin.mesh)
  score.update(1, coins.length)
}

function createCoins(addPlatforms) {
  for (let i = 0; i < numCoins; i++) {
    const pos = boxes[i].position.clone()
    pos.y += 6.15

    if (addPlatforms && Math.random() > .5) {
      const platform = new Platform({ pos, file: null })
      platforms.push(platform)
      scene.add(platform.mesh)
      player.addSolids(platform.mesh)
    }

    const coin = new Coin({ pos })
    coins.push(coin)
    scene.add(coin.mesh)
  }
}

function reset(addPlatforms = false) {
  coins.forEach(coin => scene.remove(coin.mesh))
  coins.length = 0
  createCoins(addPlatforms)

  score.points = 0
  score.update(0, coins.length)

  player.position = [0, 0, 50]
  player.energy = 100
  player.lookAt(scene.position)
}

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)
  renderer.render(scene, camera)
  if (pause) return

  const delta = clock.getDelta()
  time += delta

  coins.forEach(coin => {
    coin.update(delta)
    checkCollision(coin)
  })

  if (inLava()) player.energy -= .1

  if (player.dead) {
    score.renderEndScreen({ callback: reset })
    player.position.y -= .01
  } else
    player.update(delta)

  platforms.forEach(platform => platform.update(delta))
  lava.material.uniforms.time.value = time * .5
}()

/* EVENTS */

startScreen.addEventListener('click', e => {
  if (e.target.tagName != 'INPUT') return
  startScreen.style.display = 'none'

  const promise = import('/utils/actor/Avatar.js')
  promise.then(obj => {
    pause = false
    player = new obj.default({ camera, solids: [floor, ...boxes], skin: e.target.id })
    player.chaseCamera.distance = 6
    scene.add(player.mesh)
    reset(true)
    score.renderHeighScore()
  })
})