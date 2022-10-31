<template>
	<div class="flex flex-col">
		<div class="mt-4">
			<Header></Header>
		</div>
		<div class="flex mt-2">
			<div class="main">
				<ReviewAnswer></ReviewAnswer>
			</div>
		</div>
	</div>
</template>
<script setup>
	import Header from "@/components/onExam/header.vue";
	import ReviewAnswer from '@/components/reviewManagement/reviewAnswer.vue'
</script>
<style lang="less" scoped>
	.main {
		flex: 1;
	}
</style>
