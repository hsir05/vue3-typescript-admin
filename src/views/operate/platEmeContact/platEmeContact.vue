<template>
  <div class="emergency-contac h-full">
    <div class="emergency-contac-left p-5px">
      <div class="mt-10px mb-10px text-right">
        <n-button attr-type="button" type="primary" @click="handleAddContact">
          <template #icon>
            <n-icon>
              <AddIcon />
            </n-icon>
          </template>
          添加平台紧急联系人
        </n-button>
      </div>
      <n-data-table
        ref="table"
        :data="data"
        :loading="loading"
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
        :style="{ maxWidth: '400px', marginLeft: '10px', paddingTop: '50px' }"
        require-mark-placement="right-hanging"
        label-width="120"
        :model="form"
      >
        <n-form-item label="姓名" path="contactName">
          <n-input
            v-model:value="form.contactName"
            clearable
            style="width: 280px"
            placeholder="输入司机手机号"
          />
        </n-form-item>

        <n-form-item label="联系电话" path="contactPhone">
          <n-input
            v-model:value="form.contactPhone"
            :maxlength="11"
            clearable
            style="width: 280px"
            @blur="uniquePhone"
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
import { defineComponent, ref, h, unref, onMounted } from "vue";
import TableActions from "@/components/TableActions/TableActions.vue";
import {
  CreateOutline as CreateIcon,
  Add as AddIcon,
  TrashOutline as RemoveIcon,
} from "@vicons/ionicons5";
import { tableItemProps, tableDataItem } from "./type";
import { FormInst, useMessage, FormItemRule } from "naive-ui";
import {
  getEmergencyContact,
  saveEmeContact,
  removeEmeContact,
  uniqueContactPhone,
} from "@/api/operate/operate";
export default defineComponent({
  name: "EmergencyContac",
  components: { AddIcon },
  setup() {
    const loading = ref(false);
    const phone = ref<string | null>(null);
    const formRef = ref<FormInst | null>(null);
    const form = ref<tableDataItem>({
      contactName: null,
      contactPhone: null,
    });
    const data = ref([]);
    const columns = [
      {
        title: "姓名",
        key: "contactName",
        width: 120,
        align: "center",
      },
      {
        title: "联系方式",
        key: "contactPhone",
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

    onMounted(() => {
      getData();
    });

    function handleEdit(record: tableDataItem) {
      phone.value = record.contactPhone;
      form.value = { ...form.value, ...record };
    }

    function handleValidate(e: MouseEvent) {
      e.preventDefault();
      formRef.value?.validate((errors) => {
        if (!errors) {
          console.log(unref(form));
          saveContact();
        } else {
          console.log(errors);
          message.error("验证失败");
        }
      });
    }

    function handleRemove(record: Recordable) {
      removeContact(record.contactId);
    }

    const getData = async () => {
      loading.value = true;
      try {
        let res = await getEmergencyContact();
        console.log(res);
        data.value = res.data;
        loading.value = false;
      } catch (err) {
        console.log(err);
        loading.value = false;
      }
    };
    const uniquePhone = async () => {
      if (form.value.contactId && form.value.contactPhone === phone.value) {
        return false;
      }
      try {
        let res = await uniqueContactPhone({ contactPhone: form.value.contactPhone as string });
        console.log(res);
        if (res.data.UniqueBooleanResult) {
          form.value.contactPhone = null;
          message.success(res.message);
        }
      } catch (err) {
        console.log(err);
      }
    };
    const removeContact = async (contactId: string) => {
      loading.value = true;
      try {
        let res = await removeEmeContact({ contactId });
        console.log(res);
        getData();
        message.success(res.message);
        loading.value = false;
      } catch (err) {
        console.log(err);
        loading.value = false;
      }
    };
    const saveContact = async () => {
      loading.value = true;
      try {
        let res = await saveEmeContact(form.value);
        console.log(res);
        message.success(res.message);
        getData();
        handleValiReset();
        loading.value = false;
      } catch (err) {
        console.log(err);
        loading.value = false;
      }
    };

    function handleValiReset() {
      form.value = { contactPhone: null, contactName: null };
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
      getRowKeyId: (row: tableItemProps) => row.contactId,
      rules: {
        contactName: {
          required: true,
          trigger: ["blur"],
          message: "请输入正确的司机姓名",
        },
        contactPhone: {
          required: true,
          trigger: ["input"],
          validator: (rule: FormItemRule, value: string) => {
            console.log(rule);
            return /^1\d{10}$/.test(value);
          },
          message: "请输入正确格式的电话号码",
        },
      },

      handleValidate,
      handleValiReset,
      handleAddContact,
      uniquePhone,
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
    width: 650px;
    background-color: $white;
    box-sizing: border-box;
  }

  &-right {
    width: calc(100% - 650px - 10px);
    background-color: $white;
  }
}
</style>
