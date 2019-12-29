## Space Invaders Javascript Implementation using HTML5 \<canvas>

This is my JS only implementation of space invaders. The game is rendered in a HTML5 \<canvas> container.

<b>PLAY IT HERE:</b>
https://herzog-ch.github.io/space-invaders/

### Code structure

The entry point of the game can be found in js/main.js.
The function loop() calls itself endlessly.
A state machine is implemented in loop() to handle the different game states (menu, gameplay, highscore).
The gamelogic itself is separated from the rendering calls (calcGameLogic() and showGameScreen()).
Following the calls in the loop()-function, the software architecture should be pretty easy to follow.

### Spritesheet

All graphics are taken from a single spritesheet for space invaders. The spritesheet is located in js/spritesheet_src.js a base64-encoded string.

### Sounds

Sounds in [assets\sounds](./assets/sounds) are downloaded from http://www.classicgaming.cc/classics/space-invaders/sounds

### License

This software is licensed under the GNU GENERAL PUBLIC LICESE Version 3, 29 June 2007.
