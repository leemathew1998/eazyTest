<template>
	<div class="demo-frame">
		<div class="demo-container">
			<video id="video" width="320" height="240" preload autoplay loop muted></video>
		</div>
	</div>
</template>
<script setup>
	import '@/utils/tracking-min.js'
	import '@/utils/face-min.js'
	window.onload = function() {
		var video = document.getElementById('video');

		var tracker = new tracking.ObjectTracker('face');
		tracker.setInitialScale(4);
		tracker.setStepSize(2);
		tracker.setEdgesDensity(0.1);

		tracking.track('#video', tracker, {
			camera: true
		});

		tracker.on('track', function(event) {
			if(event.data.length>0){
				console.log(`检测到${event.data.length}张人脸`)
			}
		});
	};
</script>

<style scoped lang="less">
	video,
	canvas {
		margin-left: 230px;
		margin-top: 120px;
		position: absolute;
	}
</style>
