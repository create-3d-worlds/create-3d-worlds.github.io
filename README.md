# create-rpg-game

Create a role-playing game!

Repo: https://github.com/mudroljub/create-rpg-game

## Plan

### Mapa (*tilemaps*)

- [x] napraviti nekoliko *tilemap*-a
  - [x] implementirati algoritam za pravljenje lavirinta
- [x] renderovati mapu u 2d
- [x] renderovati mapu u 3d
  - [x] renderovati mapu sa teksturama

### Igrac

- [x] dodati igraca
- [x] prikazati polozaj igraca na mapi
- [x] omogućiti 2d kretanje kroz mapu
- [x] omogućiti 3d kretanje kroz mapu
- [x] dodati skakanje

### Kamere

- [x] dodati kameru iz prvog lica (fps)
- [x] dodati kameru odozgo (orbit)
- [x] menjati kamere na taster

### Kolizija

- [x] dodati koliziju kako se ne bi prolazilo kroz predmete
  - [x] probati koliziju bacanjem zraka
  - [x] probati koliziju geometrijom
- [x] postaviti lavirint sa kolizijom

### Prodecuralna geometrija

- [x] napraviti tlo
- [x] dodati koliziju na tlo
- [x] proceduralno kreirati okruženje
  - [x] dodati drveće, zgrade
  - [ ] dodati neke stvari (sanduke i slicno)
- [ ] kreirati stepenice u krug od kocki
- [ ] prebaciti da tlo bude okruglo
- [x] heightmap
- [ ] heightmap with texture (primer djavolja varos)
    - https://davideprati.com/2016/06/07/terrain-from-texture.html

### Modeli

- [ ] ucitati 3d model igraca
  - [ ] animirati model (kretanje, trčanje, skok...)
  - [ ] da se vide ruke iz prvog lica
- [ ] dodati NPC karaktere
- [ ] ucitati raspolozive modele vozila i kuca
  - [ ] dodati avion kako nadlece
  - [ ] dodati tenk kako se krece
- [ ] reagovati na koliziju
- https://threejsfundamentals.org/threejs/lessons/threejs-load-obj.html

### Fizika

- [ ] dodati fiziku https://github.com/chandlerprall/Physijs
- [ ] dodati fiziku na proceruralni zamak i top koji puca i rusi zidine

### Mehanika igre

- [ ] napraviti inventar
- [ ] postaviti objekte za sakupljanje i okidace za njih
  - https://www.the-art-of-web.com/javascript/maze-game/#box1 (2D)
  - https://threejs.org/examples/?q=cube#webgl_interactive_cubes
  - https://threejsfundamentals.org/threejs/lessons/threejs-picking.html
  - https://codepen.io/kintel/pen/ZboOxw

### Nivoi

- [ ] napraviti igrive nivoe
  - [ ] bežanje od štuke koja bombarduje
  - [ ] skrivanje od reflektora logora

### Ostalo

- [ ] probati VR
  - https://threejs.org/docs/#manual/en/introduction/How-to-create-VR-content
- [ ] Dodati panoramu (skybox)

## Documentation

Prikazuje pomocnu strelicu za raycaster:

```
scene.add(new THREE.ArrowHelper(raycaster.ray.direction, raycaster.ray.origin, 300))
```

All libraries in `/libs` folder are updated by hand to support ES6 export.

## Resursi

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
