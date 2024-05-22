<script lang="ts">
	interface Props {
		width?: number;
		styles?: string;
	}

	let { width = 24, styles = '' }: Props = $props();

	const originalWidth = 115;
	const originalHeight = 115;
	const height = width * (originalHeight / originalWidth);
</script>

<svg
	{width}
	{height}
	viewBox="0 0 {originalWidth} {originalHeight}"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
	class={styles}
>
	<circle cx="58" cy="58" r="10" />
</svg>
