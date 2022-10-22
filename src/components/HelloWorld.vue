<script setup>
	import {
		antiCheatingMethod,
		Fullscreen,
		exitFullscreen
	} from '@/utils/antiCheatingMethod.js'
</script>

<template>
	<div class="card">
		<div class="button border-dotted" @click="Fullscreen">Fullscreen</div>
		<button type="button" class="button" >Fullscreen</button>
		<button type="button" @click="exitFullscreen">exitFullscreen</button>
		<input id="input" value="123456" />
		<div>23456yu</div>
	</div>

</template>

<style scoped>
</style>
