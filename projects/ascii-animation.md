# Ascii Animations of GIFs

[github_url]: <> ()

### Motivation

- I put a gif on my personal website
- I want to render an ascii-style animation of the gif

### Pre-research

- my idea was to make a react component with a state variable (maybe an array of arrays or something) that would store the ascii representation of a single frame of the GIF
- Periodically, we would capture the current frame of the GIF, generate the ascii representation by analyzing the pixel intensities in the GIF, then setting the state variable to this new representation
- This would trigger a re-render (localized to the component, not the whole page), causing the text string displayed to the user to change to the next frame

### Problem

- the flow described above would actually look like the following:
  1.  the variable changes, scheduling a job in the browser's main thread to be run when the current wave of rendering completes
  2.  when this job runs, react computes the new virtual DOM (and if the code was written well, only the section of the virtual DOM corresponding to this component would need to be re-rendered) and finds the diff between the new virtual DOM and the last one
  3.  react takes this diff and applies it to the real DOM, resulting in a UI change
- However, this is very inefficient because we _already know the diff that we need to apply_; it is just a change in the text of some field, so we're basically adding a ton of overhead for no reason

### Solution 1: Write directly to a pre tag with js

- to bypass the overhead of react walking the DOM tree and shit, we just use a pre tag (which renders the text its given exactly, as opposed to a div or p which eats whitespace and applies some formatting)
- we actually run this change by scheduling our function with `requestAnimationFrame`, which runs a user-supplied callback function before the next frame is painted in the browser
- we do this with a `WebWorker`, which is a process running in a secondary thread spun up by the browser
- we create this webworker to handle our compute-heavy task of loading in the gif, converting it to intensity values, and returning the result; we want to do this in a separate thread so that the regular rendering of the browser goes uninterrupted
- we add this webworker to the project by creating a new `webworker` directory sitting at the same point in the hierarchy as our `app` folder and adding a `gif-decoder.worker.ts` in that directory
- at the top of this file, we add a `/// <reference lib="webworker" />` so that the Worker types are added for that file; it tells the compiler "when you compile this file, include the declaration file `lib.webworker.d.ts`" which loads in the relevant types/variables for using webworkers in addition to the standard set of libs
- note that this is only to make type errors go away as we are writing the code; when we actually compile the code, all of the relevant libraries will be present, so it will still work
- actually, I just realized that because a GIF is just a repeating set of frames, we only need to compute the ASCII representation of each frame a single time, so there's really no need for a worker
- however, I might add cool little things to the rest of the website, so offloading the loading of the ascii representation to another thread can't hurt, and it's a good thing to get experience with
- so the final approach will be:
  - have some file input on the UI (default will be our jimbo gif)
  - when the user uploads a gif, we spin up a webworker thread which computes the ASCII representation of the GIF and passes it back to the main thread
  - as we receive new messages from the worker thread, we append them to an array
  - we can also pass one preliminary message to the main thread indicating the number of frames so the main thread knows when to spin down the worker thread
  - after the ASCII representation has been loaded into memory, we make a `requestAnimationFrame` which uses a global counter variable to periodically go through the frames that we have loaded into memory (what if we want to control the frame rate?)
- actually nevermind; there's really no reason to pass the frames one by one as they are being processed because it's not like we will be rendering the frames as they are loaded by the worker
- in fact, in `postMessage`, the elements included in the list which is the second argument of the method indicate the elements of the payload which will be removed from the sender's heap and ownership is moved to the receiver, resulting in only one physical block of memory without duplication between the worker and the main thread
  - the value can then be accessed from the "data" in the `onMessage` of the receiver
- however, storing the frames in ASCII representations comes with significant memory overhead; first of all, rather than taking up just 1B like a regular `int` would, when we promote the entry to a js character, each one ends up taking 2B because modern engines are represented in UTF-16
- Furthermore, a string is represented as a heap object which has a header for memory management purposes, and the header is 24 bytes, adding an additional 24 bytes of memory overhead for every individual frame of the animation
- In a nutshell, when we promote to a string, each individual frame representation will be double the size, and it becomes an object stored on the heap as opposed to one contiguous memory buffer which stores everything, so a ton of additional overhead is incurred
- so the final, FINAL approach is
  - in a `useEffect` which runs when a file is uploaded, we spin up the worker thread and pass a block of memory with the `postMessage` method which consists of the data of the GIF
  - we set some loader state variable to display a loader to the user while the worker is working
  - in the worker thread, we process the GIF, and when we have finally processed all the frames and stored the results in an array (as a single buffer, not an array of strings or something in order to avoid the memory overhead), we pass this block of memory off to the main thread again
  - in the main thread, we store this received buffer in a global array which is then used for rendering the ascii when each frame comes along\
- Initial attempt
  - it looks like shit
  - it appears to be rendering shit sideways
  - need to look into how things are stored in in the buffer
- the incorrect assumption that was made was that every element returned by `decompressFrames` is the entire frame; in reality, it's basically a diff to apply to the previous frame in order to get the next frame
-

```
const N = frames.length;
const total = W * H * N;
const atlas = new Uint8Array(total); // 1 byte per pixel per frame

frames.forEach(({ patch }, f) => {

const frameOffset = f * W * H;

for (let i = 0, p = 0; i < patch.length; i += 4, p++) {

const R = patch[i],

G = patch[i + 1],

B = patch[i + 2]; // we essentially end up with a bunch of frames that are empty

atlas[frameOffset + p] = rgbToLuma(R, G, B) | 0; // fast floor to int

}

});
```

- so the above code was wildly incorrect; a bunch of dead space existed between the frames because the `patch` field was much smaller than I thought it would be
- ideally, we could just store these diffs in the memory buffer and not the entirety of every frame. However, this doesn't work, or at least isn't compatible with our current method of rendering the text. Our routine for rewriting the ascii string runs when the callback passed to `requestAnimationFrame` runs, and the rate of runs depends on Hz of the monitor. To decide which frame to render, we find how much time has passed since the animation started and render the frame that _should_ be displayed at that point in time. However, this doesn't necessarily mean that two frames which are rendered back to back sit right next to each other, meaning we can't just paint the diff. We could maintain this guarantee if our method of rendering the frames was just incrementing a counter variable on every run of the callback though and we just indexed through the frames one by one (and the frame rate could be modified by sometimes not incrementing this counter) but this feels more hacky and our tradeoff of needing to store more memory doesn't feel like a big deal when are already so memory-optimized.
