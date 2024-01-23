-- Add up migration script here
insert into games (name, author_id, url, avatar_url, about, info, tags, rom)
values (
    '15 Puzzle',
    40195902,
    'https://www.uvlist.net/game-38164-15+Puzzle',
    'https://s.uvlist.net/l/y2020/05/202499.jpg',
    'Scramble and slide pixelated tiles back into order, one satisfying blip at a time!',
    '## The Challenging Charm of the 15 Puzzle: Chip-8 Edition Picture a scrambled grid of numbered tiles, a race against the clock, and the satisfaction of meticulously putting it all back in place. That''s the essence of the 15 Puzzle, a timeless brain teaser that''s found its way onto countless platforms, including the retro world of Chip-8 games.',
    '{"Puzzle"}',
    ''
),
(
    'Blinky',
    40195902,
    'https://github.com/badlogic/chip8/blob/master/roms/sources/BLINKY.SRC',
    'https://user-images.githubusercontent.com/39998050/185288501-5d05b9bd-c127-4529-b4b6-7fce6584a8cc.png',
    'Help Pac-Man navigate a maze and gobble dots while avoiding pesky ghosts in this retro arcade classic.',
    'This game is a clone of Pac-Man, where you control a character that resembles Pac-Man and must eat all the dots in a maze while avoiding four ghost enemies, including Blinky. The game is simple but addictive, and it''s a great way to experience a classic arcade game on a modern computer.',
    '{"PacMan", "Maze"}',
    ''
),
(
    'Space Invaders',
    40195902,
    'https://firmwaresecurity.com/tag/space-invaders/',
    'https://imanolfotia.com/Chip-8-Emulator/captures/c3.png',
    'Blast those alien invaders!',
    'Brace yourself for a retro showdown in Chip-8 Space Invaders! As Earth''s lone defender, you pilot a lone laser cannon against waves of descending pixelated aliens. Aim and fire with meticulous precision, dodging their fiery projectiles and shattering their blocky formations. Each wave brings more invaders and faster attacks, testing your reflexes and strategic thinking. Can you master the arcade charm of this classic and repel the alien threat before it''s too late? Remember, with every invader you blast, you protect our pixelated planet and preserve your nostalgic gaming glory!',
    '{"Shooting", "Alien", "Space"}',
    ''
),
(
    'Tank',
    40195902,
    '',
    'https://i.ytimg.com/vi/Ix5wIscBOW0/maxresdefault.jpg',
    'Shooting and dodging!',
    'Navigate intricate, pixelated mazes in your trusty tank, strategically firing shots at enemy targets while avoiding deadly obstacles and collecting power-ups. Master tricky controls, dodge surprise ambushes, and conquer increasingly challenging levels to reign supreme in this classic Chip-8 arcade adventure.',
    '{"Shooting", "Tank"}',
    ''
),
(
    'Tetris',
    40195902,
    'https://github.com/leonmavr/chip-8/blob/master/roms/Tetris.txt',
    'https://ajor.co.uk/images/chip8/tetris.png',
    'Stack, rotate, and clear!',
    'Tetris for the pixelated generation, Chip-8 style! Guide cascading tetriminos through a blocky grid, rotating and maneuvering them to clear complete lines and rack up points. The classic gameplay shines in this nostalgic black-and-white world, with every cleared line and thrilling near-miss amplifying the retro charm. So sharpen your reflexes, embrace the challenge, and see how high you can climb in this pixelated Tetris paradise.',
    '{"Puzzle"}',
    ''
),
(
    'Pong',
    40195902,
    'https://github.com/badlogic/chip8/blob/master/roms/sources/PONG.SRC',
    'https://i.ytimg.com/vi/MvI7mOd-o9E/maxresdefault.jpg',
    'Pixel Paddle War',
    'Step into a retro arena where two pixelated paddles wage war against a bouncing block. In the Chip-8 Pong, reflexes reign supreme as you maneuver your paddle, deflecting the elusive ball back and forth across the screen. Rack up points with each successful return, pushing your opponent closer to defeat. Master the timing, anticipate your rival''s moves, and claim victory in this timeless pixelated showdown!',
    '{"Balls"}',
    ''
),
(
    'UFO',
    40195902,
    'https://github.com/alexanderdickson/Chip-8-Emulator/blob/master/roms/UFO',
    'https://s.uvlist.net/107066/screenshot/UFO%20(Chip%208).jpg',
    'Defend your planet from UFO!',
    'As the sole defender of Earth, you pilot a laser-bristling spaceship and maneuver through a star-studded sky, dodging asteroids and obliterating UFOs of various shapes and sizes. Each blast unleashes a satisfying blip, and every vanquished invader earns you points. The challenge escalates as waves of increasingly aggressive UFOs descend, testing your reflexes and strategic thinking. Can you hold your ground against the extraterrestrial onslaught and protect your planet in this addictive retro adventure?',
    '{"UFO", "Space", "Alien", "Shooting"}',
    ''
);
