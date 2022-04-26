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
    <div class="flex-align-start h-full">
      <n-tabs type="segment" :class="{ isDis: 'tabs' }" :on-update:value="handleTabs">
        <n-tab-pane name="tab1" tab="基础计费规则">
          <n-data-table
            ref="table"
            :data="data"
            :loading="loading"
            :columns="columns"
            class="box-border"
            min-height="calc(100vh - 300px)"
            flex-height
            :row-key="getRowKeyId"
            :pagination="false"
          />
        </n-tab-pane>
        <n-tab-pane name="tab2" tab="里程计费规则">
          <n-data-table
            ref="table"
            :data="data"
            :columns="columns"
            class="box-border"
            min-height="calc(100vh - 300px)"
            flex-height
            :row-key="getRowKeyId"
            :pagination="false"
          />
        </n-tab-pane>
        <n-tab-pane name="tab3" tab="时长计费规则">
          <n-data-table
            ref="table"
            :data="data"
            :columns="columns"
            class="box-border"
            min-height="calc(100vh - 300px)"
            flex-height
            :row-key="getRowKeyId"
            :pagination="false"
          />
        </n-tab-pane>
        <n-tab-pane name="tab4" tab="取消计费规则">
          <n-data-table
            ref="table"
            :data="data"
            :columns="columns"
            class="box-border"
            min-height="calc(100vh - 300px)"
            flex-height
            :row-key="getRowKeyId"
            :pagination="false"
          />
        </n-tab-pane>
        <n-tab-pane name="tab5" tab="等待计费规则">
          <n-data-table
            ref="table"
            :data="data"
            :columns="columns"
            class="box-border"
            min-height="calc(100vh - 300px)"
            flex-height
            :row-key="getRowKeyId"
            :pagination="false"
          />
        </n-tab-pane>
        <n-tab-pane name="tab6" tab="浮动计费规则">
          <n-data-table
            ref="table"
            :data="data"
            :columns="columns"
            class="box-border"
            min-height="calc(100vh - 300px)"
            flex-height
            :row-key="getRowKeyId"
            :pagination="false"
          />
        </n-tab-pane>
      </n-tabs>

      <Distribution v-if="isDis" @save-after="handleAfer" />
    </div>
    <ChargeRuleDrawer :width="500" @on-save-after="handleSaveAfter" ref="chargeRuleDrawerRef" />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, h, toRaw, onMounted } from "vue";
import TableActions from "@/components/TableActions/TableActions.vue";
import { CreateOutline as CreateIcon, Add as AddIcon } from "@vicons/ionicons5";
import ChargeRuleDrawer from "./chargeRuleDrawer.vue";
import Distribution from "./distribution.vue";
// import { useMessage } from "naive-ui";
import { getRuleData } from "@/api/operate/chargeRule";
import { PaginationState } from "@/api/type";
import { tableDataItem } from "./type";
export default defineComponent({
  name: "ChargeRule",
  components: { ChargeRuleDrawer, AddIcon, Distribution },
  setup() {
    const loading = ref(false);
    const itemCount = ref(null);
    const isDis = ref(false);
    const chargeRuleDrawerRef = ref();
    // const message = useMessage();
    const data = ref([]);
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
        width: "200px",
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

    onMounted(() => {
      getData("tab1");
    });

    function handleTabs(value: string) {
      console.log(value);
      data.value = [];
      getData(value);
    }
    const getData = async (type: string) => {
      try {
        loading.value = true;
        let res = await getRuleData(type);
        console.log(res);
        data.value = res.data;
        loading.value = false;
      } catch (err) {
        console.log(err);
        loading.value = false;
      }
    };

    function handleAdd() {
      console.log("点击了新增");
      const { openDrawer } = chargeRuleDrawerRef.value;
      openDrawer("新增");
    }

    function handleEdit(record: Recordable) {
      console.log("点击了编辑", record.id);
      isDis.value = true;
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

    function handleAfer() {
      isDis.value = false;
    }

    return {
      data,
      isDis,
      loading,
      chargeRuleDrawerRef,
      getRowKeyId: (row: tableDataItem) => row.id,
      itemCount,
      columns,
      handleTabs,
      handlePage,
      handleAdd,
      handleAfer,
      handlepagSize,
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
