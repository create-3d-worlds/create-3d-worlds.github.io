/* global SimplexNoise */
import {scene, renderer, camera, createOrbitControls} from '../utils/three-scene.js'
// import {createTrees} from '../utils/three-helpers.js'

createOrbitControls()
camera.position.y = 250
camera.position.z = 250
scene.add(new THREE.HemisphereLight())

const generateTerrain = function() {
  const resolution = 20
  const material = new THREE.MeshLambertMaterial({ color: 0x33aa33, shading: THREE.FlatShading, vertexColors: THREE.FaceColors, overdraw: true})
  const geometry = new THREE.PlaneGeometry(1200, 1200, resolution, resolution)
  geometry.dynamic = true
  geometry.verticesNeedUpdate = true
  // geometry.computeCentroids()

  const noise = new SimplexNoise()
  let n

  const factorX = 50
  const factorY = 25
  const factorZ = 60

  for (let i = 0; i < geometry.vertices.length; i++) {
    n = noise.noise(geometry.vertices[i].x / resolution / factorX, geometry.vertices[i].y / resolution / factorY)
    n -= 0.25
    geometry.vertices[i].z = n * factorZ
  }

  for (let f = 0; f < geometry.faces.length; f++) {
    const {color} = geometry.faces[f]
    const rand = Math.random() / 5
    geometry.faces[f].color.setRGB(color.r + rand, color.g + rand, color.b + rand)
  }

  const land = new THREE.Mesh(geometry, material)
  land.receiveShadow = true
  land.name = 'land'
  land.rotateX(-Math.PI / 2)
  land.position.set(0, 30, 0)

  const water_material = new THREE.MeshLambertMaterial({color: 0x6699ff, transparent: true, opacity: 0.75, vertexColors: THREE.FaceColors, shading: THREE.FlatShading})
  const water_geometry = new THREE.PlaneGeometry(1200, 1200, resolution, resolution)
  water_geometry.dynamic = true
  water_geometry.verticesNeedUpdate = true
  for (let i = 0; i < water_geometry.faces.length; i++) {
    const {color} = water_geometry.faces[i]
    const rand = Math.random()
    water_geometry.faces[i].color.setRGB(color.r + rand, color.g + rand, color.b + rand)
  }

  const water = new THREE.Mesh(water_geometry, water_material)
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
// scene.add(createTrees())

const treeModel = (function() {
  const treeData = {
    geom: {
      leaves: new THREE.CylinderGeometry(0, 25, 60, 4, 1),
      trunk: new THREE.BoxGeometry(5, 20, 5)
    },
    materials: {
      leaves: new THREE.MeshLambertMaterial({ color: 0x3EA055, shading: THREE.SmoothShading }),
      trunk: new THREE.MeshLambertMaterial({ color: 0x966F33, shading: THREE.SmoothShading })
    }
  }
  const tree = new THREE.Object3D()
  const leaves = new THREE.Mesh(treeData.geom.leaves, treeData.materials.leaves)
  const trunk = new THREE.Mesh(treeData.geom.trunk, treeData.materials.trunk)
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
})()

class Entity {
  constructor(color = 0xffffff) {
    this.pos      = new THREE.Vector3(0, 0, 0)
    this.destination = new THREE.Vector3(0, 0, 0)
    this.vel      = new THREE.Vector3(0, 0, 0)
    this.rotation = new THREE.Euler(0, 0, 0)
    this.timeMult = 1
    this.remove   = false
    this.shadow   = false
    this.state = null
    this.color = color
    this.create()
  }

  create() {
    const geometry = new THREE.BoxGeometry(10, 10, 10)
    const material = new THREE.MeshLambertMaterial({ color: 0xff0000, shading: THREE.SmoothShading })
    this.mesh = new THREE.Mesh(geometry, material)
    this.mesh.castShadow = true
  }
}

class Tree extends Entity {
  constructor(pos) {
    super()
    this.name = 'tree'
    this.pos = pos
    this.units = 4
  }

  create() {
    this.mesh = treeModel.clone()
  }
}

const tree = new Tree({x: 0, y: 0, z: 0})
console.log(tree)
scene.add(tree.mesh)

void function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}()
