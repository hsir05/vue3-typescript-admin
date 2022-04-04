<template>
  <div class>
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
      <n-form-item label="班级编码" path="teamCode">
        <n-input
          v-model:value="queryValue.teamCode"
          clearable
          placeholder="输入班级编码"
          style="width: 200px"
        />
      </n-form-item>

      <n-form-item label="班级名称" path="teamName">
        <n-input
          v-model:value="queryValue.teamName"
          clearable
          placeholder="输入班级名称"
          style="width: 200px"
        />
      </n-form-item>

      <n-form-item label="运营企业" path="companyName">
        <n-select
          clearable
          style="width: 200px"
          v-model:value="queryValue.companyName"
          placeholder="选择运营企业"
          :options="options"
        />
      </n-form-item>

      <n-form-item>
        <n-button attr-type="button" type="primary" @click="searchHandle">查询</n-button>
        <n-button attr-type="button" type="warning" class="ml-10px" @click="reset">重置</n-button>
      </n-form-item>
    </n-form>

    <div class="team-box">
      <div class="team-content">
        <TeamItem
          v-for="item in data"
          :key="item.id"
          :item="item"
          @on-member="handleMember"
          @on-see="handleSee"
        />
      </div>
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
import { defineComponent, ref, reactive, toRefs } from "vue";
import TeamItem from "./teamItem.vue";
import TeamDrawer from "./teamDrawer.vue";
import { pageSizes } from "@/config/table";
export default defineComponent({
  name: "Team",
  components: {
    TeamItem,
    TeamDrawer,
  },
  setup() {
    const loading = ref(false);
    const teamDrawerRef = ref();
    const queryValue = ref({
      teamCode: null,
      teamName: null,
      companyName: null,
    });

    const itemCount = ref(null);
    const pagination = reactive({
      page: 1,
      pageSize: 10,
    });

    function searchHandle() {}
    function reset() {}

    function handleMember() {
      const { openDrawer } = teamDrawerRef.value;
      openDrawer();
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
      options: [],
      queryValue,
      data: [
        {
          code: "AT300",
          name: "里斯",
          id: "wrwer23423",
          number: 13123,
          createTiem: "2020-04-24 08:51",
          avatar: "http://testcxpm.yiminyueche.com/resources/judf/images/default-header-image.png",
        },
        {
          code: "AT300",
          name: "里斯22",
          id: "wrwer23423",
          number: 13144423,
          createTiem: "2020-04-24 08:51",
          avatar: "http://testcxpm.yiminyueche.com/resources/judf/images/default-header-image.png",
        },
        {
          code: "AT300",
          name: "里斯33",
          id: "wrwer23423",
          number: 1313333344423,
          createTiem: "2020-04-24 08:51",
          avatar: "http://testcxpm.yiminyueche.com/resources/judf/images/default-header-image.png",
        },
        {
          code: "AT300",
          name: "里斯444",
          id: "wrwer23423",
          number: 1314455555423,
          createTiem: "2020-04-24 08:51",
          avatar: "http://testcxpm.yiminyueche.com/resources/judf/images/default-header-image.png",
        },
        {
          code: "AT300",
          name: "阿法纳西.阿法纳西耶维奇",
          id: "wrwer23423",
          number: 13144466666623,
          createTiem: "2020-04-24 08:51",
          avatar: "http://testcxpm.yiminyueche.com/resources/judf/images/default-header-image.png",
        },
      ],

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
  background-color: $white;
  padding: 5px;
}
.team-content {
  display: flex;
  align-content: flex-start;
  justify-content: flex-start;
  flex-wrap: wrap;
}
</style>
