<template>
  <div class="h-full overflow-hidden charge-rule">
    <div class="flex-align-start charge-rule-box">
      <!-- 表格 -->
      <BasicTable
        :data="data"
        style="width: calc(100% - 375px - 15px); height: 100%"
        ref="basicTableRef"
        :columns="columns"
        :isAddBtn="true"
        :loading="loading"
        :itemCount="itemCount"
        @reload-page="reloadPage"
        @on-page="handlePage"
        @on-add="handleAdd"
        @on-pagination="handlepagSize"
      />
      <!-- 右侧编辑 -->
      <div class="right-edit">
        <n-divider title-placement="left"> 开通业务分配基础计费规则 </n-divider>
        <n-form
          ref="busionessFormRef"
          :rules="businessRules"
          label-placement="left"
          :style="{ maxWidth: '360px', marginLeft: '10px', marginRight: '30px' }"
          require-mark-placement="right-hanging"
          label-width="90"
          :model="businessForm"
        >
          <n-form-item label="订单类型" path="orderType">
            <n-select
              clearable
              filterable
              v-model:value="businessForm.orderType"
              placeholder="选择订单类型"
              :options="orderType.result"
            />
          </n-form-item>

          <n-form-item label="车辆类型" path="vehicleType">
            <n-select
              clearable
              filterable
              v-model:value="businessForm.vehicleType"
              placeholder="选择车辆类型"
              :options="vehicleTypeList.result.vehicleTypeList"
            />
          </n-form-item>

          <n-form-item label="开通区域" path="areaArea">
            <n-select
              clearable
              filterable
              v-model:value="businessForm.areaArea"
              placeholder="选择开通区域"
              :options="openArea"
            />
          </n-form-item>
          <div class="flex-center">
            <n-button attr-type="button" :loading="loading" type="primary" @click="handleSubmit"
              >保存</n-button
            >
            <n-button
              attr-type="button"
              class="ml-10px"
              :loading="loading"
              type="warning"
              @click="handleReset"
              >重置</n-button
            >
          </div>
        </n-form>
      </div>
    </div>
    <ChargeRuleDrawer :width="500" @on-save-after="handleSaveAfter" ref="chargeRuleDrawerRef" />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, h, toRaw, unref } from "vue";
import BasicTable from "@/components/Table/Table.vue";
import TableActions from "@/components/TableActions/TableActions.vue";
import { CreateOutline as CreateIcon } from "@vicons/ionicons5";
import ChargeRuleDrawer from "./chargeRuleDrawer.vue";
import { FormInst, useMessage } from "naive-ui";
import { PaginationState } from "@/api/type";
import { tableDataItem } from "./type";
import orderType from "@/config/orderTypeList.json";
import vehicleTypeList from "@/config/vehicleTypeList.json";
export default defineComponent({
  name: "ChargeRule",
  components: { BasicTable, ChargeRuleDrawer },
  setup() {
    const loading = ref(false);
    const itemCount = ref(null);
    const chargeRuleDrawerRef = ref();
    const basicTableRef = ref();

    const busionessFormRef = ref<FormInst | null>(null);
    const businessForm = ref<tableDataItem>({
      vehicleType: null,
      orderType: null,
      areaArea: null,
    });

    const message = useMessage();

    const data = ref([
      {
        id: "123erwer",
        ruleDescripot: "套餐价0.01元（包含1公里20分钟）",
        vehicle: "",
        orderType: "",
        areaArea: "",
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
        title: "规则描述",
        key: "ruleDescripot",
        align: "center",
      },
      {
        title: "操作",
        key: "action",
        align: "center",
        width: "260px",
        render(record: tableDataItem) {
          return h(TableActions as any, {
            actions: [
              {
                label: "编辑",
                type: "primary",
                icon: CreateIcon,
                onClick: handleEdit.bind(null, record),
                auth: ["dict001"],
              },
            ],
          });
        },
      },
    ];

    function reloadPage() {
      const { resetPagination } = basicTableRef.value;
      resetPagination();
      //   getData({ page: 1, pageSize: 10 });
    }

    function handleAdd() {
      console.log("点击了新增");
      const { openDrawer } = chargeRuleDrawerRef.value;
      openDrawer("新增");
    }

    function handleEdit(record: Recordable) {
      console.log("点击了编辑", record.id);
      const { openDrawer } = chargeRuleDrawerRef.value;
      openDrawer("编辑", record);
    }

    function handlePage(pagination: PaginationState) {
      console.log(toRaw(pagination));
      //   getData(toRaw(pagination));
    }

    function handlepagSize(pagination: PaginationState) {
      console.log(toRaw(pagination));
      //   getData(toRaw(pagination));
    }

    // 抽屉组件保存后处理
    function handleSaveAfter() {
      console.log("抽屉组件保存后处理");
      //   getData({ page: 1, pageSize: 10 });
    }

    function handleSubmit(e: MouseEvent) {
      e.preventDefault();
      busionessFormRef.value?.validate((errors) => {
        if (!errors) {
          loading.value = true;
          console.log(unref(busionessFormRef));

          handleSaveAfter();

          message.success("验证成功");
        } else {
          console.log(errors);
          message.error("验证失败");
        }
      });
    }
    function handleReset() {}

    return {
      data,
      loading,
      chargeRuleDrawerRef,
      itemCount,
      columns,
      basicTableRef,
      busionessFormRef,
      businessRules: {
        vehicleType: { required: true, trigger: ["blur", "change"], message: "请选择车辆类型" },
        orderType: { required: true, trigger: ["blur", "change"], message: "请选择订单类型" },
        areaArea: { required: true, trigger: ["blur", "change"], message: "请选择开通区域" },
      },
      businessForm,
      orderType,
      vehicleTypeList,
      openArea: [
        {
          type: "group",
          label: "Rubber Soul",
          key: "Rubber Soul",
          children: [
            {
              label: "Everybody's",
              value: "song0",
              key: "Rubber Soul",
            },
          ],
        },
      ],

      reloadPage,
      handlePage,
      handleAdd,
      handleSubmit,
      handleReset,
      handlepagSize,
      handleSaveAfter,
    };
  },
});
</script>
<style lang="scss" scoped>
.charge-rule {
}
.charge-rule-box {
  height: 100%;
}
.right-edit {
  background-color: $white;
  width: 390px;
  margin-left: 15px;
  height: 100%;
}
</style>
