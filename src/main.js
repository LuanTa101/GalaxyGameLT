// debug with extreme prejudice
"use strict"
// game config
let config = {
    parent: 'phaser-game',
    type: Phaser.CANVAS,
    render: {
        pixelArt: true  // prevent pixel art from getting blurred when scaled
    },
    width: 1024,
    height: 1024,
    scene: [Title,  BlackScreen, lvl1, lvl2, lvl3, Credits, HS],
    fps: { forceSetTimeOut: true, target: 60 }
}
const game = new Phaser.Game(config);