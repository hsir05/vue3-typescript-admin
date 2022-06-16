<template>
  <BasicDrawer v-model:show="isDrawer" :title="title" @on-close-after="onCloseAfter">
    <n-form
      ref="formRef"
      label-placement="left"
      label-width="180"
      style="flex-wrap: wrap"
      class="pt-15px pb-15px bg-white mb-5px"
      :model="form"
      :rules="codeRules"
    >
      <n-form-item v-if="isBatch" label="兑换码" path="exchangeCode">
        <n-input-group style="width: 260px">
          <n-input
            v-model:value="form.exchangeCode"
            clearable
            :maxlength="10"
            @blur="uniqueExchangeCodeValue"
            placeholder="输入兑换码"
            :style="{ width: '80%' }"
          />
          <n-button type="primary" @click="randomWord(10)" ghost> 快速生成</n-button>
        </n-input-group>
      </n-form-item>

      <n-form-item v-if="!isBatch" label="批量生成兑换码任务名称" path="taskName">
        <n-input
          style="width: 260px"
          v-model:value="form.taskName"
          clearable
          :maxlength="50"
          @blur="uniqueTaskNameValue"
          placeholder="请输入任务名称"
          :style="{ width: '80%' }"
        />
      </n-form-item>

      <n-form-item v-if="!isBatch" label="批量生成兑换码个数" path="exchangeCodeCount">
        <n-input-number
          style="width: 260px"
          v-model:value="form.exchangeCodeCount"
          clearable
          :min="1"
          :max="99999"
          placeholder="请输入兑换码个数"
          :style="{ width: '80%' }"
        />
      </n-form-item>

      <n-form-item label="生效时间" path="exchangeCodeEffectiveTimeBegin">
        <n-date-picker
          v-model:value="form.exchangeCodeEffectiveTimeBegin"
          style="width: 260px"
          type="datetime"
          clearable
          :is-date-disabled="disablePreviousDate"
        />
      </n-form-item>

      <n-form-item label="失效时间" path="exchangeCodeEffectiveTimeEnd">
        <n-date-picker
          v-model:value="form.exchangeCodeEffectiveTimeEnd"
          type="datetime"
          style="width: 260px"
          clearable
          :is-date-disabled="disablePreviousDate"
        />
      </n-form-item>

      <n-form-item label="可兑换次数" path="exchangeCodeUsableCount">
        <n-input-number
          v-model:value="form.exchangeCodeUsableCount"
          style="width: 260px"
          :min="0"
          :max="999999999"
          clearable
          placeholder="可兑换次数"
        />
      </n-form-item>

      <div cass="text-center">
        <n-button attr-type="button" type="primary" @click="submit">提交</n-button>
      </div>
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

    <VoucherModal ref="voucherModalRef" @on-save-after="handleSaveAfter" />
  </BasicDrawer>
</template>
<script lang="ts">
import { defineComponent, reactive, h, ref, toRefs } from "vue";
import { FormInst, useMessage } from "naive-ui";
import TableActions from "@/components/TableActions/TableActions.vue";
import { CreateOutline as CreateIcon, TrashOutline as RemoveIcon } from "@vicons/ionicons5";
import VoucherModal from "./voucherModal.vue";
import { ExchangeCodeCouponInter, TableDataItemInter, CouponInter } from "./type";
import {
  addExchangeCodeCoupon,
  addExchangeCodeCouponBatch,
  uniqueExchangeCode,
} from "@/api/marketing/marketing";
import loading from "naive-ui/lib/_internal/loading";
import { codeRules } from "./data";
import dayjs from "dayjs";
import { uniqueTaskName } from "@/api/common/common";

export default defineComponent({
  name: "CodeDrawer",
  components: { VoucherModal },
  emits: ["on-save-after"],
  setup: function (_, { emit }) {
    const state = reactive({
      isDrawer: false,
      loading: false,
      isBatch: true,
    });

    const title = ref("");
    const voucherModalRef = ref();
    const message = useMessage();

    const formRef = ref<FormInst | null>(null);
    const form = ref<ExchangeCodeCouponInter>({
      exchangeCode: null,
      exchangeCodeEffectiveTimeBegin: Date.now(),
      exchangeCodeEffectiveTimeEnd: null,
      exchangeCodeUsableCount: null,
      taskName: null,
      exchangeCodeCount: null,
    });

    const data = ref<CouponInter[]>([]);
    const columns = [
      {
        title: "序号",
        key: "index",
        align: "center",
        width: 70,
        render(_: TableDataItemInter, rowIndex: number) {
          return h("span", `${rowIndex + 1}`);
        },
      },
      {
        title: "名称",
        key: "couponName",
        align: "center",
      },
      {
        title: "面值",
        key: "couponDenomination",
        align: "center",
      },
      {
        title: "有效天数",
        key: "couponEffectiveDays",
        align: "center",
      },
      {
        title: "数量",
        key: "couponCount",
        align: "center",
      },
      {
        title: "操作",
        key: "action",
        align: "center",
        width: "90px",
        render(record: CouponInter) {
          return h(TableActions as any, {
            actions: [
              {
                label: "编辑",
                type: "primary",
                isIconBtn: true,
                icon: CreateIcon,
                onClick: handleEdit.bind(null, record),
                auth: ["dict001"],
              },
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

    function openDrawer(t: string, batch: boolean) {
      state.isBatch = batch;
      title.value = t;
      state.isDrawer = true;
    }

    function handleRemove(record: Recordable) {
      console.log(record);
      const index = data.value?.findIndex((item: CouponInter) => item === record);
      if (index !== undefined && index >= 0) {
        data.value?.splice(index, 1);
        message.success("删除成功");
      } else {
        message.error("删除失败");
      }
    }

    function handleEdit(record: CouponInter) {
      console.log(record);
      const { handleModal } = voucherModalRef.value;
      handleModal(record);
    }

    function submit(e: MouseEvent) {
      e.preventDefault();
      formRef.value?.validate(async (errors) => {
        if (!errors) {
          if (data.value.length === 0) {
            message.error("请先添加代金券");
            return;
          }
          try {
            let res;
            if (state.isBatch) {
              let option = {
                exchangeCode: form.value.exchangeCode,
                exchangeCodeEffectiveTimeBegin: dayjs(
                  form.value.exchangeCodeEffectiveTimeBegin
                ).format("YYYY-MM-DD HH:mm:ss") as string,
                exchangeCodeEffectiveTimeEnd: dayjs(form.value.exchangeCodeEffectiveTimeEnd).format(
                  "YYYY-MM-DD HH:mm:ss"
                ) as string,
                exchangeCodeUsableCount: form.value.exchangeCodeUsableCount,
                couponList: data.value,
              };
              res = await addExchangeCodeCoupon(option);
              message.success(res.message);
            } else {
              let option = {
                taskName: form.value.taskName,
                exchangeCodeCount: form.value.exchangeCodeCount,
                exchangeCodeEffectiveTimeBegin: dayjs(
                  form.value.exchangeCodeEffectiveTimeBegin
                ).format("YYYY-MM-DD HH:mm:ss") as string,
                exchangeCodeEffectiveTimeEnd: dayjs(form.value.exchangeCodeEffectiveTimeEnd).format(
                  "YYYY-MM-DD HH:mm:ss"
                ) as string,
                exchangeCodeUsableCount: form.value.exchangeCodeUsableCount,
                couponList: data.value,
              };
              res = await addExchangeCodeCouponBatch(option);
              message.success(res.message);
            }
          } catch (e) {
            console.log(e);
          }
          state.isDrawer = false;
        } else {
          console.log(errors);
          message.error("验证失败");
        }
      });
    }

    function handleAddVoucher() {
      console.log("添加代金券");
      const { handleModal } = voucherModalRef.value;
      handleModal(null);
    }

    function onCloseAfter() {
      state.isDrawer = false;
      state.loading = false;
      form.value = {
        exchangeCode: null,
        exchangeCodeEffectiveTimeBegin: Date.now(),
        exchangeCodeEffectiveTimeEnd: null,
        exchangeCodeUsableCount: null,
        taskName: null,
        exchangeCodeCount: null,
      };
      data.value = [];
    }

    //生成随机数字字符（不包含0,1,o,O,i,I,l,L不容易区分字符）
    const randomWord = (range: number) => {
      let str = "",
        arr = [
          "2",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "a",
          "b",
          "c",
          "d",
          "e",
          "f",
          "g",
          "h",
          "j",
          "k",
          "m",
          "n",
          "p",
          "q",
          "r",
          "s",
          "t",
          "u",
          "v",
          "w",
          "x",
          "y",
          "z",
          "A",
          "B",
          "C",
          "D",
          "E",
          "F",
          "G",
          "H",
          "J",
          "K",
          "M",
          "N",
          "P",
          "Q",
          "R",
          "S",
          "T",
          "U",
          "V",
          "W",
          "X",
          "Y",
          "Z",
        ];
      for (let i = 0; i < range; i++) {
        let pos = Math.round(Math.random() * (arr.length - 1));
        str += arr[pos];
      }
      form.value.exchangeCode = str;
      uniqueExchangeCodeValue();
    };

    function disablePreviousDate(ts: number) {
      return ts < Date.now() - 86400000;
    }

    const uniqueExchangeCodeValue = async () => {
      if (!form.value.exchangeCode) {
        return false;
      }
      try {
        let res = await uniqueExchangeCode({
          exchangeCode: form.value.exchangeCode,
        });
        if (res.data.UniqueBooleanResult) {
          form.value.exchangeCode = null;
          message.warning(window.$tips[res.code]);
        }
      } catch (err) {
        console.log(err);
      }
    };

    function handleSaveAfter(value: CouponInter) {
      loading.value = true;
      data.value.push(value);
      loading.value = false;
      console.info(data);
      emit("on-save-after");
    }

    const uniqueTaskNameValue = async () => {
      if (!form.value.taskName) {
        return false;
      }
      try {
        let res = await uniqueTaskName({
          importTaskName: form.value.taskName,
          importType: "",
        });
        if (res.data.UniqueBooleanResult) {
          form.value.exchangeCode = null;
          message.warning(window.$tips[res.code]);
        }
      } catch (err) {
        console.log(err);
      }
    };

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
      codeRules,
      getRowKeyId: (row: TableDataItemInter) => row.exchangeCodeId,
      title,
      openDrawer,
      submit,
      handleAddVoucher,
      onCloseAfter,
      randomWord,
      uniqueExchangeCodeValue,
      disablePreviousDate,
      handleSaveAfter,
      uniqueTaskNameValue,
    };
  },
});
</script>
