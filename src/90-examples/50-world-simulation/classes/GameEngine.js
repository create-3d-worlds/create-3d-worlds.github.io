import * as THREE from '/node_modules/three127/build/three.module.js'
import { scene, camera, renderer, createOrbitControls } from '/utils/scene.js'
import { randomInt, putOnTerrain, checkIntersect } from '/utils/helpers.js'
import { hemLight, dirLight } from '/utils/light.js'
import { createEnvironment } from '/utils/ground/createHillyTerrain.js'
import Tree from './Tree.js'

const TREES = 75
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
    this.camera = camera
    this.camera.position.set(0, 500, 500)
    this.cameraFPS = new THREE.PerspectiveCamera(90, innerWidth / innerHeight, 1, 5000)
    this.scene = scene
    this.renderer = renderer
    this.controls = createOrbitControls()
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
    this.scene.add(createEnvironment())
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
    dirLight({ color: 0xffffcc })
    hemLight({ color: 0xffffcc, intensity: .6 })
  }

  pause() {
    this.paused = this.paused ? false : true
  }

  plantTrees() {
    putOnTerrain({
      size: 1200,
      terrain: this.scene.getObjectByName('terrain'),
      total: TREES,
      callBack: pos => this.addEntity(new Tree(pos))
    })
  }

  place(position) {
    return checkIntersect(this.scene.getObjectByName('terrain'), position) || position
  }

  randomPlaceEntity(entity) {
    entity.mesh.position.set(randomInt(-550, 550), 0, randomInt(-550, 550))
    const { x, y, z } = this.place(entity.mesh.position)
    entity.mesh.position.set(x, y, z)
    this.addEntity(entity)
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
