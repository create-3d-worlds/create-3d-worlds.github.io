// import * as THREE from '../node_modules/three/src/Three.js'
import {scene, controls, renderer, camera} from '../utils/3d-scene.js'
import {createBox, createFloor} from '../utils/3d-helpers.js'
import model from '../data/small-map.js'

const textures = ['concrete.jpg', 'crate.gif', 'brick.png']

scene.add(createFloor(100, 100, 'moon.jpg'))

// razlicite materijale za enume
for (let z = 0; z < model.length; z++)
  for (let x = 0; x < model.length; x++) {
    const val = model[z][x]
    if (val) scene.add(createBox(z, x, textures[val - 1]))
  }

void function gameLoop() {
  requestAnimationFrame(gameLoop)
  controls.update()
  renderer.render(scene, camera)
}()
