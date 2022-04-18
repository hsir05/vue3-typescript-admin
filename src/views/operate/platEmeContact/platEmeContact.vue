<template>
  <div class="emergency-contac">
    <div class="emergency-contac-left">
      <div class="mt-10px mb-10px text-right">
        <!-- <span>虚拟车头列表</span> -->
        <n-button attr-type="button" type="primary" @click="handleAddContact">
          <template #icon>
            <n-icon> <AddIcon /> </n-icon>
          </template>
          添加平台紧急联系人</n-button
        >
      </div>
      <n-data-table
        ref="table"
        :data="data"
        :columns="columns"
        class="box-border"
        min-height="500px"
        flex-height
        :row-key="getRowKeyId"
        :pagination="false"
      />
    </div>
    <!-- 右侧 -->
    <div class="emergency-contac-right">
      <n-form
        ref="formRef"
        :rules="rules"
        label-placement="left"
        :style="{ maxWidth: '320px', marginLeft: '10px', paddingTop: '50px' }"
        require-mark-placement="right-hanging"
        label-width="120"
        :model="form"
      >
        <n-form-item label="姓名" path="name">
          <n-input
            v-model:value="form.name"
            clearable
            style="width: 280px"
            placeholder="输入司机手机号"
          />
        </n-form-item>

        <n-form-item label="联系电话" path="phone">
          <n-input
            v-model:value="form.phone"
            clearable
            style="width: 280px"
            placeholder="输入司机手机号"
          />
        </n-form-item>

        <div class="text-center">
          <n-button attr-type="button" :loading="loading" type="primary" @click="handleValidate"
            >保存</n-button
          >
          <n-button
            attr-type="button"
            :disabled="loading"
            class="ml-10px"
            type="warning"
            @click="handleValiReset"
            >重置</n-button
          >
        </div>
      </n-form>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, h, unref, toRaw } from "vue";
import TableActions from "@/components/TableActions/TableActions.vue";
import {
  CreateOutline as CreateIcon,
  Add as AddIcon,
  TrashOutline as RemoveIcon,
} from "@vicons/ionicons5";
import { tableItemProps, tableDataItem } from "./type";
import { FormInst, useMessage, FormItemRule } from "naive-ui";

export default defineComponent({
  name: "EmergencyContac",
  components: { AddIcon },
  setup() {
    const loading = ref(false);
    const formRef = ref<FormInst | null>(null);
    const form = ref<tableDataItem>({
      name: null,
      phone: null,
    });
    const data = ref([
      {
        id: 12312,
        name: "章三",
        phone: "180927654567",
      },
    ]);
    const columns = [
      {
        title: "姓名",
        key: "name",
        width: 120,
        align: "center",
      },
      {
        title: "联系方式",
        key: "phone",
        width: 120,
        align: "center",
      },
      {
        title: "操作",
        key: "actions",
        align: "center",
        width: 90,
        render(record: tableDataItem) {
          return h(TableActions as any, {
            actions: [
              {
                label: "编辑",
                type: "primary",
                icon: CreateIcon,
                isIconBtn: true,
                onClick: handleEdit.bind(null, record),
                auth: ["dict001"],
              },
              {
                label: "删除",
                type: "error",
                icon: RemoveIcon,
                isIconBtn: true,
                secondary: true,
                auth: ["dict002"],
                popConfirm: {
                  onPositiveClick: handleRemove.bind(null, record),
                  title: "您确定删除?",
                },
              },
            ],
          });
        },
      },
    ];
    const message = useMessage();

    function handleEdit(record: tableDataItem) {
      console.log(toRaw(record));
      form.value = { ...form.value, ...record };
    }

    function handleValidate(e: MouseEvent) {
      e.preventDefault();
      formRef.value?.validate((errors) => {
        if (!errors) {
          console.log(unref(form));
          message.success("验证成功");
        } else {
          console.log(errors);
          message.error("验证失败");
        }
      });
    }

    function handleRemove(record: Recordable) {
      //   message.info("点击了删除", record);
      console.log("点击了删除", record);
    }

    function handleValiReset() {
      form.value = { name: null, phone: null };
      formRef.value?.restoreValidation();
    }

    function handleAddContact() {
      handleValiReset();
    }

    return {
      data,
      formRef,
      loading,
      form,
      columns,
      getRowKeyId: (row: tableItemProps) => row.id,
      rules: {
        name: {
          required: true,
          trigger: ["blur"],
          validator: (rule: FormItemRule, value: string) => {
            console.log(rule);
            return /^[\u4E00-\u9FA5]{1,5}$/.test(value);
          },
          min: 2,
          max: 15,
          message: "请输入正确的司机姓名",
        },
        phone: {
          required: true,
          trigger: ["input"],
          validator: (rule: FormItemRule, value: string) => {
            console.log(rule);
            return /^1\d{10}$/.test(value);
          },
          message: "请输入电话号码",
        },
      },

      handleValidate,
      handleValiReset,
      handleAddContact,
    };
  },
});
</script>
<style lang="scss" scoped>
.emergency-contac {
  display: flex;
  align-content: flex-start;
  justify-content: space-between;

  &-left {
    width: 350px;
    background-color: $white;
  }
  &-right {
    width: calc(100% - 350px - 10px);
    background-color: $white;
  }
}
</style>
