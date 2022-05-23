<template>
  <BasicDrawer v-model:show="isDrawer" :title="title" @on-close-after="onCloseAfter">
    <n-transfer
      ref="transfer"
      v-model:value="data"
      filterable
      size="large"
      :options="options"
      style="width: 800px; height: 480px"
    />

    <n-form-item
      label="派单限制开始时间"
      label-placement="left"
      ref="formRef"
      path="dispatchOrderLimitBeginTime"
      :rule="rule"
      class="mt-15px"
    >
      <n-date-picker
        style="width: 420px"
        v-model:value="dispatchOrderLimitBeginTime"
        type="datetime"
        :is-date-disabled="disablePreviousDate"
        clearable
      />
    </n-form-item>

    <div class="text-center mt-25px">
      <n-button
        attr-type="button"
        :loading="loading"
        type="primary"
        @click="handleValidate($event, true)"
      >
        提交并添加会员产品
      </n-button>
      <n-button
        attr-type="button"
        :loading="loading"
        type="primary"
        class="ml-10px"
        @click="handleValidate($event, false)"
        >仅提交
      </n-button>
    </div>

    <DriverMemDrawer ref="driverMemDrawerRef" :width="500" />
  </BasicDrawer>
</template>
<script lang="ts">
import { defineComponent, reactive, ref, onMounted, toRefs } from "vue";
import { useMessage } from "naive-ui";
import DriverMemDrawer from "./driverMemberDrawer.vue";
import { getUnOpenCompany, addOpenedCompany } from "@/api/capacity/capacity";
import dayjs from "dayjs";
export default defineComponent({
  name: "OpenCompanyDrawer",
  components: { DriverMemDrawer },
  setup() {
    const state = reactive({
      isDrawer: false,
      loading: false,
      disabled: false,
    });
    const formRef = ref();
    const driverMemDrawerRef = ref();
    const message = useMessage();
    const dispatchOrderLimitBeginTime = ref<number | null>();

    const data = ref([]);
    const options = ref([]);

    const title = ref("司机会员产品");
    onMounted(() => {
      getData();
    });

    function openDrawer() {
      state.isDrawer = true;
    }

    const getData = async () => {
      try {
        let res = await getUnOpenCompany();
        console.log(res);
        options.value = res.data.map(
          (item: { operationCompanyId: string; operationCompanyName: string }) => {
            return {
              label: item.operationCompanyName,
              value: item.operationCompanyId,
              disabled: false,
            };
          }
        );
      } catch (err) {
        console.log(err);
      }
    };

    async function handleValidate(e: MouseEvent, flag: boolean) {
      e.preventDefault();
      console.log(dispatchOrderLimitBeginTime.value);

      if (data.value.length === 0) {
        message.error("请选择开通企业");
        return false;
      }

      if (!dispatchOrderLimitBeginTime.value) {
        message.error("请选择派单限制开始时间");
        return false;
      }

      await formRef.value?.validate(dispatchOrderLimitBeginTime.value);
      formRef.value?.restoreValidation();
      state.loading = true;
      try {
        let opiton = {
          companyIds: data.value,
          dispatchOrderLimitBeginTime: dayjs(dispatchOrderLimitBeginTime.value).format(
            "YYYY-MM-DD HH:mm:ss"
          ),
        };
        let res = await addOpenedCompany(opiton);
        console.log(res);
        message.success(window.$tips[res.code]);

        if (flag) {
          const { openDrawer } = driverMemDrawerRef.value;
          openDrawer("编辑会员产品", data.value);
        }
        state.loading = false;
        state.isDrawer = false;
      } catch (err) {
        console.log(err);
        state.loading = false;
      }
    }

    function handleReset() {}

    function onCloseAfter() {
      state.isDrawer = false;
      state.loading = false;
      state.disabled = false;
      data.value = [];
      dispatchOrderLimitBeginTime.value = null;
      handleReset();
    }

    return {
      ...toRefs(state),
      title,
      data,
      options,
      dispatchOrderLimitBeginTime,
      driverMemDrawerRef,
      disablePreviousDate(ts: number) {
        return ts < Date.now();
      },
      formRef,
      rule: {
        required: false,
        type: "number",
        trigger: ["blur", "change"],
        message: "请选择派单限制开始时间",
      },
      handleValidate,
      onCloseAfter,
      openDrawer,
    };
  },
});
</script>
