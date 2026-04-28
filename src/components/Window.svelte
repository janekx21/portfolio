<script lang="ts">
  import { spring } from "svelte/motion";
  import { onMount } from 'svelte';

  // Does class not work
  // z-index does not work ??
  let { class: className = '', children } = $props();

  let box = $state<HTMLElement>();
  let scroll = $state(0);
  let windowWidth = $state(0);
  let windowHeight = $state(0);
  let offset = $state({ x: 0, y: 0 });
  // let offsetLeft = $state(0);
  // let offsetTop = $state(0);
  // let clientWidth = $state(0);
  // let clientHeight = $state(0);

  let scrollSpring = spring(0, { stiffness: 0.05, damping: .25 });
  let size = spring(1, { stiffness: 0.3, damping: 0.5 });
  let pointing = spring({ x: 0, y: 0 }, { stiffness: 0.2, damping: 0.3 });

  let mobile = $derived(windowWidth < windowHeight);

  let width = $derived(box?.clientWidth ?? 400);
  let height = $derived(box?.clientHeight ?? 400);
  let center = $derived( box ? {
    x: (box.offsetLeft) + width / 2,
    y: (box.offsetTop) + height / 2,
  } : {x: width/2, y: height/2});

  let hideAmount = $derived(Math.pow(((center.y - $scrollSpring) / windowHeight - 0.5) * 2, 8));
  let side = $derived(mobile ? Math.sin(center.y / windowHeight * 10) : center.x / windowWidth - 0.5);
  let positionOffsetX = $derived(hideAmount * (windowWidth * 0.5) * side);

  let offsetIntensity = $derived(1 - Math.atan(Math.abs($scrollSpring - scroll) + (($size - 1) * 10)) / (Math.PI / 2));

  let rotateY = $derived(Math.min(Math.max($pointing.x + (center.x / windowWidth - 0.5) * -20, -30), 30) + offset.y * offsetIntensity);
  let rotateX = $derived(Math.min(Math.max($pointing.y + ((center.y - scroll) / windowHeight - 0.5) * 20 - (scroll - $scrollSpring) * .4, -30), 30) + offset.x * offsetIntensity);

  let opacity = $derived(1 - Math.abs(hideAmount));
  let brightness = $derived(Math.tanh(-rotateX * .03) * -.5 + 1);
  let normalizedSize = $derived(1);

  let style = $derived(
    opacity <= 0
      ? "opacity: 0"
      : `transform: perspective(1000px) scale(${$size}) rotateY(${rotateY}deg) rotateX(${rotateX}deg) translateX(${positionOffsetX}px); filter: brightness(${brightness}); opacity: ${Math.floor(opacity * 100)}%;`
  );
  let shineStyle = $derived(
    `background: radial-gradient(500px 1200px at ${(rotateY - 5) * -20 + width/2}px ${rotateX * 20 + height/2 + 250}px, rgba(255,255,255,15%) 0%, rgba(255,255,255,5%) 30%, rgba(255,255,255,0) 100%);`
  );

  // Sync scroll to spring
  $effect(() => { scrollSpring.set(scroll); });

  function rotate({ pageX, pageY }: MouseEvent) {
    let x = ((pageX - center.x) / width) * 2 * 10;
    let y = ((pageY - center.y) / height) * 2 * -10;
    pointing.set({ x, y });
  }

  function leave() {
    size.set(1);
    pointing.set({ x: 0, y: 0 });
  }

  onMount(() => {
    let handle: number;
    const loop = () => {
      offset = {
        x: Math.sin(Date.now() * 0.002 + center.x) * 8,
        y: Math.cos(Date.now() * 0.002 + center.y) * 4,
      };
      handle = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(handle);
  });

  function updateCenter(){
    if (box) {
      // Manual update this for now
     
      center.x = (box.offsetLeft) + width / 2
      center.y = (box.offsetTop) + height / 2

      width = box.clientWidth
      height = box.clientHeight
    }
  }
</script>

<svelte:window bind:scrollY={scroll} bind:innerWidth={windowWidth} bind:innerHeight={windowHeight} on:resize={()=>updateCenter()} />

<div
  bind:this={box}
  {style}
  class="border border-white/20 rounded-3xl bg-dark-blue p-4 text-lg overflow-hidden self-center will-change-transform hover:z-10 hover:outline-2 outline-offset-2 outline-cyan-200 {className}"
  onmouseover={() => size.set(1.2 * normalizedSize)}
  onmouseleave={() => leave()}
  onmousemove={(e) => rotate(e)}
  onfocus={() => {}}
  onblur={() => {}}
  role="listitem"
>
  <div class="overlay" style={shineStyle}></div>
  {@render children()}
</div>

<style>
.overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
</style>
