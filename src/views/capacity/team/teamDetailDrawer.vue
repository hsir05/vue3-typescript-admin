<template>
  <BasicDrawer v-model:show="isDrawer" title="班级信息" :width="800" @on-close-after="onCloseAfter">
    <div class="ml-10px pt-15px avatar text-center">
      <n-image
        width="120"
        :src="classInfo?.operationCompanyLeaderClazzDriver?.driverIdentificationPhoto || avatar"
      />
      <p class="monitor-title">班长照片</p>
    </div>

    <n-descriptions label-placement="left" bordered>
      <n-descriptions-item label="班级编码">{{
        classInfo?.operationCompanyDriverClazzEntry
      }}</n-descriptions-item>
      <n-descriptions-item label="班级名称">{{
        classInfo?.operationCompanyDriverClazzName
      }}</n-descriptions-item>
      <n-descriptions-item label="班级人数">{{ classInfo?.driverCount }}</n-descriptions-item>
      <n-descriptions-item label="班级添加时间">{{
        dayjs(classInfo?.createTime).format("YYYY-MM-DD HH:mm")
      }}</n-descriptions-item>
      <n-descriptions-item label="所属企业名称" :span="2">{{
        classInfo?.operationCompanyName
      }}</n-descriptions-item>
    </n-descriptions>
  </BasicDrawer>
</template>
<script lang="ts">
import { defineComponent, ref, toRefs, reactive } from "vue";
import { MemberItemIter, ItemInter } from "./type";
import { getTeamDetail } from "@/api/capacity/capacity";
import dayjs from "dayjs";
import avatar from "@/assets/image/default-avatar.png";
export default defineComponent({
  name: "TeamDetailDrawer",
  setup() {
    const state = reactive({
      isDrawer: false,
      loading: false,
    });
    const data = ref<MemberItemIter[]>([]);
    const classInfo = ref<ItemInter>();

    function openDrawer(operationCompanyDriverClazzId: string) {
      getDetail(operationCompanyDriverClazzId);

      state.isDrawer = true;
    }

    const getDetail = async (operationCompanyDriverClazzId: string) => {
      try {
        state.loading = true;
        let res = await getTeamDetail({ operationCompanyDriverClazzId });
        console.log(res);
        classInfo.value = {
          driverCount: res.data.driverCount,
          ...res.data.operationCompanyDriverClazz,
        };

        state.loading = false;
      } catch (err) {
        console.log(err);
        state.loading = false;
      }
    };

    function onCloseAfter() {
      state.isDrawer = false;
      state.loading = false;
    }

    return {
      data,
      avatar,
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
.monitor-title {
  text-align: center;
}
</style>
