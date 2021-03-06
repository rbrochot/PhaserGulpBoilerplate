# PhaserGulpBoilerplate

Small Asteroid game.
Serves as a Phaser boilerplate with gulp and some useful modules like:
 - babel for ES2016
 - browsersync

Thanks and credits:
 - https://github.com/eleiva/phaser-matchingpairs-es6.git
 - http://phaser.io/
 - Space Shooter graphics by Kenney Vleugels (www.kenney.nl)

==================
## BUILD OBJECTIVES
==================

 - generic index.html with all JS (src + libs) and CSS dynamicaly injected
 - prod: 2 files: app.js & lib.js, all in a zip, and src-maps aside
 - prod: ideally, keep libs as independent files (and get from CDN if possible)
 - dev: same with srcmap included? or independent files? => more like independent files, should be quicker to build
 - dev: watcher thats only compiles what's changed

=========
## TODO
=========

### GAME
========
 - dependency injection for "services": keyboard, factories, shared emitters (and maybe not shared, via not singleton dependency injection), etc. => no DI, just shared objects (DI would be such a mess with states management)
 - Simple menu (start, game over)
 - Use Phaser.Weapon?
 - Sounds

### BUILD
========
 - Add JSHint and JSCS checks in build
 - Why is phaser in game.js ? and reorganise files output => http://stackoverflow.com/questions/18169240/how-to-ignore-libraries-in-browserify-programmatic-api
 - Make libs integration dynamic: list of dependencies and injection in HTML (CSS too)
 - Dynamic watcher
 - Why watcher crashes 1/2 times?
 - Add https://github.com/babel/babel-preset-env for babel conf
