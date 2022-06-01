<template>
  <div class="step pb-10px">
    <template v-if="OrderDataEnum.ORDEREND !== orderState">
      <div class="date mb-10px" v-if="isDate">{{ dayjs(date).format("YYYY-MM-DD") }}</div>
      <div class="step-content" @click="handle">
        <div class="step-icon-box">
          <n-icon :component="orderData[orderState].icon" size="20" />
        </div>
        <div class="step-item-text pl-15px" v-if="orderData[orderState].text">
          <p class="step-text mt-5px">{{ orderData[orderState].text }}</p>
          <span class="time">
            <n-icon size="14" class="icon-item mr-5px"> <TimeIcon /> </n-icon
            >{{ dayjs(date).format("HH:mm:ss") }}
          </span>
        </div>
      </div>
    </template>

    <div class="step-content-end" v-else>
      <div class="step-icon-box step-end">
        <n-icon :component="orderData[orderState].icon" size="20" />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { orderData } from "@/config/table";
import { toRefs } from "vue";
import { OrderDataEnum } from "@/enums/dict";
import { TimeOutline as TimeIcon } from "@vicons/ionicons5";
import dayjs from "dayjs";
const props = defineProps({
  orderState: {
    type: String,
    default: " ",
  },
  date: {
    type: Number as PropType<number | null>,
    default: null,
  },
  isDate: {
    type: Boolean,
    default: true,
  },
});
const { orderState, date, isDate } = toRefs(props);

const emit = defineEmits(["update-event"]);

const handle = () => {
  emit("update-event", orderState.value);
};
</script>
<style lang="scss">
.step {
  .date {
    font-size: 14px;
  }

  .step-content {
    display: flex;
    align-items: center;
    cursor: pointer;
    position: relative;
    @mixin line {
      content: " ";
      width: 4px;
      height: 16px;
      background-color: #e5e5e5;
      position: absolute;
      left: 22px;
    }
    &::before {
      @include line;
      top: -13px;
    }

    &::after {
      @include line;
      bottom: -14px;
    }
  }
  .step-icon-box {
    width: 45px;
    height: 45px;
    line-height: 45px;
    text-align: center;
    border: 1px solid #b4b2b2;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  .step-content-end {
    @extend .step-content;
    &::after {
      display: none;
    }
  }
  .step-end {
    width: 30px;
    height: 30px;
    margin-left: 8px;
    margin-top: 3px;
  }

  .step-item-text {
    width: 70%;
  }

  .step-text {
    font-weight: 600;
  }

  .time {
    font-size: 12px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
