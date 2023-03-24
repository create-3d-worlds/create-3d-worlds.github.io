import { TWEEN } from '/node_modules/three/examples/jsm/libs/tween.module.min.js'
import { scene, camera, renderer } from '/utils/scene.js'
import { createFloor } from '/utils/ground.js'
import { createBuilding, createBuildingTexture } from '/utils/city.js'
import { createMoon } from '/utils/light.js'

renderer.setClearColor(0x070b34)

const buildings = []
const mapSize = 400

camera.position.set(0, mapSize * .33, mapSize * .9)
camera.lookAt(scene.position)

scene.add(createMoon({ position: [150, 150, 50] }))

const floor = createFloor({ size: 600, color: 0x303038 })
scene.add(floor)

for (let i = 0; i < 100; i++) {
  const building = createBuilding({ width: 10, height: 10, map: createBuildingTexture({ night: true }) })
  buildings.push(building)
  scene.add(building)
}

/* FUNCTIONS */

function grow() {
  buildings.forEach(building => {
    const y = 1 + Math.random() * 20 + (Math.random() < 0.1 ? 15 : 0)

    new TWEEN.Tween(building.scale)
      .to({
        x: 1 + Math.random() * 3,
        y,
        z: 1 + Math.random() * 3,
      })
      .start()

    new TWEEN.Tween(building.position)
      .to({
        x: -mapSize * .5 + Math.random() * mapSize,
        z: -mapSize * .5 + Math.random() * mapSize,
        y: y / 2,
      })
      .start()
  })
}

grow()

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)
  TWEEN.update()
  renderer.render(scene, camera)
}()

/* EVENTS */

document.addEventListener('click', grow)