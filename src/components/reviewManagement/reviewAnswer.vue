<template>
	<BlankCardWithoutIcon>
		<template #title>
			<div class="qusetionTypeTitle w-full">张三</div>
		</template>
		<template #mainContent>
			<div class="answer-container h-full">
				<!-- for loop start-->
				<div style="flex:1;"
					:class="['flex','flex-col',`${currentQuestion.type}-${currentQuestion.count}`, `${currentQuestion.type}`]">
					<div class="item-title">
						<span class="item-title-count">{{ currentQuestion.count }}、</span>
						<span class="item-title-content">{{ currentQuestion.content }}</span>
					</div>
					<div class="flex" style="flex:1">
						<div style="flex:1">
							<BasicCard>
								<template #title>用户答案</template>
								<template #mainContent>
									<el-input v-model="examStore.answers['简答'][currentIndex].answer" :rows="10"
										maxlength="200" show-word-limit type="textarea" placeholder="请输入答案" disabled />
								</template>
							</BasicCard>
						</div>
						<div class="ml-2 mr-2" style="flex:1">
							<BasicCard>
								<template #title>正确答案</template>
								<template #mainContent>
									<el-input v-model="examStore.answers['简答'][currentIndex].answer" :rows="10"
										maxlength="200" show-word-limit type="textarea" placeholder="请输入答案" disabled />
								</template>
							</BasicCard>
						</div>
						<div style="flex:1">
							<BasicCard>
								<template #title>得分</template>
								<template #mainContent>
									<el-input v-model="examStore.reviewScore[currentIndex]" type="text"
										placeholder="请输入分数,按下回车自动跳到下一题" autofocus />
									<span>考生姓名：张三</span>
									<span>总成绩：78</span>
								</template>
							</BasicCard>
						</div>
					</div>
				</div>
				<div class="flex justify-end mt-4">
					<el-button type="primary" @click="prev">
						<el-icon>
							<ArrowLeftBold />
						</el-icon>
						上一题
					</el-button>
					<el-button type="primary" @click="next">
						下一题
						<el-icon>
							<ArrowRightBold />
						</el-icon>
					</el-button>
				</div>
			</div>

		</template>
	</BlankCardWithoutIcon>
</template>
<script setup>
	import {
		onMounted,
		ref,
		watch
	} from "vue";
	import {
		questionsForReview
	} from "@/components/onExam/constants.js";
	import BlankCardWithoutIcon from "@/components/onExam/blankCardWithoutIcon.vue";
	import lodash from "lodash";
	import {
		useExamStore
	} from "@/store";
	import {
		loopToFillState
	} from "@/utils/methods.js";
	import BasicCard from '@/components/basicCard.vue'
	import {
		ElNotification
	} from 'element-plus'
	// 填充答案，
	const examStore = useExamStore();
	loopToFillState(examStore, {
		简答: 20
	}, true);
	examStore.reviewScore = new Array(20).fill('')
	//当前题目
	const currentQuestion = ref({})
	const currentIndex = ref(0)
	currentQuestion.value = questionsForReview[0]
	const prev = () => {
		if (currentIndex.value > 0) {
			currentIndex.value -= 1
			currentQuestion.value = questionsForReview[currentIndex.value]
		}
	}
	const next = () => {
		if (currentIndex.value === 19) {
			ElNotification({
				title: '阅卷完成',
				message: '考生张三已完成阅卷！自动跳转到下一位考生。',
				type: 'success',
			})
			currentIndex.value = 0
			currentQuestion.value = questionsForReview[0]
			examStore.reviewScore = new Array(20).fill('')
		} else {
			currentIndex.value += 1
			currentQuestion.value = questionsForReview[currentIndex.value]
		}
	}
	// 检测键盘
	window.onkeydown = function(event) {
		if (event.keyCode == 13) {
			next()
		}
	}
</script>
<style lang="less" scoped>
	@import url("@/assets/css/common.less");

	.answer-container {
		display: flex;
		flex-direction: column;
		justify-content: space-between;

		.item-title {
			display: flex;
			flex-wrap: nowrap;

			.item-title-count {
				color: #31969a;
			}

			.item-title-content {
				font-family: "思源黑体 CN", sans-serif;
				font-weight: 400;
				font-style: normal;
				font-size: 14px;
				color: #333333;
				text-align: left;
			}
		}
	}

	.qusetionTypeTitle {
		background-color: rgba(244, 253, 253, 1);
		font-size: 14px;
		color: #333333;
		text-align: left;
		font-family: "思源黑体 CN", sans-serif;
		font-weight: 400;
		font-style: normal;
	}

	/deep/.el-textarea__inner {
		width: 100% !important;
	}
</style>
