<template>
  <div class="text-center">
    <div class="img-info">
      <div class="img-box">
        <p class="title mt-10px mb-10px">{{ positiveText }}</p>
        <div class="">
          <n-image :width="width" :height="height" :src="positivePhoto" />
        </div>
      </div>

      <div class="img-box">
        <p class="title mt-10px mb-10px">{{ reverseText }}</p>
        <div class="">
          <n-image :width="width" :src="reversePhoto" />
        </div>
      </div>
    </div>

    <n-button attr-type="button" class="mt-10px mb-10px" size="small" type="primary" @click="handle"
      >{{ btnText }}
    </n-button>
  </div>
</template>
<script lang="ts" setup>
import { toRefs } from "vue";
const props = defineProps({
  positivePhoto: {
    type: String,
    require: true,
  },
  reversePhoto: {
    type: String,
    require: true,
  },
  positiveText: {
    type: String,
    require: true,
  },
  reverseText: {
    type: String,
    require: true,
  },
  btnText: {
    type: String,
    require: true,
  },
  width: {
    type: Number,
    require: true,
    default: 100,
  },
  height: {
    type: Number,
    require: true,
    default: 130,
  },
});

const { positivePhoto, reversePhoto, positiveText, reverseText, btnText, width, height } =
  toRefs(props);

const emit = defineEmits(["edit-photo"]);

const handle = () => {
  emit("edit-photo");
};
</script>
<style scoped lang="scss">
.img-info {
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.img-box {
  width: 150px;
  text-align: center;
}

.title {
  font-size: 14px;
  text-align: center;
}
</style>
