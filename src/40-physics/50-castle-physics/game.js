import { camera, renderer, createOrbitControls } from '/utils/scene.js'
import { scene, createGround, createBox } from '/utils/physics.js'
import { hemLight, dirLight } from '/utils/light.js'

const bricks = 10
const floors = 6
const spacing = 10
const boxSize = 10
const d = spacing * bricks

hemLight({ scene })
dirLight({ scene })

camera.position.set(55, 50, 250)
createOrbitControls()

scene.add(createGround({ size: 500 }))

void function createBuilding(y) {
  if (y > spacing * floors) return
  const start = Math.floor(y / spacing) % 2 == 0 ? 0 : spacing / 2
  createOneFloor(y, start)
  createBuilding(y + spacing)
}(0)

/** FUNCTIONS **/

function createOneFloor(y, i) {
  if (i > d + 1) return
  ;[[i, y, 0], [i, y, d], [0, y, i], [d, y, i]].map(coord => {
    const box = createBox({ size: boxSize, friction: 1, bounciness: 0 })
    box.position.set(coord[0], coord[1] + 10 / 2, coord[2])
    scene.add(box)
  })
  createOneFloor(y, i + spacing)
}

/** LOOP **/

void function update() {
  window.requestAnimationFrame(update)
  scene.simulate()
  renderer.render(scene, camera)
}()
