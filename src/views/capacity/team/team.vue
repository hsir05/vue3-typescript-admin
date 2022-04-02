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
      <TeamItem
        :item="{
          code: 'AT300',
          name: '里斯',
          number: 13123,
          createTiem: '2020-04-24 08:51',
          avatar: 'http://testcxpm.yiminyueche.com/resources/judf/images/default-header-image.png',
        }"
      />
    </div>

    <TeamDrawer ref="teamDrawerRef" />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import TeamItem from "./teamItem.vue";
import TeamDrawer from "./teamDrawer.vue";
export default defineComponent({
  name: "Team",
  components: {
    TeamItem,
    TeamDrawer,
  },
  setup() {
    const loading = ref(false);
    const queryValue = ref({
      teamCode: null,
      teamName: null,
      companyName: null,
    });

    function searchHandle() {}
    function reset() {}

    return {
      loading,
      rule: {},
      options: [],
      queryValue,

      searchHandle,
      reset,
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
</style>
