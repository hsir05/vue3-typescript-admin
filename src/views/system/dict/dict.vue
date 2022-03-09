<template>
  <div class="dict">
    <!-- <n-alert title="字典配置说明" type="warning">
      关于字典的说明
    字典统一管理本系统中的枚举值，即字典中的词条，词条的名称用来在用户交互界面显示，词条编码为数据库中实际的保存值，参与业务。
    关于新增词条的说明
    新增词条时需要规定词条编码，词条编码统一使用两位[三位]大写字母加5位[4位]数字的格式（如：AT00001），编码一经规定不能修改，建议设计词条编码时一定慎重！
    关于词条编辑的说明
    编辑词条时，不允许编辑词条编码，以免使数据库中已经保存的词条编码无法对应获取词条名称
    </n-alert> -->

    <n-data-table
      ref="table"
      :columns="columns"
      :data="data"
      :pagination="false"
      @update:checked-row-keys="handleCheck"
    />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, h } from "vue";
import { NButton } from "naive-ui";
const columns = [
  {
    type: "selection",
  },
  {
    title: "Name",
    key: "name",
  },
  {
    title: "Age",
    key: "age",
  },
  {
    title: "Address",
    key: "address",
  },
  {
    title: "Action",
    key: "actions",
    render(row) {
      return h(
        NButton,
        {
          size: "small",
          onClick: () => row,
        },
        { default: () => "Send Email" }
      );
    },
  },
];

export default defineComponent({
  name: "Dict",
  setup() {
    const checkedRowKeysRef = ref([]);
    const handleCheck = () => {};
    return {
      data: [],
      columns,
      checkedRowKeys: checkedRowKeysRef,
      pagination: {
        pageSize: 5,
      },
      handleCheck,
    };
  },
});
</script>
<style lang="scss" scoped>
.dict {
  background-color: $white;
  height: 100%;
  padding: 5px;
  box-sizing: border-box;
}
</style>
