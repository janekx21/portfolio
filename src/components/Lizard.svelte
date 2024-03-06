<script lang="ts">
	import { onMount } from "svelte";

	let eye = "eye.png";
	let wingIndex = 0;

	onMount(() => {
		setInterval(() => {
			eye = "eye_closed.png";

			setTimeout(() => {
				eye = "eye.png";
			}, 16 * 12);
		}, 4000);
		setInterval(() => {
			wingIndex = (wingIndex + 1) % 3;
		}, 16 * 12);
	});

	function kill() {
		eye = "eye_crossed.png";
	}
</script>

<div class="p-2 flex flex-col justify-center">
	<div class="relative cursor-pointer" on:click={() => kill()}>
		<img class="absolute" style="left: 33px; top: 38px;" src={eye} />
		<img
			class="absolute"
			style="left: -25px; top: -40px; z-index: -1;"
			src="sword.png"
		/>
		<img
			class="absolute"
			style="left: 75px; top: 30px;"
			src={`wing_${wingIndex}.png`}
		/>
		<img src="lizard.png" />
	</div>
</div>
