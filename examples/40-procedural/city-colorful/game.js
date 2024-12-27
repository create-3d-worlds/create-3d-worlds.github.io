import { scene, camera, renderer, createOrbitControls, setBackground } from '/core/scene.js'
import { createFloor } from '/core/ground.js'
import { createCity, createCityLights } from '/core/city.js'
import { hemLight, createMoon } from '/core/light.js'

hemLight()
setBackground(0x000000)
const moon = createMoon({ pos: [50, 150, 50] })

const mapSize = 300
const numBuildings = 200

const controls = await createOrbitControls()
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
