<template>
  <BasicDrawer v-model:show="isDrawer" title="班级信息" :width="800" @on-close-after="onCloseAfter">
    <n-descriptions label-placement="left" bordered>
      <n-descriptions-item label="班级编码">{{
        classInfo?.operationCompanyDriverClazzEntry
      }}</n-descriptions-item>
      <n-descriptions-item label="班级名称">{{
        classInfo?.operationCompanyDriverClazzName
      }}</n-descriptions-item>
      <n-descriptions-item label="班级添加时间">{{
        dayjs(classInfo?.createTime).format("YYYY-MM-DD HH:mm")
      }}</n-descriptions-item>
      <n-descriptions-item label="所属企业名称" :span="2">{{
        classInfo?.operationCompany
      }}</n-descriptions-item>
    </n-descriptions>
    <n-divider title-placement="left">成员信息</n-divider>
    <div class="member-box">
      <template v-if="data.length">
        <MemberItem v-for="item in data" :item="item" :key="item.driverNo" />
      </template>

      <n-empty v-else style="margin: 30px auto" />
    </div>
  </BasicDrawer>
</template>
<script lang="ts">
import { defineComponent, ref, toRefs, reactive } from "vue";
import { MemberItemIter, ItemInter } from "./type";
import MemberItem from "./memberItem.vue";
import { getMemberList, getTeamDetail } from "@/api/capacity/capacity";
import dayjs from "dayjs";
export default defineComponent({
  name: "TeamDrawer",
  components: { MemberItem },
  setup() {
    const state = reactive({
      isDrawer: false,
      loading: false,
    });
    const data = ref<MemberItemIter[]>([]);
    const classInfo = ref<ItemInter>();

    function openDrawer(operationCompanyDriverClazzId: string) {
      getDetail(operationCompanyDriverClazzId);
      getData(operationCompanyDriverClazzId);
      state.isDrawer = true;
    }

    const getDetail = async (operationCompanyDriverClazzId: string) => {
      try {
        state.loading = true;
        let res = await getTeamDetail({ operationCompanyDriverClazzId });
        console.log(res);
        classInfo.value = res.data.operationCompanyDriverClazz;
        state.loading = false;
      } catch (err) {
        console.log(err);
        state.loading = false;
      }
    };

    const getData = async (operationCompanyDriverClazzId: string) => {
      try {
        state.loading = true;
        let res = await getMemberList({ operationCompanyDriverClazzId });
        console.log(res.data);
        data.value = res.data.members;
        state.loading = false;
      } catch (err) {
        console.log(err);
        state.loading = false;
      }
    };

    function onCloseAfter() {
      data.value = [];
      state.isDrawer = false;
      state.loading = false;
    }

    return {
      data,
      classInfo,
      dayjs,
      ...toRefs(state),
      openDrawer,
      onCloseAfter,
    };
  },
});
</script>
<style lang="scss" scoped>
.member-box {
  display: flex;
  align-content: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-top: 10px;
}
</style>
