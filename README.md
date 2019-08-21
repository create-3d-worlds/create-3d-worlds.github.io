# Create RPG game with Three.js

Create a role-playing game!

Repo: https://github.com/mudroljub/create-rpg-game

## Curriculum

You should know how to [create a scene](https://threejs.org/docs/index.html#manual/en/introduction/Creating-a-scene) in Three.js. We will jump over that very first lesson.

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

### Camera

- [x] dodati kameru iz prvog lica (fps)
- [x] dodati kameru odozgo (orbit)
- [x] menjati kamere na taster

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

### 3D Models

- [x] dodati 3d model
- [x] dodati animirani 3d model
  - [ ] kontrolama menjati animacije (kretanje, trčanje, skok...)
  - [ ] da se vide ruke iz prvog lica
    - https://mugen87.github.io/yuka/examples/entity/shooter/
    - https://mugen87.github.io/yuka/examples/playground/hideAndSeek/
- [ ] dodati NPC karaktere
  - https://www.script-tutorials.com/demos/474/index3.html
- [ ] ucitati raspolozive modele vozila i kuca
  - [ ] dodati avion kako nadlece
  - [ ] dodati tenk kako se krece
- [ ] srediti pufnicu (dodati jos malo geometrije i neku boju, materijal, teksturu...)

### Physics

- [ ] dodati fiziku https://github.com/chandlerprall/Physijs
- [ ] dodati fiziku na proceruralni zamak i top koji puca i rusi zidine

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

- [ ] probati VR
  - https://threejs.org/docs/#manual/en/introduction/How-to-create-VR-content
- [ ] Dodati panoramu (skybox)
- [ ] naci vismapu sutjeske
  - http://www.smartjava.org/content/threejs-render-real-world-terrain-heightmap-using-open-data/
  - https://blog.mapbox.com/bringing-3d-terrain-to-the-browser-with-three-js-410068138357

## Documentation

Raycaster arrow helper:

```
scene.add(new THREE.ArrowHelper(raycaster.ray.direction, raycaster.ray.origin, 300))
```

All libraries in `/libs` folder are updated by hand to support ES6 export.

## Resources

- [Build a basic combat game with three.js](http://www.creativebloq.com/web-design/build-basic-combat-game-threejs-101517540)
- https://github.com/mudroljub/3D-RPG-Game-With-THREE.js
- https://github.com/mudroljub/threejs-monster
- https://github.com/mudroljub/rpg-threejs (school project)

- https://github.com/skolakoda/ucimo-threejs
- https://github.com/skolakoda/teorija-razvoja-igara
- https://github.com/skolakoda/ucimo-razvoj-igara

- https://github.com/mudroljub/savo-mitraljezac
- https://github.com/mudroljub/igrica-partizani
- https://github.com/mudroljub/avantura-1941
