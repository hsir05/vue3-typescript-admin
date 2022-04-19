<template>
  <n-form
    ref="formRef"
    :rules="rules"
    label-placement="left"
    class="p-10px"
    require-mark-placement="right-hanging"
    label-width="140"
    :model="form"
  >
    <n-divider title-placement="left" style="padding: 5px 0; margin: 5px 0">编辑</n-divider>
    <n-form-item label="用车前占用时间" path="beforTime">
      <n-input
        v-model:value="form.beforTime"
        clearable
        placeholder="输入用车前占用时间"
        style="width: 290px"
      />
    </n-form-item>

    <n-form-item label="用车后占用时间" path="afterTime">
      <n-input
        v-model:value="form.afterTime"
        clearable
        placeholder="输入用车后占用时间"
        style="width: 290px"
      />
    </n-form-item>

    <div class="form-item ml-25px" v-for="(item, index) in form.vhchileData" :key="index">
      <FormItem
        :item="item"
        :ref="
          (el) => {
            if (el) formItemRef[index] = el;
          }
        "
      />

      <n-button
        attr-type="button"
        type="primary"
        size="small"
        class="ml-12px mt-4px"
        @click="handleAdd"
        ><template #icon>
          <n-icon>
            <AddIcon />
          </n-icon> </template
      ></n-button>

      <n-button
        attr-type="button"
        type="primary"
        size="small"
        @click="handleRemove(index)"
        class="ml-12px mt-4px"
        ><template #icon>
          <n-icon>
            <RemoveIcon />
          </n-icon>
        </template>
      </n-button>
    </div>

    <!-- <n-table :bordered="true" class="ml-15px" :single-line="false" style="width: 420px; text-align: center">
            <thead>
                <tr>
                    <th>车型</th>
                    <th>单量上限</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in form.vhchileData" :key="index">
                    <td>
                        <n-select clearable filterable style="width: 140px" v-model:value="item.vehicleType"
                            placeholder="选择车型" :options="options" />
                    </td>
                    <td>
                        <n-input v-model:value="item.orderLimit" clearable placeholder="输入单量上限" style="width: 140px" />
                    </td>
                    <td>
                       <FormItem :item="item" ref="formItemRef" /> 
                    </td>

                    <td>
                        <n-icon @click="handleRemove(index)" size="22" style="cursor: pointer;">
                            <RemoveIcon />
                        </n-icon>
                    </td>
                </tr>
                <tr>
                    <td colspan="3">
                        <n-button attr-type="button" type="primary" size="small" @click="handleAdd"><template #icon>
                                <n-icon>
                                    <AddIcon />
                                </n-icon>
                            </template>点击添加单量上限配置</n-button>
                    </td>
                </tr>
            </tbody>
        </n-table> -->

    <div class="text-center mt-15px">
      <n-button attr-type="button" type="primary" size="small" @click="submit">查询</n-button>
      <n-button attr-type="button" type="warning" size="small" class="ml-10px" @click="reset"
        >重置</n-button
      >
    </div>
  </n-form>
</template>
<script lang="ts">
import { defineComponent, ref, onBeforeUpdate } from "vue";
import { FormInst, useMessage } from "naive-ui";
import { tableDataItem } from "./type";
import { Add as AddIcon } from "@vicons/ionicons5";
import { TrashOutline as RemoveIcon } from "@vicons/ionicons5";
import FormItem from "./formItem.vue";
export default defineComponent({
  name: "OrderEditItem",
  components: { RemoveIcon, AddIcon, FormItem },
  setup() {
    const message = useMessage();
    const formItemRef = ref([]);
    const formRef = ref<FormInst | null>(null);
    const form = ref<tableDataItem>({
      afterTime: null,
      beforTime: null,
      vhchileData: [
        {
          vehicleType: null,
          orderLimit: null,
        },
      ],
    });

    onBeforeUpdate(() => {
      formItemRef.value = [];
    });

    function handleAdd() {
      form.value.vhchileData.push({
        vehicleType: null,
        orderLimit: null,
      });
    }

    function submit(e: MouseEvent) {
      e.preventDefault();

      for (let i = 0; i < formItemRef.value.length; i++) {
        const { formItemSubmit } = formItemRef.value[i];
        //@ts-ignore
        formItemSubmit();
      }

      formRef.value?.validate((errors) => {
        if (!errors) {
          message.success("验证成功");
        } else {
          console.log(errors);
          message.error("验证失败");
        }
      });
    }

    function handleRemove(index: number) {
      !index && message.warning("已经是最后一个了!");
      if (index > 0) {
        form.value.vhchileData.pop();
      }
    }

    function reset() {}

    return {
      formRef,
      formItemRef,
      form,
      options: [],
      rules: {
        beforTime: { required: true, trigger: ["blur", "input"], message: "请输入用车前占用时间" },
        afterTime: { required: true, trigger: ["blur", "input"], message: "请输入用车前占用时间" },
      },

      submit,
      handleRemove,
      reset,
      handleAdd,
    };
  },
});
</script>
<style lang="scss" scoped>
.form-item {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
}
</style>
