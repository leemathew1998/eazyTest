<script setup>
	import {
		antiCheatingMethod,
		Fullscreen,
		exitFullscreen
	} from '@/utils/antiCheatingMethod.js'
</script>

<template>
	<div class="card">
		<button type="button" @click="Fullscreen">Fullscreen</button>
		<button type="button" @click="exitFullscreen">exitFullscreen</button>
		<input id="input" value="123456" />
		<div>23456yu</div>
	</div>

</template>

<style scoped>
.card{
	height: 100vh;
	margin:0;padding:0
}
</style>
