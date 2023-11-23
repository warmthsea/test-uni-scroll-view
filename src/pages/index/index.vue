<script setup lang="ts">
import { ref } from 'vue'
import type { ScrollEType } from './type'
import { onMounted } from 'vue'
import { nextTick } from 'vue'

function generateNumberArray(start: number, end: number, count = 40) {
  var numberArray = []
  var step = start > end ? -1 : 1

  for (var i = 0; i < count; i++) {
    numberArray.push(start)
    start += step
  }

  return numberArray
}

const title = ref('test uni scroll-view for android')

const scrollAnimation = ref(false)
const scrollTag = ref(false)
const scrollMsgId = ref('')

const total = ref(200)
const page = ref(1)
const msgList = ref<number[]>([])

const getMoreMsgList = () => {
  console.log('get more')
  const startNum = total.value - 20 * (page.value - 1)
  const endNum = startNum - 20
  page.value++

  const numbers = generateNumberArray(startNum, endNum)
  uni.showLoading()

  return new Promise<void>(async (resolve, reject) => {
    setTimeout(async () => {
      numbers.forEach(item => msgList.value.unshift(item))
      await nextTick()
      scrollTag.value = false
      uni.hideLoading()
      resolve()
    }, 1000)
  })
}

/** 上拉刷新 */
const scrolltoupper = async (e: ScrollEType) => {
  if (
    !scrollTag.value &&
    e.detail.scrollTop < 170 &&
    msgList.value.length < total.value
  ) {
    console.log('scroll-top')
    scrollTag.value = true
    getMoreMsgList()
  }
}

const init = async () => {
  page.value = 1
  msgList.value = []
  await getMoreMsgList()
  await nextTick()
  scrollMsgId.value = 's' + (msgList.value.length - 1)
}

init()
</script>

<template>
  <view>
    <view>{{ title }}</view>
    <view class="content">
      <scroll-view
        :scroll-y="!scrollTag"
        :show-scrollbar="true"
        :refresher-threshold="0"
        :scroll-into-view="scrollMsgId"
        :scroll-with-animation="scrollAnimation"
        refresher-enabled
        class="scroll-box"
        refresher-default-style="none"
        @scroll="scrolltoupper"
      >
        <view id="scroll-view-content" class="p-5">
          <view
            v-for="(item, index) in msgList"
            :id="`s${index + 1}`"
            :key="item"
            class="msg-item"
          >
            {{ item }}
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<style>
.scroll-box {
  width: 80%;
  margin: 0 auto;
  height: 700rpx;
  margin-top: 50rpx;
  border: 1px solid red !important;
}

.msg-item {
  padding: 10rpx 20rpx;
  height: 70rpx;
  display: flex;
  align-items: center;
}

#scroll-view-content .msg-item:nth-child(2n) {
  background-color: gainsboro;
}
</style>
