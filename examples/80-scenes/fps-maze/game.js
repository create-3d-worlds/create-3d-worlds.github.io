import { scene, camera, setBackground, createToonRenderer } from '/utils/scene.js'
import { createGround } from '/utils/ground.js'
import { sample } from '/utils/helpers.js'
import { hemLight, lightningStrike } from '/utils/light.js'
import FPSPlayer from '/utils/actor/FPSPlayer.js'
import Maze from '/utils/mazes/Maze.js'
import { truePrims } from '/utils/mazes/algorithms.js'
import Score from '/utils/io/Score.js'
import { Spinner } from '/utils/loaders.js'
import GameLoop from '/utils/GameLoop.js'

const enemies = []

const spinner = new Spinner()
const renderer = await createToonRenderer()

const light = hemLight({ intensity: .75 })
setBackground(0x070b34)
scene.add(createGround({ file: 'terrain/ground.jpg' }))

const maze = new Maze(8, 8, truePrims, 5)
const coords = maze.getEmptyCoords(true)
const walls = maze.toTiledMesh({ texture: 'terrain/concrete.jpg' })
scene.add(walls)

/* ACTORS */

const goal = `
<ul>
  <li>Find a way out.</li>
  <li>Bonus: Kill all enemies.</li>
</ul>
`
const player = new FPSPlayer({ camera, goal, solids: walls })
player.putInMaze(maze)
scene.add(player.mesh)

const score = new Score({ title: 'Killed', subtitle: 'Enemy left', total: enemies.length })

/* LOOP */

renderer.render(scene, camera) // first draw

new GameLoop((delta, time) => {
  renderer.render(scene, camera)

  const killed = enemies.filter(enemy => enemy.energy <= 0)
  score.render(killed.length, enemies.length - killed.length)

  player.update(delta)

  if (player.position.distanceTo(maze.exitPosition) < 5)
    score.renderText(`Bravo!<br>You found a way out<br> and kill ${killed.length} of ${enemies.length} enemies`)
  else if (!player.dead && Math.ceil(time) % 20 == 0)
    score.renderTempText('Find a way out!', true)

  enemies.forEach(enemy => enemy.update(delta))

  if (Math.random() > .998) lightningStrike(light)
}, true)

/* LAZY LOAD */

const soldiers = ['GermanMachineGunner', 'SSSoldier', 'NaziOfficer', 'GermanFlameThrower']
for (let i = 0; i < 10; i++) {
  const name = sample(soldiers)
  const obj = await import(`/utils/actor/derived/ww2/${name}.js`)
  const EnemyClass = obj[name + 'AI']
  const enemy = new EnemyClass({ pos: coords.pop(), target: player.mesh, solids: walls })
  enemies.push(enemy)
  scene.add(enemy.mesh)
}

const obj = await import('/utils/objects/Potion.js')
for (let i = 0; i < 2; i++) {
  const potion = new obj.default({ pos: coords.pop() })
  scene.add(potion.mesh)
}

spinner.hide()
