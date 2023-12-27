<template>
  <div class="h-100 flex flex-column ai-center relative">
    <n-button type="primary" class="absolute btn" @click="openCamera()">{{ showVideo ? '关闭摄像头' : '打开摄像头'}}</n-button>
    <n-icon class="min absolute cursor-pointer" @click="handleMin()">
      <RemoveCircle />
    </n-icon>
    <n-icon class="max absolute cursor-pointer" @click="handleMax()">
      <ResizeOutline />
    </n-icon>
    <n-icon class="close absolute cursor-pointer" @click="handleClose()">
      <CloseCircle />
    </n-icon>
    <n-spin v-if="showLoading" class="loading absolute">
      <template #icon>
        <n-icon>
          <Reload />
        </n-icon>
      </template>
    </n-spin>
    <video v-show="showVideo" ref="videoRef" class="video"></video>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { FormInst, useMessage } from 'naive-ui'
import { RemoveCircle, ResizeOutline, CloseCircle, Reload } from '@vicons/ionicons5'
import { ipcRenderer } from 'electron'

const showVideo = ref(false)
const showLoading = ref(false)
const message = useMessage()
const videoRef: any = ref<FormInst | null>(null);
const errorCamera = (error) => {
  console.log(111, error)
}
const showStream = (stream) => {
  videoRef.value.srcObject = stream
  videoRef.value.play()
}

const handleMin = () => {
  console.log(ipcRenderer)
  ipcRenderer.send('min');
}

const handleMax = () => {
  console.log(ipcRenderer)
  ipcRenderer.send('max');
}

const handleClose = () => {
  console.log(ipcRenderer)
  ipcRenderer.send('close');
}

// 打开摄像头
const openCamera = async () => {
  showLoading.value = true
  showVideo.value = !showVideo.value
  if (!showVideo.value) {
    videoRef.value.pause()
    showLoading.value = false
    return
  }
  // 如摄像头已打开，则直接返回
  const constraints = {
    audio: true,
    video: true
  }
  try {
    // 获取流视频
    const stream = await navigator.mediaDevices.getUserMedia(constraints)
    if (stream) {
      showStream(stream)
    } else {
      message.error('未获取到摄像头')
    }
  } catch (error) {
    errorCamera(error)
  }
  showLoading.value = false
}
onMounted(() => {
  // openCamera();
})
</script>

<style lang="scss">
.video {
  width: 100%;
  height: 100%;
}
.btn {
  left: 50%;
  top: 0;
  z-index: 1;
  transform: translateX(-50%);
}
.min, .max, .close {
  top: 0;
  font-size: 30px;
  z-index: 1;
}
.min {
  right: 70px;
}
.max {
  right: 40px;
}
.close {
  right: 10px;
}
.loading {
  left: 50%;
  top: 50%;
  z-index: 2;
  transform: translateX(-50%) translateY(-50%);
}
</style>

