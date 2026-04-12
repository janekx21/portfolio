<script lang="ts">
  import { writable } from "svelte/store";
  import { spring } from "svelte/motion";
  import { onMount, onDestroy } from 'svelte';

  let box;
  let scroll;
  let windowWidth;
  let windowHeight;
  let offset = {x: 0, y: 0}

  let scrollSpring = spring(0,{
    stiffness: 0.05,//.12,
    damping: .25,
  });

  let size = spring(1, {
    stiffness: 0.3,
    damping: 0.5,
  });

  let pointing = spring({ x: 0, y: 0 }, {
    stiffness: 0.2,
    damping: 0.3,
  });

  $: mobile = windowWidth < windowHeight;
  
  $: width = (box?.clientWidth ?? 400)
  $: height = (box?.clientHeight ?? 400)
  $: center = {
    x: (box?.offsetLeft ?? 0) + width / 2,
    y: (box?.offsetTop ?? 0) + height / 2,
  };
  $: hideAmount= Math.pow(((center.y - $scrollSpring) / windowHeight - 0.5) * 2, 8);
  $: positionOffsetX = hideAmount * (windowWidth * 0.5) * side;

  $: side = mobile ? Math.sin(center.y / windowHeight * 10) : center.x / windowWidth - 0.5; // * Math.sign(center.y / windowHeight - 0.5)

  $: rotateY = Math.min(Math.max($pointing.x + (center.x / windowWidth - 0.5) * -20, -30), 30) + offset.y * offsetIntensity;
  $: rotateX = Math.min(Math.max($pointing.y + ((center.y - scroll) / windowHeight - 0.5) * 20 - (scroll - $scrollSpring) * .4, -30), 30) + offset.x * offsetIntensity;
  $: opacity = 1 - Math.abs(hideAmount);
  $: style = opacity <= 0 ? "opacity: 0" : `transform: perspective(1000px) scale(${$size}) rotateY(${rotateY}deg) rotateX(${rotateX}deg) translateX(${positionOffsetX}px); filter: brightness(${brightness});opacity: ${Math.floor(opacity * 100)}%;`;
  $: normalizedSize =1// Math.sqrt(width * height) * .004
  $: shineStyle = `background: radial-gradient(500px 1200px at ${(rotateY - 5) * -20 + width/2}px ${rotateX * 20 + height/2 + 250}px , rgba(255,255,255,15%) 0%, rgba(255,255,255,5%) 30%, rgba(255,255,255,0) 100%);`
  $: brightness = Math.tanh(-rotateX * .03) * -.5 + 1;

  $: offsetIntensity = 1 - Math.atan(Math.abs($scrollSpring - scroll) + (($size - 1) * 10)) / (Math.PI / 2);

  function rotate({ pageX, pageY }) {
    let x = ((pageX - center.x) / width) * 2 * 10;
    let y = ((pageY - center.y) / height) * 2 * -10;
    pointing.set({ x, y });
  }

  $: scrollSpring.set(scroll);

  function leave() {
    size.set(1);
    pointing.set({ x: 0, y: 0 });
  }
  // backdrop-blur-xl 


  let rotateTimer
  onMount(() => {
    // rotateTimer = setInterval(() => {
    // }, 16)
    let handle: number;
    const loop = () => {
      offset = {
        x: Math.sin(Date.now() * 0.002 + center.x) * 8,
        y: Math.cos(Date.now() * 0.002 + center.y) * 4
      }
      handle = requestAnimationFrame(loop);
    };

    loop();
    return () => {
      cancelAnimationFrame(handle);
    }
  })




  onDestroy(() => {
    clearInterval(rotateTimer)
  })
  
</script>

<svelte:window bind:scrollY={scroll} bind:innerWidth={windowWidth} bind:innerHeight={windowHeight} />
<div
  bind:this={box}
  style={style}
  class="border border-white/20 rounded-3xl bg-dark-blue p-4 text-lg overflow-hidden self-center will-change-transform"
  on:mouseover={() => size.set(1.2 * normalizedSize)}
  on:mouseleave={() => leave()}
  on:mousemove={(e) => rotate(e)}
>
  <div class="overlay" style={shineStyle} ></div>
  <!--<div class="overlay" style="mask: url('/water_droplets.png'); background-color: white; background-size: 39px; opacity: .05;"  />-->
  <slot />
</div>

<style>
.overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
</style>
