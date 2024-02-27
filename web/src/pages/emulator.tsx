import { useParams } from '@solidjs/router';
import {
  createEffect,
  createResource,
  createSignal,
  onCleanup,
  Show
} from 'solid-js';

import { fetchRomAction } from '@/apis';
import { LoadingSpinner } from '@/components';
import { NotFound } from '@/pages';

// eslint-disable-next-line no-restricted-imports
import init, { EmuWasm } from '../../public/chip8/wasm';

const WIDTH = 64;
const HEIGHT = 32;
const SCALE = 20;
const TICKS_PER_FRAME = 10;
let frame = 0;
const MAX_ROM_SIZE = 4096;
const OTHER_ERR_STRING =
  'It looks like something went wrong. Please reload the page and try again.';

const reloadPage = () => {
  window.location.reload();
};

export const Emulator = () => {
  const gameId = useParams()['id'];
  const [romResource] = createResource(gameId, fetchRomAction);
  const [fileName, setFileName] = createSignal<string | undefined>();
  const [errMsg, setErrMsg] = createSignal<string>();
  const [canvasRef, setCanvasRef] = createSignal<HTMLCanvasElement>();

  let ctx: CanvasRenderingContext2D;
  const setupCanvas = () => {
    const canvas = canvasRef();

    if (canvas) {
      canvas.width = WIDTH * SCALE;
      canvas.height = HEIGHT * SCALE;
      ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, WIDTH * SCALE, HEIGHT * SCALE);
    }
  };

  createEffect(() => {
    if (canvasRef()) {
      setupCanvas();
      run().catch(() => {
        setErrMsg(OTHER_ERR_STRING);
      });
    }
  });

  let chip8: EmuWasm;

  const keydownHandler = (event: KeyboardEvent) => {
    chip8.key_press(event, true);
  };
  const keyupHandler = (event: KeyboardEvent) => {
    chip8.key_press(event, false);
  };

  onCleanup(() => {
    document.removeEventListener('keydown', keydownHandler);
    document.removeEventListener('keyup', keyupHandler);
  });

  const loadGame = (rom: Uint8Array) => {
    try {
      chip8.reset();
      chip8.load_game(rom);
      loop(chip8);
    } catch {
      setErrMsg(OTHER_ERR_STRING);
    }
  };

  const uploadGameHandler = (event: Event) => {
    if (frame !== 0) {
      window.cancelAnimationFrame(frame);
    }

    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) {
      setErrMsg('No file chosen');
    } else if (file.size <= MAX_ROM_SIZE) {
      setFileName(file.name);
      setErrMsg('');

      const fr = new FileReader();
      // eslint-disable-next-line unicorn/prefer-blob-reading-methods
      fr.readAsArrayBuffer(file);

      fr.addEventListener('load', () => {
        const buffer = fr.result as ArrayBuffer;
        const rom = new Uint8Array(buffer);
        loadGame(rom);
      });
    } else {
      setErrMsg('Only support ROM file < 4KB');
    }
  };

  const run = async () => {
    await init();

    chip8 = new EmuWasm();

    document.addEventListener('keydown', keydownHandler);
    document.addEventListener('keyup', keyupHandler);

    const rom = romResource();
    if (rom) {
      loadGame(rom);
    }
  };

  const loop = (chip8: EmuWasm) => {
    // Only draw every few ticks
    try {
      for (let i = 0; i < TICKS_PER_FRAME; i++) {
        chip8.tick();
      }
    } catch {
      setErrMsg('Invalid ROM file');
      return;
    }
    chip8.tick_timers();
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, WIDTH * SCALE, HEIGHT * SCALE);

    // Set the draw color back to white before render new frame
    ctx.fillStyle = 'white';

    chip8.draw_screen(SCALE);

    frame = window.requestAnimationFrame(() => {
      loop(chip8);
    });
  };

  return (
    <Show
      when={!romResource.loading}
      fallback={
        <div class="flex h-screen items-center justify-center">
          <LoadingSpinner />
        </div>
      }
    >
      <Show when={!romResource.error} fallback={<NotFound />}>
        <div class="flex h-[calc(100vh-4rem)] w-full items-center justify-center bg-black/90">
          <div class="flex flex-col">
            <canvas ref={setCanvasRef} id="canvas" />
            <div class="mt-2 flex justify-between font-semibold text-white">
              <label class="cursor-pointer hover:text-green-300">
                <Show when={!gameId}>
                  <input
                    onChange={uploadGameHandler}
                    type="file"
                    id="fileInput"
                    class="hidden"
                  />
                </Show>
                <Show
                  when={!errMsg()}
                  fallback={<div class="text-red-500">{errMsg()}</div>}
                >
                  {!gameId && (
                    <Show
                      when={fileName()}
                      fallback={
                        <span>
                          <i class="fa-solid fa-upload mr-2" />
                          Upload Your ROM
                        </span>
                      }
                    >
                      <i class="fa-solid fa-ghost mr-2" />
                      {fileName()}
                    </Show>
                  )}
                </Show>
              </label>
              <div
                class="cursor-pointer text-white hover:text-amber-300"
                onClick={reloadPage}
              >
                <i class="fa-solid fa-rotate-right mr-2" />
                Reload page
              </div>
            </div>
          </div>
        </div>
      </Show>
    </Show>
  );
};
