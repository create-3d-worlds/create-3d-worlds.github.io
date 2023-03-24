import { scene, camera, renderer, createOrbitControls, setBackground } from '/utils/scene.js'
import { createFloor } from '/utils/ground.js'
import { createCity, createCityLights } from '/utils/city.js'
import { hemLight, createMoon } from '/utils/light.js'

hemLight()
setBackground(0x000000)
const moon = createMoon({ position: [50, 150, 50] })

const mapSize = 300
const numBuildings = 200

const controls = createOrbitControls()
camera.position.set(0, mapSize * .6, mapSize * 1.1)

const floor = createFloor({ size: mapSize * 1.2, color: 0x505050 })

const city = createCity({ numBuildings, mapSize, rotateEvery: 3, addWindows: true })

scene.add(floor, city, moon)

scene.add(createCityLights({ numLights: 5 }))

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)
  controls.update()
  renderer.render(scene, camera)
}()
