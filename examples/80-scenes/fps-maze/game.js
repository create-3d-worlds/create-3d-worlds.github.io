import { scene, renderer, camera, clock, setBackground } from '/utils/scene.js'
import { createGround } from '/utils/ground.js'
import { sample } from '/utils/helpers.js'
import { hemLight, lightningStrike } from '/utils/light.js'
import FPSPlayer from '/utils/actor/FPSPlayer.js'
import Maze from '/utils/mazes/Maze.js'
import { truePrims } from '/utils/mazes/algorithms.js'
import Score from '/utils/io/Score.js'

const light = hemLight({ intensity: .75 })
setBackground(0x070b34)
scene.add(createGround({ file: 'terrain/ground.jpg' }))

const maze = new Maze(8, 8, truePrims, 5)
const coords = maze.getEmptyCoords(true)
const walls = maze.toTiledMesh({ texture: 'terrain/concrete.jpg' }) 
scene.add(walls)

/* ACTORS */

const player = new FPSPlayer({ camera, goal: 'Find a way out.<br>Bonus: Kill all enemies.', solids: walls })
player.putInMaze(maze)
scene.add(player.mesh)

const enemies = []

const soldiers = ['GermanMachineGunner', 'SSSoldier', 'NaziOfficer', 'GermanFlameThrower']
for (let i = 0; i < 10; i++) {
  const name = sample(soldiers)
  const obj = await import(`/utils/actor/derived/ww2/${name}.js`)
  const EnemyClass = obj[name + 'AI']
  const enemy = new EnemyClass({ pos: coords.pop(), target: player.mesh, solids: walls })
  enemies.push(enemy)
  scene.add(enemy.mesh)
}

const score = new Score({ subtitle: 'Enemy left', total: enemies.length })

/* LOOP */

let firstDraw = false

renderer.setAnimationLoop(() => {
  renderer.render(scene, camera)
  if (!document.pointerLockElement && firstDraw) return
  firstDraw = true
  const delta = clock.getDelta()

  const killed = enemies.filter(enemy => enemy.energy <= 0)
  score.render(killed.length, enemies.length - killed.length)

  player.update(delta)
  if (player.position.distanceTo(maze.exitPosition) < 5)
    score.renderText(`Bravo!<br>You found a way out<br> and kill ${killed.length} of ${enemies.length} enemies`)

  enemies.forEach(enemy => enemy.update(delta))

  if (Math.random() > .997) lightningStrike(light)
})