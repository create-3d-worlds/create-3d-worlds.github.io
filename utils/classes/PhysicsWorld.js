import { scene as defaultScene } from '/utils/scene.js'
import { createPhysicsWorld, createRigidBody, updateMesh } from '/utils/physics.js'

export default class PhysicsWorld {
  constructor({ scene = defaultScene, maxSteps = 10 } = {}) {
    this.scene = scene
    this.maxSteps = maxSteps
    this.rigidBodies = []
    this.physicsWorld = createPhysicsWorld()
  }

  add(mesh, mass, friction) {
    if (!mesh.userData.body) mesh.userData.body = createRigidBody({ mesh, mass, friction })
    this.physicsWorld.addRigidBody(mesh.userData.body)
    this.rigidBodies.push(mesh)
    if (this.scene) this.scene.add(mesh)
  }

  remove(mesh) {
    if (!this.rigidBodies.includes(mesh)) return
    this.physicsWorld.removeRigidBody(mesh.userData.body)
    this.rigidBodies.splice(this.rigidBodies.indexOf(mesh), 1)
    if (this.scene) this.scene.remove(mesh)
  }

  update(dt) {
    this.physicsWorld.stepSimulation(dt, this.maxSteps)
    this.rigidBodies.forEach(updateMesh)
  }
}
