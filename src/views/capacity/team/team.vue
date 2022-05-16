<template>
  <div class="h-full">
    <!-- 搜索 -->
    <n-form
      ref="formRef"
      inline
      :rule="rule"
      :show-feedback="false"
      label-placement="left"
      label-width="80"
      class="pt-15px pb-15px bg-white mb-5px flex-wrap"
      :model="queryValue"
    >
      <n-form-item label="班级编码" path="operationCompanyDriverClazzEntryLike">
        <n-input
          v-model:value="queryValue.operationCompanyDriverClazzEntryLike"
          clearable
          placeholder="输入班级编码"
          style="width: 200px"
        />
      </n-form-item>
      <n-form-item label="班级名称" path="operationCompanyDriverClazzNameLike">
        <n-input
          v-model:value="queryValue.operationCompanyDriverClazzNameLike"
          clearable
          placeholder="输入班级名称"
          style="width: 200px"
        />
      </n-form-item>

      <n-form-item label="运营企业" path="operationCompanyIdEq">
        <n-select
          clearable
          style="width: 200px"
          filterable
          v-model:value="queryValue.operationCompanyIdEq"
          placeholder="选择运营企业"
          :options="companyData"
        />
      </n-form-item>

      <n-form-item>
        <n-button attr-type="button" type="primary" @click="searchHandle">查询</n-button>
        <n-button attr-type="button" type="warning" class="ml-10px" @click="reset">重置</n-button>
      </n-form-item>
    </n-form>

    <div class="team-box">
      <div class="team-content" v-if="data.length">
        <TeamItem
          v-for="item in data"
          :key="item.operationCompanyDriverClazzId"
          :item="item"
          @on-member="handleMember(item)"
          @on-see="handleSee"
        />
      </div>
      <n-empty v-if="!data.length" class="empty" />
      <!-- 分页 -->
      <n-pagination
        v-if="itemCount"
        v-model:page="page"
        v-model:page-size="pageSize"
        v-model:item-count="itemCount"
        :page-slot="5"
        :show-size-picker="true"
        :show-quick-jumper="true"
        class="mt-10px justify-end mr-10px"
        :on-update:page="handlePage"
        :on-update:page-size="handlePageSize"
        :page-sizes="pageSizes"
      >
        <template #prefix> 共 {{ itemCount }} 项 </template>
      </n-pagination>
    </div>
    <TeamDrawer ref="teamDrawerRef" />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, reactive, toRefs, onMounted } from "vue";
import TeamItem from "./teamItem.vue";
import TeamDrawer from "./teamDrawer.vue";
import { pageSizes } from "@/config/table";
import { getDriverClazzPage } from "@/api/capacity/capacity";
import { getAllOperateCompany } from "@/api/common/common";
import { PaginationInter } from "@/api/type";
import { ItemInter } from "./type";
export default defineComponent({
  name: "Team",
  components: {
    TeamItem,
    TeamDrawer,
  },
  setup() {
    const loading = ref(false);
    const teamDrawerRef = ref();
    const companyData = ref([]);
    const queryValue = ref({
      operationCompanyDriverClazzEntryLike: null,
      operationCompanyDriverClazzNameLike: null,
      operationCompanyIdEq: null,
    });
    const data = ref<ItemInter[]>([]);

    const itemCount = ref(null);
    const pagination = reactive({
      page: 1,
      pageSize: 12,
    });

    onMounted(() => {
      getAllCompanyData();
      getData({ pageIndex: 1, pageSize: 12 });
    });

    const getAllCompanyData = async () => {
      try {
        let res = await getAllOperateCompany();
        companyData.value = res.data.map(
          (item: { operationCompanyName: string; operationCompanyId: string }) => {
            let obj = {
              label: item.operationCompanyName,
              value: item.operationCompanyId,
            };
            return obj;
          }
        );
      } catch (err) {
        console.log(err);
      }
    };

    const getData = async (page: PaginationInter) => {
      loading.value = true;
      try {
        let search = { ...queryValue.value };
        let res = await getDriverClazzPage({ page, search: search });
        console.log(res);

        data.value = res.data.content;
        itemCount.value = res.data.totalElements;
        loading.value = false;
      } catch (err) {
        console.log(err);
        loading.value = false;
      }
    };

    function searchHandle() {
      getData({ pageIndex: 1, pageSize: 10 });
    }
    function reset() {
      queryValue.value = {
        operationCompanyDriverClazzEntryLike: null,
        operationCompanyDriverClazzNameLike: null,
        operationCompanyIdEq: null,
      };
      getData({ pageIndex: 1, pageSize: 10 });
    }

    function handleMember(record: Recordable) {
      const { openDrawer } = teamDrawerRef.value;
      openDrawer(record.operationCompanyDriverClazzId);
    }
    function handleSee() {}

    function handlePage(page: number) {
      pagination.page = page;
    }
    // 每页显示
    function handlePageSize(pageSize: number) {
      pagination.pageSize = pageSize;
    }

    return {
      loading,
      pageSizes,
      ...toRefs(pagination),
      itemCount,
      rule: {},
      companyData,
      queryValue,
      data,

      searchHandle,
      reset,
      teamDrawerRef,
      handleMember,
      handleSee,
      handlePage,
      handlePageSize,
    };
  },
});
</script>
<style lang="scss" scoped>
.team-box {
  width: 100%;
  height: calc(100% - 80px);
  background-color: $white;
  padding: 5px;
}

.team-content {
  display: flex;
  align-content: flex-start;
  justify-content: flex-start;
  flex-wrap: wrap;
  height: 93%;
  overflow: scroll;
}
</style>
