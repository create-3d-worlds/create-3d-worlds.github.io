// import * as THREE from '../node_modules/three/src/Three.js'
import {scene, controls, renderer, camera} from './scene.js'
import {createBox, createFloor} from '../utils/three-helpers.js'
import model from '../maps/small-map.js'

scene.add(createFloor(100, 100, 'moon.jpg'))

// razlicite materijale za enume
for (let z = 0; z < model.length; z++)
  for (let x = 0; x < model.length; x++)
    if (model[z][x]) scene.add(createBox(z, x, 'crate.gif'))

void function gameLoop() {
  requestAnimationFrame(gameLoop)
  controls.update()
  renderer.render(scene, camera)
}()
