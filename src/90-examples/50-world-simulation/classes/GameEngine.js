import * as THREE from '/node_modules/three119/build/three.module.js'
import { OrbitControls } from '/node_modules/three119/examples/jsm/controls/OrbitControls.js'
import Tree from './Tree.js'
import { rndInt } from '../utils/helpers.js'
import {generateTerrain} from '../utils/generateTerrain.js'

const TREES = 100
const { innerWidth, innerHeight } = window

class GameEngine {
  constructor() {
    this.entityId = 0
    this.fps = false
    this.paused = false
    this.entities = []
    this.clock = new THREE.Clock()
    this.delta = 0
    this.elapsed = 0
    this.camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 1, 5000)
    this.camera.position.y = this.camera.position.z = 500
    this.camera.lookAt(new THREE.Vector3(0, 0, 0))
    this.cameraFPS = new THREE.PerspectiveCamera(90, innerWidth / innerHeight, 1, 5000)
    this.scene = new THREE.Scene()
    this.renderer = new THREE.WebGLRenderer({ antialias: true, maxLights: 100, alpha: true })
    this.renderer.setSize(innerWidth, innerHeight)
    this.renderer.physicallyBasedShading = true
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMapAutoUpdate = true
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    document.body.appendChild(this.renderer.domElement)
  }

  addEntity(entity) {
    this.entities.push(entity)
    this.scene.add(entity.mesh)
  }

  getCloseEntity(name, position, range) {
    for (let i = 0; i < this.entities.length; i++) {
      const entity = this.entities[i]
      if (entity.name === name && !entity.remove && position.distanceTo(entity.pos) < range)
        return entity
    }
    return false
  }

  init() {
    this.scene.add(generateTerrain())
    this.initLights()
  }

  start() {
    const self = this
    void function gameLoop() {
      self.update()
      requestAnimationFrame(gameLoop)
      const camera = self.fps ? self.cameraFPS : self.camera
      self.renderer.render(self.scene, camera)
      self.elapsed = self.clock.getElapsedTime()
    }()
  }

  initLights() {
    const d = 500
    const dirLight = new THREE.DirectionalLight(0xffffcc, 0.5, 500)
    const hemiLight = new THREE.HemisphereLight(0xffffcc, 0xffffcc, 0.6)
    const pointLight = new THREE.PointLight(0xffffcc)

    // light for shadows
    dirLight.color.setHSL(0.1, 1, 0.95)
    dirLight.position.set(-1, 1.75, 1)
    dirLight.position.multiplyScalar(100)
    dirLight.position.copy(this.camera.position)
    dirLight.castShadow = true
    dirLight.shadow.mapSize.width = 2048
    dirLight.shadow.mapSize.height = 2048
    dirLight.shadow.camera.left = -d
    dirLight.shadow.camera.right = d
    dirLight.shadow.camera.top = d
    dirLight.shadow.camera.bottom = -d
    dirLight.shadow.camera.far = 3500
    dirLight.shadow.bias = -0.0001

    hemiLight.color.setHSL(0.6, 1, 0.6)
    hemiLight.groundColor.setHSL(0.095, 1, 0.75)
    hemiLight.position.set(0, 500, 0)

    pointLight.intensity = 0.75
    pointLight.position.copy(new THREE.Vector3(1000, 800, -1000))

    this.scene.add(dirLight)
    this.scene.add(hemiLight)
    this.scene.add(pointLight)
  }

  pause() {
    this.paused = this.paused ? false : true
  }

  plantTrees() {
    for (let i = 0; i < TREES; i++) {
      const rndPoint = new THREE.Vector3(rndInt(1100), 100, rndInt(1100))
      const collision = this.place(rndPoint)
      if (collision.y > 0) {
        collision.y -= 10
        this.addEntity(new Tree(collision))
      }
    }
  }

  place(position) {
    position.y += 200
    const caster = new THREE.Raycaster()
    const ray = new THREE.Vector3(0, -1, 0)
    caster.set(position, ray)
    const collisions = caster.intersectObject(this.scene.getObjectByName('terrain').children[0])
    if (collisions.length > 0) return collisions[0].point
    return position
  }

  placeEntity(entity) {
    const {x, y, z} = this.place(entity.mesh.position)
    entity.mesh.position.set(x, y, z)
    this.addEntity(entity)
  }

  randomPlaceEntity(entity) {
    entity.mesh.position.set(rndInt(1100), 0, rndInt(1100))
    this.placeEntity(entity)
  }

  switchCam() {
    if (this.fps)
      this.fps = false
    else {
      const mob = this.getCloseEntity('mob', new THREE.Vector3(0, 0, 0), 2000)
      mob.fps = true
      mob.log = true
      this.fps = true
      this.cameraFPS.position.copy(mob.pos)
      this.cameraFPS.position.y += 10
    }
  }

  update() {
    this.delta = this.clock.getDelta()
    this.entities.forEach(entity => {
      if (!entity.remove) entity.update(this.delta)
    })
    this.controls.update()
  }
}

export default new GameEngine()
