use chip8_core::*;
use js_sys::Uint8Array;
use wasm_bindgen::{prelude::*, JsCast};
use web_sys::{CanvasRenderingContext2d, HtmlCanvasElement, KeyboardEvent};

#[wasm_bindgen]
pub struct EmuWasm {
    emu: Emulator,
    context: CanvasRenderingContext2d,
}

#[wasm_bindgen]
impl EmuWasm {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Result<EmuWasm, JsValue> {
        let emu = Emulator::new();

        let document = web_sys::window().unwrap().document().unwrap();
        let canvas = document.get_element_by_id("canvas").unwrap();
        let canvas: HtmlCanvasElement = canvas
            .dyn_into::<HtmlCanvasElement>()
            .map_err(|_| ())
            .unwrap();
        let context = canvas
            .get_context("2d")
            .unwrap()
            .unwrap()
            .dyn_into::<CanvasRenderingContext2d>()
            .unwrap();

        Ok(EmuWasm { emu, context })
    }
}

#[wasm_bindgen]
impl EmuWasm {
    #[wasm_bindgen]
    pub fn tick(&mut self) -> Result<(), String> {
        self.emu.tick()
    }
    #[wasm_bindgen]
    pub fn tick_timers(&mut self) {
        self.emu.tick_timers();
    }

    #[wasm_bindgen]
    pub fn reset(&mut self) {
        self.emu.reset();
    }
    #[wasm_bindgen]
    pub fn get_pc(&mut self) -> u16 {
        self.emu.get_pc()
    }

    #[wasm_bindgen]
    pub fn load_game(&mut self, data: Uint8Array) {
        self.emu.load(&data.to_vec());
    }

    #[wasm_bindgen]
    pub fn key_press(&mut self, evt: KeyboardEvent, pressed: bool) {
        let key = evt.key();
        if let Some(k) = key_to_code(&key) {
            self.emu.key_press(k, pressed);
        }
    }

    #[wasm_bindgen]
    pub fn draw_screen(&mut self, scale: usize) {
        let display = self.emu.get_display();
        let n = SCREEN_WIDTH * SCREEN_HEIGHT;
        for (i, _) in display.iter().enumerate().take(n) {
            if display[i] {
                let x = i % SCREEN_WIDTH;
                let y = i / SCREEN_WIDTH;
                self.context.fill_rect(
                    (x * scale) as f64,
                    (y * scale) as f64,
                    scale as f64,
                    scale as f64,
                );
            }
        }
    }
}

fn key_to_code(key: &str) -> Option<usize> {
    match key {
        "1" => Some(0x1),
        "2" => Some(0x2),
        "3" => Some(0x3),
        "4" => Some(0xC),
        "q" => Some(0x4),
        "w" => Some(0x5),
        "e" => Some(0x6),
        "r" => Some(0xD),
        "a" => Some(0x7),
        "s" => Some(0x8),
        "d" => Some(0x9),
        "f" => Some(0xE),
        "z" => Some(0xA),
        "x" => Some(0x0),
        "c" => Some(0xB),
        "v" => Some(0xF),
        _ => None,
    }
}
