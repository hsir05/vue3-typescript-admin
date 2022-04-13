<template>
  <BasicDrawer v-model:show="isDrawer" :title="title" @on-close-after="onCloseAfter">
    <n-form
      ref="formRef"
      inline
      label-placement="left"
      label-width="90"
      style="flex-wrap: wrap"
      class="pt-15px pb-15px bg-white mb-5px"
      :model="form"
    >
      <n-form-item label="兑换码" path="code">
        <n-input-group style="width: 190px">
          <n-input
            v-model:value="form.code"
            clearable
            placeholder="输入兑换码"
            :style="{ width: '80%' }"
          />
          <n-button type="primary" ghost> 快速生成 </n-button>
        </n-input-group>
      </n-form-item>

      <n-form-item label="生效时间" path="start">
        <n-date-picker v-model:value="form.start" style="width: 190px" type="date" clearable />
      </n-form-item>

      <n-form-item label="失效时间" path="end">
        <n-date-picker v-model:value="form.end" type="date" style="width: 190px" clearable />
      </n-form-item>

      <n-form-item label="可兑换次数" path="count">
        <n-input-number
          v-model:value="form.count"
          style="width: 190px"
          :min="0"
          clearable
          placeholder="可兑换次数"
        />
      </n-form-item>

      <n-form-item>
        <n-button attr-type="button" type="primary" @click="submit">提交</n-button>
      </n-form-item>
    </n-form>
    <div class="pt-5px pb-5px text-right">
      <n-button attr-type="button" type="primary" @click="handleAddVoucher">添加代金券</n-button>
    </div>
    <n-data-table
      :loading="loading"
      ref="table"
      striped
      :columns="columns"
      class="box-border"
      :row-key="getRowKeyId"
      :data="data"
      :pagination="pagination"
    />

    <VoucherModal ref="voucherModalRef" />
  </BasicDrawer>
</template>
<script lang="ts">
import { defineComponent, reactive, h, ref, toRefs, unref } from "vue";
import { FormInst, useMessage } from "naive-ui";
import TableActions from "@/components/TableActions/TableActions.vue";
import { TrashOutline as RemoveIcon } from "@vicons/ionicons5";
import VoucherModal from "./voucherModal.vue";
import { tableDataItem } from "./type";
export default defineComponent({
  name: "CodeDrawer",
  components: { VoucherModal },
  setup() {
    const state = reactive({
      isDrawer: false,
      loading: false,
    });

    const title = ref("");
    const voucherModalRef = ref();
    const message = useMessage();

    const formRef = ref<FormInst | null>(null);
    const form = ref({
      code: null,
      count: null,
      start: null,
      end: null,
    });

    const data = ref([
      {
        id: "23123",
        name: "",
        faceValue: "",
        num: "",
        count: "",
      },
    ]);
    const columns = [
      {
        title: "序号",
        key: "index",
        align: "center",
        width: 70,
        render(_: tableDataItem, rowIndex: number) {
          return h("span", `${rowIndex + 1}`);
        },
      },
      {
        title: "名称",
        key: "name",
        align: "center",
      },
      {
        title: "面值",
        key: "faceValue",
        align: "center",
      },
      {
        title: "有效天数",
        key: "num",
        align: "center",
      },
      {
        title: "数量",
        key: "count",
        align: "center",
      },
      {
        title: "操作",
        key: "action",
        align: "center",
        width: "90px",
        render(record: tableDataItem) {
          return h(TableActions as any, {
            actions: [
              {
                label: "删除",
                type: "primary",
                isIconBtn: true,
                icon: RemoveIcon,
                onClick: handleRemove.bind(null, record),
                auth: ["dict001"],
              },
            ],
          });
        },
      },
    ];

    function openDrawer(t: string, record?: tableDataItem) {
      if (record) {
        console.log(record);
        message.success("验证成功");
      }
      title.value = t;
      state.isDrawer = true;
    }

    function handleRemove(record: Recordable) {
      console.log(record);
      message.success("验证成功");
    }

    function submit(e: MouseEvent) {
      e.preventDefault();
      formRef.value?.validate((errors) => {
        if (!errors) {
          state.loading = true;
          console.log(unref(form));

          message.success("验证成功");
        } else {
          console.log(errors);
          message.error("验证失败");
        }
      });
    }

    function handleAddVoucher() {
      console.log("添加代金券");
      const { handleModal } = voucherModalRef.value;
      handleModal();
    }

    function onCloseAfter() {
      state.isDrawer = false;
      state.loading = false;
    }

    return {
      form,
      formRef,
      data,
      columns,
      voucherModalRef,
      ...toRefs(state),
      pagination: {
        pageSize: 10,
      },
      getRowKeyId: (row: tableDataItem) => row.id,
      title,
      openDrawer,
      submit,
      handleAddVoucher,
      onCloseAfter,
    };
  },
});
</script>
