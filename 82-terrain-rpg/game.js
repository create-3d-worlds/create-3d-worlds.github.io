/* global SimplexNoise */
import {scene, renderer, camera, createOrbitControls} from '../utils/three-scene.js'
import {createTrees} from '../utils/three-helpers.js'
import {rndInt} from '../utils/helpers.js'

const size = 1000

createOrbitControls()
camera.position.y = 250
camera.position.z = 250
scene.add(new THREE.HemisphereLight())

const generateTerrain = function(size = 1000, avgHeight = 30) {
  const resolution = 20
  const landMaterial = new THREE.MeshLambertMaterial({
    color: 0x33aa33,
    flatShading: true,
    vertexColors: THREE.FaceColors
  })
  const landGeo = new THREE.PlaneGeometry(size, size, resolution, resolution)

  const noise = new SimplexNoise()
  const factorX = 50
  const factorY = 25
  const factorZ = 60

  landGeo.vertices.forEach(vertex => {
    let n = noise.noise(vertex.x / resolution / factorX, vertex.y / resolution / factorY)
    n -= 0.25
    vertex.z = n * factorZ
  })
  landGeo.faces.forEach(face => {
    const { color } = face
    const rand = Math.random() / 5
    face.color.setRGB(color.r + rand, color.g + rand, color.b + rand)
  })

  const land = new THREE.Mesh(landGeo, landMaterial)
  land.receiveShadow = true
  land.name = 'land'
  land.rotateX(-Math.PI / 2)
  land.position.set(0, avgHeight, 0)

  const waterMaterial = new THREE.MeshLambertMaterial({
    color: 0x6699ff,
    transparent: true,
    opacity: 0.75,
    vertexColors: THREE.FaceColors,
    flatShading: true
  })
  const waterGeo = new THREE.PlaneGeometry(size, size, resolution, resolution)
  waterGeo.faces.forEach(face => {
    const { color } = face
    const rand = Math.random() / 2
    face.color.setRGB(color.r + rand, color.g + rand, color.b + rand)
  })

  const water = new THREE.Mesh(waterGeo, waterMaterial)
  water.receiveShadow = true
  water.name = 'water'
  water.rotateX(-Math.PI / 2)

  const terrain = new THREE.Object3D()
  terrain.name = 'terrain'
  terrain.add(land)
  terrain.add(water)
  terrain.receiveShadow = true
  return terrain
}

scene.add(generateTerrain())

const createFir = () => {
  const geom = {
    leaves: new THREE.CylinderGeometry(0, 25, 60, 4, 1),
    trunk: new THREE.BoxGeometry(5, 20, 5)
  }
  const materials = {
    leaves: new THREE.MeshLambertMaterial({ color: 0x3EA055, shading: THREE.SmoothShading }),
    trunk: new THREE.MeshLambertMaterial({ color: 0x966F33, shading: THREE.SmoothShading })
  }
  const tree = new THREE.Object3D()
  const leaves = new THREE.Mesh(geom.leaves, materials.leaves)
  const trunk = new THREE.Mesh(geom.trunk, materials.trunk)
  leaves.name = 'leaves'
  trunk.name = 'trunk'
  leaves.castShadow = true
  trunk.castShadow = true
  leaves.position.y += 50
  trunk.position.y += 20
  tree.add(leaves)
  tree.add(trunk)
  tree.castShadow = true
  return tree
}

class Fir {
  constructor(pos) {
    this.name = 'tree'
    this.mesh = createFir()
    const {x, y, z} = pos
    this.mesh.position.set(x, y, z)
  }
}

const place = function(position) {
  const direction = new THREE.Vector3(0, -1, 0)
  const origin = { x: position.x, y: 100, z: position.z }

  const raycaster = new THREE.Raycaster()
  raycaster.origin = origin
  raycaster.direction = direction

  const arrowHelper = new THREE.ArrowHelper(direction, origin, 100)
  scene.add(arrowHelper)

  const terrain = scene.getObjectByName('land')
  const intersects = raycaster.intersectObject(terrain, true) // raycaster.intersectObject(terrain)

  console.log(intersects)
  // nigde ne preseca teren??

  // const land = scene.getObjectByName('terrain').children[0]
  // const collisions = raycaster.intersectObject(land)
  // if (collisions.length > 0) {
  //   console.log(collisions[0].point)
  //   return collisions[0].point
  // }
  // return null
}

const createFirs = function(numTrees = 50) {
  const group = new THREE.Group()
  for (let i = 0; i < numTrees; i++) {
    const rndPoint = new THREE.Vector3(rndInt(size / 2), 100, rndInt(size / 2))
    // console.log(rndPoint)
    // group.add(new Fir(rndPoint).mesh)
    const position = place(rndPoint)
    if (position)
      console.log('ima')
      // if (position.y > 0) {
      //   position.y -= 10
      // }
      // group.add(new Fir(position).mesh)

  }
  return group
}

scene.add(createFirs())
// scene.add(createTrees())

void function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}()
