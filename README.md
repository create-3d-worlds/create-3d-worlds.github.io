# Create RPG game with Three.js

Create a role-playing game!

Repo: https://github.com/mudroljub/create-rpg-game

## Start

```
npm i
live-server
```

## Curriculum

<!-- You should know how to [create a scene](https://threejs.org/docs/index.html#manual/en/introduction/Creating-a-scene) in Three.js. We will jump over that very first lesson. -->

### Geometry

- [x] create a box
- [x] create a lot of boxes
- [x] create other basic shapes
- [x] add texture

### Tilemaps

- [x] napraviti nekoliko *tilemap*-a
  - [x] implementirati algoritam za pravljenje lavirinta
- [x] renderovati mapu u 2d
- [x] renderovati mapu u 3d
  - [x] renderovati mapu sa teksturama

### Player

- [x] dodati igraca
- [x] prikazati polozaj igraca na mapi
- [x] omogućiti 2d kretanje kroz mapu
- [x] omogućiti 3d kretanje kroz mapu
- [x] dodati skakanje
- [ ] vratiti kontrole na strelice
- [ ] probati da Kamenko bude od lave (vidi shader example)

### Camera

- [x] dodati kameru iz prvog lica (fps)
- [x] dodati kameru odozgo (orbit)
- [x] menjati kamere na taster
- [x] srediti redom kamere po scenama
- [ ] kreirati finalne kamere za ambient i fps (da moze da gleda levo-desno i gore-dole i sl.)

### Collision

- [x] dodati koliziju kako se ne bi prolazilo kroz predmete
  - [x] probati koliziju bacanjem zraka
  - [x] probati koliziju geometrijom
- [x] postaviti lavirint sa kolizijom

### Terrain (procedural generation, heightmap, textures)

- [x] napraviti tlo
- [x] dodati koliziju na tlo
- [x] proceduralno kreirati okruženje
  - [x] dodati drveće, zgrade
  - [x] dodati sanduke sa teksturom
- [x] prebaciti da tlo bude okruglo (moze samo kad je ravna podloga)
- [x] heightmap
- [x] heightmap with texture
- [x] kreirati stepenice u krug od kocki
- [x] kreirati funkciju similarColor
- [ ] proceduralni grad: promeniti boju krova

### 3D Models

- [x] dodati 3d model
- [x] dodati animirani 3d model
  - [x] ucitati fbx zensku iz rpg-a
  - [x] kontrolama menjati animacije (kretanje, trčanje, skok...)
- [x] srediti pufnicu (dodati jos malo geometrije i neku boju, materijal, teksturu...)
  - [x] srediti skok i padanje
  - [ ] srediti penjanje uz stepenice
- [x] odvojiti mesh od Avatara
- [x] odvojiti klase Player i Model
- [x] napraviti izvedene klase koje nasledjuju Model (Dupechesh, Robotko, Girl i sl)
- [x] spojiti klase Avatar i Player

### Scenes

- [ ] dodati ruke iz prvog lica (Savo)
  - https://mugen87.github.io/yuka/examples/entity/shooter/
  - https://mugen87.github.io/yuka/examples/playground/hideAndSeek/
- [ ] dodati NPC karaktere
  - https://www.script-tutorials.com/demos/474/index3.html
- [ ] dodati neke modele vozila i kuca
  - [ ] dodati avion kako nadlece
  - [ ] dodati tenk kako se krece

### Physics

- [ ] dodati fiziku https://github.com/chandlerprall/Physijs
- [ ] dodati fiziku na proceruralni zamak i top koji puca i rusi zidine
- [ ] tenk (steam tenk) koji gazi prepreke
  - http://127.0.0.1:8080/15-fizika/70-vozilo/
  - http://127.0.0.1:8080/15-fizika/75-vozilo-razbija/

### Gameplay

- [ ] napraviti inventar
- [ ] postaviti objekte za sakupljanje i okidace za njih
  - https://www.the-art-of-web.com/javascript/maze-game/#box1 (2D)
  - https://threejs.org/examples/?q=cube#webgl_interactive_cubes
  - https://threejsfundamentals.org/threejs/lessons/threejs-picking.html
  - https://codepen.io/kintel/pen/ZboOxw

### Levels

- [ ] bežanje od štuke koja bombarduje
- [ ] skrivanje od reflektora logora
- [ ] razaranje zamka topom (dodati fiziku)

### Ostalo

- [ ] Dodati panoramu (skybox) nebo/zvezde
- [ ] probati VR
  - https://threejs.org/docs/#manual/en/introduction/How-to-create-VR-content
  - https://ski-mountain-vr.herokuapp.com/
- [ ] dodati preloader (ima u 3D-RPG-Game-With-THREE.js)
- [ ] naci vismapu sutjeske
  - http://www.smartjava.org/content/threejs-render-real-world-terrain-heightmap-using-open-data/
  - https://blog.mapbox.com/bringing-3d-terrain-to-the-browser-with-three-js-410068138357
- [ ] dodati eksplozije
    - http://jeromeetienne.github.io/fireworks.js/

## Documentation

Raycaster arrow helper:

```
scene.add(new THREE.ArrowHelper(raycaster.ray.direction, raycaster.ray.origin, 300))
```

All libraries in `/libs` folder are updated by hand to support ES6 export.

## Resources

```js
// TODO: reuse drawPlayer
Camera.prototype.drawWeapon = function(weapon, paces) {
  const bobX = Math.cos(paces * 2) * this.scale * 6
  let bobY = Math.sin(paces * 4) * this.scale * 6
  let left = this.width * 0.20 + bobX
  let top = this.height * 0.6 + bobY
  this.ctx.drawImage(weapon.image, left, top, weapon.width * this.scale, weapon.height * this.scale)
}

// TODO: reuse randomWalls
Map.prototype.randomize = function() {
  for (let i = 0; i < this.size * this.size; i++) {
    this.wallGrid[i] = Math.random() < 0.3 ? 1 : 0
  }
}

// TODO: reuse lightning
Map.prototype.update = function(dt) {
  if (this.light > 0) {
    this.light = Math.max(this.light - 10 * dt, 0)
  }
  else if (Math.random() * 5 < dt) {
    this.light = 2
    this.grom.volume = Math.random()
    this.grom.play()
  }
}
```

- https://github.com/skolakoda/ucimo-threejs
- https://github.com/skolakoda/teorija-razvoja-igara
- https://github.com/skolakoda/ucimo-razvoj-igara

- https://github.com/mudroljub/savo-mitraljezac
- https://github.com/mudroljub/igrica-partizani
- https://github.com/yakudoo/TheAviator
- https://github.com/juwalbose/ThreeJSEndlessRunner3D
- https://github.com/mudroljub/mini-rpg (dodati modele zivotinja i sl)
- https://github.com/mudroljub/1943
