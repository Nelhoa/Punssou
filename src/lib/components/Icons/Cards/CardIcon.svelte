<script lang="ts">
	import { settings } from '$lib/models/Punto/punto-settings.svelte';
	import Card1 from './Card1.svelte';
	import Card2 from './Card2.svelte';
	import Card3 from './Card3.svelte';
	import Card4 from './Card4.svelte';
	import Card5 from './Card5.svelte';
	import Card6 from './Card6.svelte';
	import Card7 from './Card7.svelte';
	import Card8 from './Card8.svelte';
	import Card9 from './Card9.svelte';

	interface Props {
		number: number;
		styles?: string;
		width?: number;
	}

	let { number, styles = '', width = $bindable(53) }: Props = $props();
</script>

{#if settings.showNumber}
	{number}
{:else if number === 1}
	<Card1 {styles} {width} />
{:else if number === 2}
	<Card2 {styles} {width} />
{:else if number === 3}
	<Card3 {styles} {width} />
{:else if number === 4}
	<Card4 {styles} {width} />
{:else if number === 5}
	<Card5 {styles} {width} />
{:else if number === 6}
	<Card6 {styles} {width} />
{:else if number === 7}
	<Card7 {styles} {width} />
{:else if number === 8}
	<Card8 {styles} {width} />
{:else if number === 9}
	<Card9 {styles} {width} />
{/if}
