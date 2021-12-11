<template>
	<view class="tabBlock" v-if="list.length > 0">
		<scroll-view scroll-x="true" scroll-with-animation :scroll-left="tabsScrollLeft" @scroll="scroll">
			<view class="tab" id="tab_list">
				<view v-for="(item, index) in list" :key="index" :class="['tab__item', {'tab__item--active': currentIndex === index}]"
				 :style="{color: (currentIndex === index ? `${itemColor}`: '')}" id="tab_item" @click="select(item, index)">
					<view :class="['tab__item-title', {'tab__item-title--active': currentIndex === index}]">
						<text class="tab_item_t">{{item.activityTime}}</text>
						<text class="tab_item_c">{{item.title}}</text>
					</view>
				</view>
			</view>
			<view class="tab__line" v-if="lineAnimated" :style="{background: lineColor, width: lineStyle.width, transform: lineStyle.transform,transitionDuration: lineStyle.transitionDuration}">
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		props: {
			value: [Number, String],
			list: { // 传值
				type: Array,
				default: () => {
					return []
				}
			},
			itemColor: String, // tab主色调
			lineColor: String, // 下划线主色调
			lineAnimated: { // 是否展示下划线动画
				type: Boolean,
				default: true
			}
		},
		data() {
			return {
				currentIndex: 0,
				lineStyle: {},
				scrollLeft: 0,
				tabsScrollLeft: 0,
				duration: 0.3
			}
		},
		watch: {
			list() {
				this.setTabList()
			},
			value() {
				this.currentIndex = this.value
				this.setTabList()
			}
		},
		mounted() {
			this.currentIndex = this.value
			this.setTabList()
			if (!this.lineAnimated) {
				this.duration = 0
			}
		},
		methods: {
			select(item, index) {
				this.$emit('input', index)
			},
			setTabList() {
				this.$nextTick(() => {
					if (this.list.length > 0) {
						this.setLine()
						this.scrollIntoView()
					}
				})
			},
			setLine() {
				let lineWidth = 0,
					lineLeft = 0
				this.getElementData(`#tab_item`, (data) => {
					let el = data[this.currentIndex]
					lineWidth = el.width / 2
					// lineLeft = el.width * (this.currentIndex + 0.5)  // 此种只能针对每个item长度一致的
					lineLeft = el.width / 2 + (-data[0].left) + el.left
					this.lineStyle = {
						width: `${lineWidth}px`,
						transform: `translateX(${lineLeft}px) translateX(-50%)`,
						transitionDuration: `${this.duration}s`
					};
				})
			},
			scrollIntoView() { // item滚动
				let lineLeft = 0;
				this.getElementData('#tab_list', (data) => {
					let list = data[0]
					this.getElementData(`#tab_item`, (data) => {
						let el = data[this.currentIndex]
						// lineLeft = el.width * (this.currentIndex + 0.5) - list.width / 2 - this.scrollLeft
						lineLeft = el.width / 2 + (-list.left) + el.left - list.width / 2 - this.scrollLeft
						this.tabsScrollLeft = this.scrollLeft + lineLeft
					})
				})
			},
			getElementData(el, callback) {
				uni.createSelectorQuery().in(this).selectAll(el).boundingClientRect().exec((data) => {
					callback(data[0]);
				});
			},
			scroll(e) {
				this.scrollLeft = e.detail.scrollLeft;
			}
		}
	}
</script>

<style lang="scss">
	.tabBlock {
		position: relative;
		background: #020824;

		.tab {
			position: relative;
			display: flex;
			font-size: 28rpx;
			padding-bottom: 15rpx;
			white-space: nowrap;

			&__item {
				flex: 1;
				text-align: center;
				line-height: 90rpx;
				color: $uni-text-color;
				margin-right: 14rpx;

				&--active {
					color: $uni-color-primary;
				}

				&-title {
					width: 100%;
					height: 100rpx;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					background: #131B46;
					border-radius: 6px;

					text {
						display: block;
					}

					.tab_item_t {
						font-family: AlibabaPuHuiTiH;
						font-size: 14px;
						color: #00E78D;
						letter-spacing: 0;
						text-align: center;
						line-height: 20px;
						font-weight: 600;
					}

					.tab_item_c {
						font-family: AlibabaPuHuiTiM;
						font-size: 12px;
						color: #00E78D;
						letter-spacing: 0;
						text-align: center;
						line-height: 21px;
					}
				}

				.tab__item-title--active {
					width: 100%;
					height: 100rpx;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					background: #00E78D;
					border-radius: 6px;

					.tab_item_t {
						font-family: AlibabaPuHuiTiH;
						font-weight: 600;
						font-size: 16px;
						color: #FFFFFF;
						letter-spacing: 0;
						text-align: center;
						line-height: 20px;
					}

					.tab_item_c {
						font-family: AlibabaPuHuiTiM;
						font-size: 14px;
						color: #FFFFFF;
						letter-spacing: 0;
						text-align: center;
						line-height: 21px;
					}
				}
			}

			&__item:last-child {
				margin-right: 0;
			}
		}

		.tab__line {
			display: block;
			height: 6rpx;
			position: absolute;
			bottom: 15rpx;
			left: 0;
			z-index: 1;
			border-radius: 3rpx;
			position: relative;
			background: $uni-color-primary;
		}
	}
</style>
