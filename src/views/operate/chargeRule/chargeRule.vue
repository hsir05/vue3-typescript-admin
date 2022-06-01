<template>
  <div class="h-full overflow-hidden charge-rule">
    <div class="flex p-5px bg-white mb-5px">
      <n-button type="primary" @click="handleAdd"
        ><template #icon>
          <n-icon>
            <AddIcon />
          </n-icon> </template
        >添加</n-button
      >
    </div>
    <div class="flex-align-start bg-white h-full">
      <n-tabs
        type="segment"
        :class="{ isDis: 'tabs' }"
        v-model:value="tabsValue"
        :on-update:value="handleTabs"
      >
        <n-tab-pane name="tab1" tab="基础计费规则">
          <n-data-table
            ref="table"
            :data="data"
            :loading="loading"
            :columns="columns"
            class="box-border"
            :row-key="getRowKeyId"
            :pagination="pagination"
          />
        </n-tab-pane>
        <n-tab-pane name="tab2" tab="里程计费规则">
          <n-data-table
            ref="table"
            :data="data"
            :columns="columns"
            class="box-border"
            :row-key="getRowKeyId"
            :pagination="pagination"
          />
        </n-tab-pane>
        <n-tab-pane name="tab3" tab="时长计费规则">
          <n-data-table
            ref="table"
            :data="data"
            :columns="columns"
            class="box-border"
            :row-key="getRowKeyId"
            :pagination="pagination"
          />
        </n-tab-pane>
        <n-tab-pane name="tab4" tab="取消计费规则">
          <n-data-table
            ref="table"
            :data="data"
            :columns="columns"
            class="box-border"
            :row-key="getRowKeyId"
            :pagination="pagination"
          />
        </n-tab-pane>
        <n-tab-pane name="tab5" tab="等待计费规则">
          <n-data-table
            ref="table"
            :data="data"
            :columns="columns"
            class="box-border"
            :row-key="getRowKeyId"
            :pagination="pagination"
          />
        </n-tab-pane>
        <n-tab-pane name="tab6" tab="浮动计费规则">
          <n-data-table
            ref="table"
            :data="data"
            :columns="columns"
            class="box-border"
            :row-key="getRowKeyId"
            :pagination="pagination"
          />
        </n-tab-pane>
      </n-tabs>

      <Distribution ref="distributionRef" @save-after="handleAfer" />
    </div>
    <ChargeRuleDrawer :width="500" @on-save-after="handleSaveAfter" ref="chargeRuleDrawerRef" />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, h, onMounted } from "vue";
import TableActions from "@/components/TableActions/TableActions.vue";
import { CreateOutline as CreateIcon, Add as AddIcon } from "@vicons/ionicons5";
import ChargeRuleDrawer from "./chargeRuleDrawer.vue";
import Distribution from "./distribution.vue";
import { getRuleData } from "@/api/operate/chargeRule";
import { TableDataItemInter } from "./type";
import { objInter } from "@/interface/common/common";
export default defineComponent({
  name: "ChargeRule",
  components: { ChargeRuleDrawer, AddIcon, Distribution },
  setup() {
    const loading = ref(false);
    const itemCount = ref(null);
    const isDis = ref(false);
    const chargeRuleDrawerRef = ref();
    const distributionRef = ref();
    const data = ref([]);

    const tabsValue = ref("tab1");

    let obj: objInter = {
      tab1: "chargeRuleBaseDescription",
      tab2: "chargeRuleMileageDesc",
      tab3: "chargeRuleDurationDesc",
      tab4: "chargeRuleWaitDesc",
      tab5: "chargeRuleCancelDesc",
      tab6: "chargeRuleFloatDesc",
    };
    const columns = ref([
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
        title: "规则描述",
        key: obj[tabsValue.value],
        align: "center",
        ellipsis: {
          tooltip: true,
        },
      },
      {
        title: "操作",
        key: "action",
        align: "center",
        width: 100,
        render(record: TableDataItemInter) {
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
            ],
          });
        },
      },
    ]);

    onMounted(() => {
      getData("tab1");
    });

    function handleTabs(value: string) {
      columns.value[1].key = obj[value];
      tabsValue.value = value;
      data.value = [];
      getData(value);
    }
    const getData = async (type: string) => {
      try {
        loading.value = true;
        let res = await getRuleData(type);
        data.value = res.data;
        loading.value = false;
      } catch (err) {
        console.log(err);
        loading.value = false;
      }
    };

    function handleAdd() {
      const { openDrawer } = chargeRuleDrawerRef.value;
      openDrawer("新增计费规则");
    }

    // base 基础，mileage里程，duration时长，wait等待，
    // floatHoliday工作日浮动，floatWorkday节假日浮动，cancel取消
    let orderTypeObj: objInter = {
      tab1: "base",
      tab2: "mileage",
      tab3: "duration",
      tab4: "cancel",
      tab5: "wait",
      tab6: "floatHoliday",
    };
    function handleEdit(record: Recordable) {
      isDis.value = false;
      const { openModal } = distributionRef.value;
      openModal(record, orderTypeObj[tabsValue.value]);
    }

    // 抽屉组件保存后处理
    function handleSaveAfter() {
      data.value = [];
      getData("tab1");
    }

    function handleAfer() {
      isDis.value = false;
    }

    return {
      data,
      isDis,
      loading,
      chargeRuleDrawerRef,
      distributionRef,
      tabsValue,
      pagination: {
        pageSize: 10,
      },
      getRowKeyId: (row: TableDataItemInter) => row.chargeRuleBaseId,
      itemCount,
      columns,
      handleTabs,
      handleAdd,
      handleAfer,
      handleSaveAfter,
    };
  },
});
</script>
<style lang="scss" scoped>
.charge-rule-box {
  height: 100%;
}

.tabs {
  width: calc(100% - 450px - 10px);
  transition: All ease;
}
</style>
