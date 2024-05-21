<script lang="ts">
	const originalWidth = 7;
	const originalHeight = 7;
	export let width: number = 24;
	const height = width * (originalHeight / originalWidth);
	export let styles = '';
</script>

<svg
	{width}
	{height}
	viewBox="0 0 {originalWidth} {originalHeight}"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
	class={styles}
>
	<path
		d="M5.722 0.219L3.503 2.439L1.284 0.219C1.138 0.0729999 0.945 0 0.753 0C0.349 0 0.00299978 0.325 0.00299978 0.75C0.00299978 0.943 0.0759996 1.134 0.222 1.281L2.442 3.501L0.22 5.723C0.0729998 5.87 0 6.062 0 6.253C0 6.68 0.349 7.004 0.75 7.004C0.942 7.004 1.134 6.931 1.28 6.785L3.503 4.562L5.726 6.785C5.872 6.931 6.064 7.004 6.256 7.004C6.657 7.004 7.006 6.68 7.006 6.253C7.006 6.062 6.933 5.87 6.786 5.723L4.564 3.501L6.784 1.281C6.93 1.134 7.003 0.943 7.003 0.75C7.003 0.325 6.657 0 6.253 0C6.061 0 5.868 0.0729999 5.722 0.219Z"
	/>
</svg>
