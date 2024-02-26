/* tslint:disable */
/* eslint-disable */
/**
*/
export class EmuWasm {
  free(): void;
/**
*/
  constructor();
/**
*/
  tick(): void;
/**
*/
  tick_timers(): void;
/**
*/
  reset(): void;
/**
* @returns {number}
*/
  get_pc(): number;
/**
* @param {Uint8Array} data
*/
  load_game(data: Uint8Array): void;
/**
* @param {KeyboardEvent} evt
* @param {boolean} pressed
*/
  key_press(evt: KeyboardEvent, pressed: boolean): void;
/**
* @param {number} scale
*/
  draw_screen(scale: number): void;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_emuwasm_free: (a: number) => void;
  readonly emuwasm_new: (a: number) => void;
  readonly emuwasm_tick: (a: number, b: number) => void;
  readonly emuwasm_tick_timers: (a: number) => void;
  readonly emuwasm_reset: (a: number) => void;
  readonly emuwasm_get_pc: (a: number) => number;
  readonly emuwasm_load_game: (a: number, b: number) => void;
  readonly emuwasm_key_press: (a: number, b: number, c: number) => void;
  readonly emuwasm_draw_screen: (a: number, b: number) => void;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_exn_store: (a: number) => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {SyncInitInput} module
*
* @returns {InitOutput}
*/
export function initSync(module: SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
