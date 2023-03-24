import { camera, scene, renderer, createOrbitControls } from '/utils/scene.js'
import { createGround } from '/utils/ground.js'
import { createCrate, createRustyBarrel, createWoodBarrel, createBox } from '/utils/geometry.js'
import { createMoon } from '/utils/geometry/planets.js'
import { createSun } from '/utils/light.js'

createOrbitControls()
scene.add(createSun())

const floor = createGround()
scene.add(floor)

/* GEOMETRIES */

const cube = createBox({ file: 'walls/bricks.jpg' })
cube.position.set(-1, 0, -2)
scene.add(cube)

const bumpCube = createBox({ file: 'walls/bricks.jpg', bumpFile: 'walls/bricks-gray.jpg' })
bumpCube.position.set(1, 0, -2)
scene.add(bumpCube)

const barrel = createWoodBarrel({ r: .4, height: 1 })
barrel.position.set(-2.4, 0, 0)
scene.add(barrel)

const moon = createMoon({ r: .5 })
moon.position.set(-1.2, .5, 0)
scene.add(moon)

const crate = createCrate()
crate.position.set(0, 0, 0)
scene.add(crate)

const box = createBox({ file: 'walls/stonetiles.jpg', normalFile: 'walls/stonetiles_n.jpg' })
box.position.set(0, 0, 2)
scene.add(box)

const rustBarrel = createRustyBarrel()
rustBarrel.position.set(1.2, 0, 0)
scene.add(rustBarrel)

const metalBarrel = createRustyBarrel({ file: 'barrel/metal-barrel-side.jpg', topFile: 'metal/metal01.jpg' })
metalBarrel.position.set(2.4, 0, 0)
scene.add(metalBarrel)

/* UPDATE */

void function update() {
  requestAnimationFrame(update)
  renderer.render(scene, camera)
}()
