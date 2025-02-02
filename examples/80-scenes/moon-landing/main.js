import { scene, camera, createToonRenderer, clock } from '/core/scene.js'
import { ambLight, createMoon, orbitAround } from '/core/light.js'
import { Stars } from '/core/Particles.js'
import GUI from '/core/io/GUI.js'
import Platform from '/core/objects/Platform.js'
import { loadModel } from '/core/loaders.js'
import { createSphere } from '/core/geometry/index.js'
import { createJupiter, createSaturn } from '/core/geometry/planets.js'
import GameLoop from '/core/GameLoop.js'

let arcology, lander

const renderer = await createToonRenderer()

document.body.style.background = 'linear-gradient(to bottom, #020111 70%, #191621 100%)'
camera.position.z = 18

ambLight()
const moonLight = createMoon({ pos: [30, 30, 30], intensity: Math.PI * .2 })

const platform = new Platform({ pos: [0, -10, 0], axis: 'x', range: 29, randomDirChange: true })
const stars = new Stars({ minRadius: 150 })

const jupiter = createJupiter({ r: 5 })
jupiter.position.set(-125, 25, -80)

const moon = createSphere({ r: 1.5, file: 'planets/moon.jpg' })

const saturn = createSaturn({ r: 3 })
saturn.position.set(85, 20, -50)

scene.add(platform.mesh, stars.mesh, jupiter, saturn, moon, moonLight)

const controls = {
  '← or A': 'thrust left',
  '→ or D': 'thrust right',
  '↓ or S': 'thrust down',
  '↑ or W': '',
  P: 'pause',
  // 'Space:': 'jump',
  // 'Enter:': 'attack',
  // 'CapsLock:': 'run',
}

const gui = new GUI({ subtitle: 'Fuel left', scoreClass: '', controls, controlsWindowClass: 'white-window' })
gui.showMessage('Land on the platform gently')

/* LOOP */

new GameLoop((dt, time) => {
  renderer.render(scene, camera)
  if (!lander) return

  platform.update(dt)
  lander.update(dt)

  gui.points = lander.hasLanded ? lander.fuel : 0

  stars.update({ delta: dt * .005 })
  arcology?.rotateY(dt * .02)
  jupiter.rotateY(dt * .2)
  moon.rotateY(dt)
  orbitAround({ moon, planet: jupiter, time: time * .75 })

  gui.renderScore(gui.points, lander.fuel)

  if (lander.endText) {
    gui.renderText(lander.endText + '<br><br><small>press R to play again</small>')
    if (lander.input.pressed.KeyR) {
      lander.reset()
      gui.reset()
    }
  }
})

/* LAZY LOAD */

arcology = await loadModel({ file: 'space/arcology-ring/model.fbx', scale: .5, shouldCenter: true })
arcology.position.z = -100
scene.add(arcology)

const obj = await import('./Lander.js')
lander = new obj.default({ platform })
scene.add(lander.mesh)
