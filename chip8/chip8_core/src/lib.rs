use rand::Rng;

const RAM_SIZE: usize = 4096;
const NUM_REGISTERS: usize = 16;
const STACK_SIZE: usize = 16;
const NUM_KEYS: usize = 16;
pub const SCREEN_WIDTH: usize = 64;
pub const SCREEN_HEIGHT: usize = 32;
const START_ADDRESS: u16 = 0x200;
const FONTSET_SIZE: usize = 80;
const FONTSET: [u8; FONTSET_SIZE] = [
    0xF0, 0x90, 0x90, 0x90, 0xF0, // 0
    0x20, 0x60, 0x20, 0x20, 0x70, // 1
    0xF0, 0x10, 0xF0, 0x80, 0xF0, // 2
    0xF0, 0x10, 0xF0, 0x10, 0xF0, // 3
    0x90, 0x90, 0xF0, 0x10, 0x10, // 4
    0xF0, 0x80, 0xF0, 0x10, 0xF0, // 5
    0xF0, 0x80, 0xF0, 0x90, 0xF0, // 6
    0xF0, 0x10, 0x20, 0x40, 0x40, // 7
    0xF0, 0x90, 0xF0, 0x90, 0xF0, // 8
    0xF0, 0x90, 0xF0, 0x10, 0xF0, // 9
    0xF0, 0x90, 0xF0, 0x90, 0x90, // A
    0xE0, 0x90, 0xE0, 0x90, 0xE0, // B
    0xF0, 0x80, 0x80, 0x80, 0xF0, // C
    0xE0, 0x90, 0x90, 0x90, 0xE0, // D
    0xF0, 0x80, 0xF0, 0x80, 0xF0, // E
    0xF0, 0x80, 0xF0, 0x80, 0x80, // F
];

pub struct Emulator {
    pc: u16,
    ram: [u8; RAM_SIZE],
    screen: [bool; SCREEN_WIDTH * SCREEN_HEIGHT],
    v_registers: [u8; NUM_REGISTERS],
    i_registers: u16,
    stack: [u16; STACK_SIZE],
    stack_pointer: u16,
    keys_input: [bool; NUM_KEYS],
    sound_timer: u8,
    delay_timer: u8,
}

impl Default for Emulator {
    fn default() -> Self {
        Self::new()
    }
}

impl Emulator {
    pub fn new() -> Self {
        let mut emulator = Self {
            pc: START_ADDRESS,
            ram: [0; RAM_SIZE],
            screen: [false; SCREEN_WIDTH * SCREEN_HEIGHT],
            v_registers: [0; NUM_REGISTERS],
            i_registers: 0,
            stack: [0; STACK_SIZE],
            stack_pointer: 0,
            keys_input: [false; NUM_KEYS],
            sound_timer: 0,
            delay_timer: 0,
        };

        emulator.ram[..FONTSET_SIZE].copy_from_slice(&FONTSET);

        emulator
    }

    pub fn reset(&mut self) {
        self.pc = START_ADDRESS;
        self.ram = [0; RAM_SIZE];
        self.screen = [false; SCREEN_WIDTH * SCREEN_HEIGHT];
        self.v_registers = [0; NUM_REGISTERS];
        self.i_registers = 0;
        self.stack_pointer = 0;
        self.stack = [0; STACK_SIZE];
        self.keys_input = [false; NUM_KEYS];
        self.delay_timer = 0;
        self.sound_timer = 0;
        self.ram[..FONTSET_SIZE].copy_from_slice(&FONTSET);
    }

    fn push(&mut self, v: u16) {
        self.stack[self.stack_pointer as usize] = v;
        self.stack_pointer += 1;
    }

    fn pop(&mut self) -> u16 {
        self.stack_pointer -= 1;
        self.stack[self.stack_pointer as usize]
    }

    pub fn tick(&mut self) -> Result<(), String>{
        let opcode = self.fetch();
        //decode and execute
        self.execute(opcode)
    }

    fn fetch(&mut self) -> u16 {
        let front_byte = self.ram[self.pc as usize] as u16;
        let back_byte = self.ram[(self.pc + 1) as usize] as u16;
        let opcode = (front_byte << 8) | back_byte;
        self.pc += 2;
        opcode
    }

    fn execute(&mut self, opcode: u16) -> Result<(), String>{
        //decode the opcode into 4 parts
        //AND the opcode with a number to get the digit in the position we want
        //each digit is 4 bit => 16 possibilities
        let digit1 = (opcode & 0xF000) >> 12;
        let digit2 = ((opcode & 0x0F00) >> 8) as usize;
        let digit3 = ((opcode & 0x00F0) >> 4) as usize;
        let digit4 = opcode & 0x000F;

        match (digit1, digit2, digit3, digit4) {
            //FX65, load I into V0 - VX
            (0xF, _, 6, 5) => {
                let x = digit2;
                let i = self.i_registers as usize;
                for idx in 0..=x {
                    self.v_registers[idx] = self.ram[idx + i];
                }
            }

            //FX55, store V0 - VX into I
            (0xF, _, 5, 5) => {
                let x = digit2;
                let i = self.i_registers as usize;
                for idx in 0..=x {
                    self.ram[i + idx] = self.v_registers[idx];
                }
            }
            //FX33, store the Binary-Coded Decimal of a number stored in VX into the I Register
            (0xF, _, 3, 3) => {
                let x = digit2;
                let vx = self.v_registers[x] as f32;

                let hundreds = (vx / 100.0).floor() as u8;
                let tens = ((vx / 10.0) % 10.0).floor() as u8;
                let ones = (vx % 10.0) as u8;

                self.ram[self.i_registers as usize] = hundreds;
                self.ram[(self.i_registers + 1) as usize] = tens;
                self.ram[(self.i_registers + 2) as usize] = ones;
            }
            //FX29, set I to font address
            (0xF, _, 2, 9) => {
                let x = digit2;
                let f = self.v_registers[x] as u16;
                //each font is 5 bytes
                self.i_registers = f * 5;
            }
            //FX1E , add VX to I
            (0xF, _, 1, 0xE) => {
                let x = digit2;
                self.i_registers = self.i_registers.wrapping_add(self.v_registers[x] as u16);
            }
            //FX18, set ST = VX
            (0xF, _, 1, 8) => {
                let x = digit2;
                self.sound_timer = self.v_registers[x];
            }
            //FX15, set DT = VX
            (0xF, _, 1, 5) => {
                let x = digit2;
                self.delay_timer = self.v_registers[x];
            }
            //FX0A, wait for key press
            (0xF, _, 0, 0xA) => {
                let x = digit2;
                let mut pressed = false;
                for i in 0..self.keys_input.len() {
                    if self.keys_input[i] {
                        self.v_registers[x] = i as u8;
                        pressed = true;
                        break;
                    }
                }

                if !pressed {
                    //Redo this opcode
                    self.pc -= 2;
                }
            }
            //FX07, set VX = DT
            (0xF, _, 0, 7) => {
                let x = digit2;
                self.v_registers[x] = self.delay_timer;
            }
            //EXA1, skip if key not pressed
            (0xE, _, 0xA, 1) => {
                let x = digit2;
                let key = self.keys_input[self.v_registers[x] as usize];
                if !key {
                    self.pc += 2;
                }
            }
            //EX9E, skip if key pressed
            (0xE, _, 9, 0xE) => {
                let x = digit2;
                let key = self.keys_input[self.v_registers[x] as usize];
                if key {
                    self.pc += 2;
                }
            }
            //DXYN, draw sprite
            (0xD, ..) => {
                // Get the (x, y) coords for our sprite
                let x_coord = self.v_registers[digit2] as u16;
                let y_coord = self.v_registers[digit3] as u16;
                // The last digit determines how many rows high our sprite is
                let num_rows = digit4;

                // Keep track if any pixels were flipped
                let mut flipped = false;
                // Iterate over each row of our sprite
                for y_line in 0..num_rows {
                    // Determine which memory address our row's data is stored
                    let addr = self.i_registers + y_line;
                    let pixels = self.ram[addr as usize];
                    // Iterate over each column in our row
                    for x_line in 0..8 {
                        // Use a mask to fetch current pixel's bit. Only flip if a 1
                        if (pixels & (0b1000_0000 >> x_line)) != 0 {
                            // Sprites should wrap around screen, so apply modulo
                            let x = (x_coord + x_line) as usize % SCREEN_WIDTH;
                            let y = (y_coord + y_line) as usize % SCREEN_HEIGHT;

                            // Get our pixel's index in the 1D screen array
                            let idx = x + SCREEN_WIDTH * y;
                            // Check if we're about to flip the pixel and set
                            flipped |= self.screen[idx];
                            self.screen[idx] ^= true;
                        }
                    }
                }
                // Populate VF register
                if flipped {
                    self.v_registers[0xF] = 1;
                } else {
                    self.v_registers[0xF] = 0;
                }
            }
            //CXNN, VX = rand() & NN
            (0xC, ..) => {
                let x = digit2;
                let nn = (opcode & 0xFF) as u8;
                let random_num: u8 = rand::thread_rng().gen();
                self.v_registers[x] = random_num & nn;
            }
            //BNNN, jump to V0 + NNN
            (0xB, ..) => {
                let nnn = opcode & 0xFFF;
                self.pc = (self.v_registers[0] as u16) + nnn;
            }
            //ANNN, set I register = NNN address
            (0xA, ..) => {
                self.i_registers = opcode & 0xFFF;
            }
            //9XY0, skip next if VX != VY
            (9, _, _, 0) => {
                let x = digit2;
                let y = digit3;
                if self.v_registers[x] != self.v_registers[y] {
                    self.pc += 2;
                }
            }
            //8XYE, left shift VX value
            (8, _, _, 0xE) => {
                let x = digit2;
                self.v_registers[0xF] = (self.v_registers[x] >> 7) & 1;
                self.v_registers[x] <<= 1;
            }
            //8XY7, subtract value VY register by VX value
            (8, _, _, 7) => {
                let x = digit2;
                let y = digit3;
                let (value, borrow) = self.v_registers[y].overflowing_sub(self.v_registers[x]);

                self.v_registers[x] = value;
                self.v_registers[0xF] = if borrow { 0 } else { 1 };
            }
            //8XY6, right shift VX value
            (8, _, _, 6) => {
                let x = digit2;
                self.v_registers[0xF] = self.v_registers[x] & 1;
                self.v_registers[x] >>= 1;
            }
            //8XY5, subtract value VX register by VY value
            (8, _, _, 5) => {
                let x = digit2;
                let y = digit3;
                let (v, borrow) = self.v_registers[x].overflowing_sub(self.v_registers[y]);

                self.v_registers[x] = v;
                self.v_registers[0xF] = if borrow { 0 } else { 1 };
            }
            //8XY4, add value in VY register to VX register
            (8, _, _, 4) => {
                let x = digit2;
                let y = digit3;
                let (value, carry) = self.v_registers[x].overflowing_add(self.v_registers[y]);

                self.v_registers[x] = value;
                //flag register
                self.v_registers[0xF] = if carry { 1 } else { 0 };
            }
            //8XY3, XOR value in VX and VY register
            (8, _, _, 3) => {
                let x = digit2;
                let y = digit3;
                self.v_registers[x] ^= self.v_registers[y];
            }
            //8XY2, AND value in VX and VY register
            (8, _, _, 2) => {
                let x = digit2;
                let y = digit3;
                self.v_registers[x] &= self.v_registers[y];
            }
            //8XY1, OR value in VX and VY register
            (8, _, _, 1) => {
                let x = digit2;
                let y = digit3;
                self.v_registers[x] |= self.v_registers[y];
            }
            //8XY0, set value in Vy register to VX register
            (8, _, _, 0) => {
                let x = digit2;
                let y = digit3;
                self.v_registers[x] = self.v_registers[y];
            }
            //7XNN, add NN to VX register
            (7, ..) => {
                let x = digit2;
                let nn = (opcode & 0xFF) as u8;
                self.v_registers[x] = self.v_registers[x].wrapping_add(nn);
            }
            //6XNN, set nn to VX register
            (6, ..) => {
                let x = digit2;
                let nn = (opcode & 0xFF) as u8;
                self.v_registers[x] = nn;
            }
            //5XY0, skip next if VX == VY
            (5, ..) => {
                let x = digit2;
                let y = digit3;
                if self.v_registers[x] == self.v_registers[y] {
                    self.pc += 2;
                }
            }
            //4XNN, skip next if VX != NN
            (4, ..) => {
                let x = digit2;
                let nn = (opcode & 0xFF) as u8;
                if self.v_registers[x] != nn {
                    self.pc += 2;
                }
            }
            //3XNN, skip next if VX == NN
            (3, ..) => {
                let x = digit2;
                let nn = (opcode & 0xFF) as u8;
                if self.v_registers[x] == nn {
                    self.pc += 2;
                }
            }
            //2NNN, call subroutine
            (2, ..) => {
                //push return address into the stack
                self.push(self.pc);
                //give pc subroutine's address
                self.pc = opcode & 0xFFF;
            }
            //1NNN, jump
            (1, ..) => self.pc = opcode & 0xFFF,
            //return
            (0, 0, 0xE, 0xE) => self.pc = self.pop(),
            //clear screen
            (0, 0, 0xE, 0) => self.screen = [false; SCREEN_WIDTH * SCREEN_HEIGHT],
            (0, 0, 0, 0) => (),
            (..) => return Err(format!("Unimplemented opcode: {}", opcode)),
        }

        Ok(())
    }

    pub fn tick_timers(&mut self) {
        if self.delay_timer > 0 {
            self.delay_timer -= 1;
        }

        if self.sound_timer > 0 {
            if self.sound_timer == 1 {
                //BEEP
                println!("BEEP BEEP BEEP BEEP BEEP!!!");
            }
            self.sound_timer -= 1;
        }
    }

    pub fn get_display(&self) -> &[bool] {
        &self.screen
    }

    pub fn key_press(&mut self, id: usize, pressed: bool) {
        self.keys_input[id] = pressed;
    }

    pub fn load(&mut self, data: &[u8]) {
        let start = START_ADDRESS as usize;
        let end = (START_ADDRESS + (data.len() as u16)) as usize;
        self.ram[start..end].copy_from_slice(data);
    }

    pub fn get_pc(&mut self) -> u16 {
        self.pc
    }
}
