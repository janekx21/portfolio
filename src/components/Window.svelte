<script lang="ts">
  import { writable } from "svelte/store";
  import { spring } from "svelte/motion";

  let box;
  let scroll;
  let windowWidth;
  let windowHeight;

  let scrollSpring = spring(0,{
    stiffness: .12,
    damping: .35,
  });
  let size = spring(1, {
    stiffness: 0.3,
    damping: 0.5,
  });
  let pointing = spring({ x: 0, y: 0 }, {
    stiffness: 0.2,
    damping: 0.3,
  });
  $: width = (box?.clientWidth ?? 400)
  $: height = (box?.clientHeight ?? 400)
  $: center = {
    x: (box?.offsetLeft ?? 0) + width / 2,
    y: (box?.offsetTop ?? 0) + height / 2,
  };
  $: rotateY = $pointing.x + (center.x / windowWidth - 0.5) * -20;
  $: rotateX = $pointing.y + ((center.y - scroll) / windowHeight - 0.5) * 20 - (scroll - $scrollSpring) * .4;
  $: style = `transform: perspective(1000px) scale(${$size}) rotateY(${rotateY}deg) rotateX(${rotateX}deg); filter: brightness(${brightness})`;
  $: normalizedSize =1// Math.sqrt(width * height) * .004
  $: shineStyle = `background: radial-gradient(500px 1200px at ${rotateX * 10 + width/2}px ${rotateY * 10 + height/2 + 250}px , rgba(255,255,255,15%) 0%, rgba(255,255,255,5%) 30%, rgba(255,255,255,0) 100%);`
  $: brightness = Math.tanh(-rotateX * .03) * -.5 + 1;

  function rotate({ layerX, layerY }) {
    let { clientWidth, clientHeight } = box;
    let x = (layerX / clientWidth - 0.5) * 2 * 10;
    let y = (layerY / clientHeight - 0.5) * 2 * -10;
    pointing.set({ x, y });
  }

  $: scrollSpring.set(scroll);

  function leave() {
    size.set(1);
    pointing.set({ x: 0, y: 0 });
  }
</script>

<svelte:window bind:scrollY={scroll} bind:innerWidth={windowWidth} bind:innerHeight={windowHeight} />
<div
  bind:this={box}
  style={style}
  class="border border-white/20 rounded-3xl bg-dark-blue backdrop-blur-xl p-4 text-lg overflow-hidden"
  on:mouseover={() => size.set(1.2 * normalizedSize)}
  on:mouseleave={() => leave()}
  on:mousemove={(e) => rotate(e)}
>
  <div class="overlay" style={shineStyle} />
  <div class="overlay" style="background-image: url('/water_droplets.png'); background-size: 39px; opacity: .05; mix-blend-mode: screen;"  />
  <slot />
</div>

<style>
.overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
</style>
