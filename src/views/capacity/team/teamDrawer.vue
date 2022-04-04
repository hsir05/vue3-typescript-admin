<template>
  <BasicDrawer v-model:show="isDrawer" :title="title" :width="800" @on-close-after="onCloseAfter">
    <n-descriptions label-placement="left" bordered title="班级信息">
      <n-descriptions-item label="班级编码">0001</n-descriptions-item>
      <n-descriptions-item label="班级名称">班级名称</n-descriptions-item>
      <n-descriptions-item label="班级添加时间">2020-04-24 08:51:10</n-descriptions-item>
      <n-descriptions-item label="所属企业名称" :span="2"
        >兰州益民出行汽车服务有限公司无锡分公司</n-descriptions-item
      >
    </n-descriptions>
    <n-divider title-placement="left">成员信息</n-divider>
    <div class="member-box">
      <MemberItem v-for="item in member" :item="item" :key="item.id" />
    </div>
  </BasicDrawer>
</template>
<script lang="ts">
import { defineComponent, ref, toRefs, reactive } from "vue";
import { tableDataItem } from "./type";
import MemberItem from "./memberItem.vue";
export default defineComponent({
  name: "TeamDrawer",
  components: { MemberItem },
  setup() {
    const title = ref("班级信息");
    const state = reactive({
      isDrawer: false,
      loading: false,
    });

    function openDrawer(record?: tableDataItem) {
      console.log(record);
      state.isDrawer = true;
    }

    function onCloseAfter() {
      state.isDrawer = false;
      state.loading = false;
    }

    return {
      title,
      ...toRefs(state),
      member: [
        {
          name: "邵天运",
          id: "123123wr",
          number: "106193",
          sex: 1,
          avatar:
            "https://yimin-chuxing.oss-cn-beijing.aliyuncs.com/yimin_driver_images/driver_identification/bd8e98d4-f35b-4b53-8d65-eea34fc09438.jpg",
        },
        {
          name: "芮洪军",
          number: "106163",
          id: "12312312",
          sex: 1,
          avatar:
            "https://yimin-chuxing.oss-cn-beijing.aliyuncs.com/yimin_driver_images/driver_identification/cf59da3a-752f-4161-a88b-baa010fd10a4.jpg",
        },
        {
          name: "芮洪军",
          number: "106163",
          id: "1231233312",
          sex: 1,
          avatar:
            "https://yimin-chuxing.oss-cn-beijing.aliyuncs.com/yimin_driver_images/driver_identification/cf59da3a-752f-4161-a88b-baa010fd10a4.jpg",
        },
      ],
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
