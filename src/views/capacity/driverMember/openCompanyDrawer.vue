<template>
  <BasicDrawer v-model:show="isDrawer" :title="title" @on-close-after="onCloseAfter">
    <n-transfer ref="transfer" v-model:value="data" :options="options" />

    <n-date-picker
      style="width: 460px"
      v-model:value="dispatchOrderLimitBeginTime"
      type="datetime"
      clearable
    />
    <div class="text-center">
      <n-button attr-type="button" :loading="loading" type="primary" @click="handleValidate"
        >保存
      </n-button>
    </div>
  </BasicDrawer>
</template>
<script lang="ts">
import { defineComponent, reactive, ref, onMounted, toRefs } from "vue";
import { getUnOpenCompany, addOpenedCompany } from "@/api/capacity/capacity";
export default defineComponent({
  name: "OpenCompanyDrawer",
  setup() {
    const state = reactive({
      isDrawer: false,
      loading: false,
      disabled: false,
    });
    const dispatchOrderLimitBeginTime = ref();

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

    async function handleValidate() {
      try {
        let opiton = {
          companyIds: [],
          dispatchOrderLimitBeginTime: "",
        };
        let res = await addOpenedCompany(opiton);
        console.log(res);
      } catch (err) {
        console.log(err);
      }
    }

    function handleReset() {}

    function onCloseAfter() {
      state.isDrawer = false;
      state.loading = false;
      state.disabled = false;
      handleReset();
    }

    return {
      ...toRefs(state),
      title,
      data,
      options,
      dispatchOrderLimitBeginTime,
      handleValidate,
      onCloseAfter,
      openDrawer,
    };
  },
});
</script>
