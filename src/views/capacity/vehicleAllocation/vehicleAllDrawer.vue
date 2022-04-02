<template>
  <BasicDrawer
    v-model:show="isDrawer"
    :width="1200"
    title="车辆分配"
    @on-close-after="onCloseAfter"
  >
    <n-descriptions label-placement="left" :column="1" bordered title="车辆信息">
      <n-descriptions-item label="运营企业"
        >兰州益民出行汽车服务有限公司大庆分公司</n-descriptions-item
      >
    </n-descriptions>
    <n-descriptions label-placement="left" :column="2" bordered style="margin-top: -1px">
      <n-descriptions-item label="车牌号">黒E135CW</n-descriptions-item>
      <n-descriptions-item label="车辆品牌">东风日产</n-descriptions-item>
      <n-descriptions-item label="车系">暂无</n-descriptions-item>
      <n-descriptions-item label="车辆型号">FV7126BADBB</n-descriptions-item>
      <n-descriptions-item label="车辆颜色">黑</n-descriptions-item>
      <n-descriptions-item label="车辆类型">专车-经济型</n-descriptions-item>
      <n-descriptions-item label="添加时间">2020-03-04 00:00:00</n-descriptions-item>
    </n-descriptions>
    <!-- 搜索司机 -->
    <div class="m-10px flex-align-start">
      <n-form-item
        ref="formRef"
        label-width="70"
        label="搜索司机"
        label-placement="left"
        :rule="rule"
      >
        <n-select
          v-model:value="driver"
          clearable
          filterable
          placeholder="选择司机"
          style="width: 260px"
          :options="options"
        />
      </n-form-item>
      <n-button
        attr-type="button"
        :loading="loading"
        class="ml-10px"
        type="primary"
        @click="handleValidate"
        >搜索</n-button
      >
    </div>

    <n-divider title-placement="left">已分配司机</n-divider>
    <div class="driver-show">
      <DirverCard :driverInfo="driverInfo" @on-update="handle" />
      <DirverCard :driverInfo="driverInfo" @on-update="handle" />
    </div>
  </BasicDrawer>
</template>
<script lang="ts">
import { defineComponent, ref, reactive, toRefs } from "vue";
import { FormInst, useMessage } from "naive-ui";
import { tableDataItem } from "./type";
import { ApiFilled as ApiOutIcon } from "@vicons/antd";
import DirverCard from "./dirverCard.vue";
export default defineComponent({
  name: "VehicleAllDrawer",
  components: { DirverCard },
  emits: ["on-save-after"],
  setup(_, { emit }) {
    const state = reactive({
      isDrawer: false,
      loading: false,
    });
    const title = ref("车辆分配");
    const message = useMessage();
    const formRef = ref<FormInst | null>(null);
    const driver = ref(null);

    function openDrawer(record?: tableDataItem) {
      console.log(record);
      state.isDrawer = true;
    }

    async function handleValidate() {
      try {
        await formRef.value?.validate();
        console.log(driver.value);
        handleSaveAfter();
      } catch (err) {
        console.log(err);
        message.error("验证失败");
      }
    }

    function handleSaveAfter() {
      emit("on-save-after");
    }
    function handle(id: number) {
      console.log(id);
    }

    function handleReset() {
      driver.value = null;
      formRef.value?.restoreValidation();
    }

    function onCloseAfter() {
      state.isDrawer = false;
      state.loading = false;
      handleReset();
    }

    return {
      ...toRefs(state),
      driverInfo: {
        number: 12312,
        name: "里斯",
        sex: "男",
        id: 313123123,
      },
      driver,
      formRef,
      title,
      options: [],
      rule: {
        driver: { required: true, trigger: ["blur", "change"], message: "请选择司机" },
      },
      onCloseAfter,
      openDrawer,
      handle,
      ApiOutIcon,
      handleValidate,
    };
  },
});
</script>
<style lang="scss" scoped>
.driver-show {
  display: flex;
  align-content: flex-start;
  .driver-item {
    padding: 5px;
    width: 50%;
    border: 1px solid #efeff5;
    .lable {
      font-weight: 500;
    }
  }
  .img-box {
    width: 100px;
    border-radius: 4px;
  }
}
</style>
