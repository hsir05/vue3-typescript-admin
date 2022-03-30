<template>
  <div class="h-full box-border opening-business">
    <!-- 左侧 -->
    <div class="opening-business-left">
      <div class="flex-align-start">
        <n-form-item
          ref="queryFormRef"
          :rule="queryRule"
          label-width="70"
          label="开通城市"
          label-placement="left"
        >
          <n-select
            v-model:value="cityCode"
            clearable
            filterable
            placeholder="选择开通城市"
            style="width: 260px"
            :options="openCityList.result"
          />
        </n-form-item>

        <n-button
          attr-type="button"
          :loading="loading"
          class="ml-10px"
          type="primary"
          @click="handleValidate"
          >查找</n-button
        >
      </div>

      <n-data-table
        ref="table"
        :data="data"
        :columns="columns"
        class="box-border"
        min-height="400px"
        flex-height
        :row-key="getRowKeyId"
        :pagination="false"
      />
    </div>
    <!-- 中间 -->
    <div class="opening-business-right">
      <div class="flex-align-start striped">
        <span class="vehicle-type-item">#</span>
        <span class="n-checkbox">立即</span>
        <span class="n-checkbox">预约</span>
        <span class="n-checkbox">接机</span>
        <span class="n-checkbox">送机</span>
        <span class="n-checkbox">半日租</span>
        <span class="n-checkbox">全日租</span>
      </div>

      <div class="flex-align-start striped" v-for="(item, index) in list" :key="index">
        <span class="vehicle-type-item">{{ item.typeName }}</span>
        <n-checkbox-group :value="cities" @update:value="handleUpdateValue" size="large">
          <n-checkbox
            :value="val.busType"
            :disabled="val.disabled"
            :key="val.busType"
            v-for="val in item.checkboxList"
          />
        </n-checkbox-group>
      </div>
    </div>
    <!-- 右侧 -->

    <n-form
      ref="formRef"
      :rules="rules"
      size="large"
      label-placement="left"
      :style="{ maxWidth: '440px' }"
      require-mark-placement="right-hanging"
      label-width="140"
      :model="form"
    >
      <n-form-item label="基础计费" path="operateCity">
        <n-select
          clearable
          filterable
          v-model:value="form.operateCity"
          placeholder="选择基础计费"
          @update:value="handleUpdateValue"
          :options="option"
        />
      </n-form-item>
      <n-form-item label="基础计费" path="operateCity">
        <n-select
          clearable
          filterable
          v-model:value="form.operateCity"
          placeholder="选择里程计费"
          @update:value="handleUpdateValue"
          :options="option"
        />
      </n-form-item>
      <n-form-item label="时长计费" path="operateCity">
        <n-select
          clearable
          filterable
          v-model:value="form.operateCity"
          placeholder="选择基础计费"
          @update:value="handleUpdateValue"
          :options="option"
        />
      </n-form-item>

      <div class="text-center flex-center">
        <n-button
          attr-type="button"
          :loading="loading"
          size="large"
          type="primary"
          @click="handleValidate"
          >确认开通</n-button
        >
        <n-button
          attr-type="button"
          type="warning"
          size="large"
          class="ml-10px"
          @click="handleReset"
          >取消</n-button
        >
      </div>
    </n-form>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, h } from "vue";
import { FormInst, useMessage } from "naive-ui";
import openCityList from "@/config/openCityList.json";
import TableActions from "@/components/TableActions/TableActions.vue";
import { tableItemProps, tableDataItem, formState } from "./type";
import { CreateOutline as CreateIcon } from "@vicons/ionicons5";
export default defineComponent({
  name: "OpeningBusiness",
  setup() {
    const data = ref([
      {
        cityCode: "110000",
        areaCode: "110000A01",
        area: "主城区",
        areaLock: 0,
      },
    ]);
    const loading = ref(false);
    const cityCode = ref(null);
    const queryFormRef = ref<FormInst | null>(null);
    const message = useMessage();

    const citiesRef = ref<(string | number)[]>([]);

    const formRef = ref<FormInst | null>(null);
    const form = ref<formState>({
      operateCity: null,
    });

    const columns = [
      {
        title: "开通区域",
        key: "area",
        align: "center",
      },
      {
        title: "区域编码",
        key: "areaCode",
        align: "center",
      },
      {
        title: "操作",
        key: "actions",
        align: "center",
        width: 100,
        render(record: tableDataItem, index: number) {
          return h(TableActions as any, {
            actions: [
              {
                label: "编辑",
                type: "primary",
                icon: CreateIcon,
                isIconBtn: true,
                onClick: handleEdit.bind(null, record, index),
                auth: ["dict001"],
              },
            ],
          });
        },
      },
    ];

    async function handleValidate() {
      try {
        await formRef.value?.validate();
        console.log(cityCode.value);
      } catch (err) {
        console.log(err);
        message.error("验证失败");
      }
    }

    function handleEdit(record: tableDataItem) {
      console.log(record);
    }

    function handleUpdateValue(value: (string | number)[]) {
      //   citiesRef.value = value;
      console.log(value);
      message.info(JSON.stringify(value));
    }

    function handleReset() {}

    return {
      cities: citiesRef,
      loading,
      formRef,
      form,
      queryFormRef,
      cityCode,
      columns,
      getRowKeyId: (row: tableItemProps) => row.id,
      data,
      openCityList,
      queryRule: {
        trigger: ["input", "blur"],
        validator() {
          if (cityCode.value === null) {
            return new Error("选择开通城市");
          }
        },
      },
      rules: {},
      list: [
        {
          typeName: "专车-经济型",
          type: "",
          checkboxList: [
            {
              busType: 1,
              checked: true,
              disabled: false,
            },
            {
              busType: 2,
              checked: 1,
              disabled: false,
            },
            {
              busType: 3,
              checked: 1,
              disabled: false,
            },
            {
              busType: 4,
              checked: 1,
              disabled: false,
            },
            {
              busType: 5,
              checked: 1,
              disabled: false,
            },
            {
              busType: 6,
              checked: 1,
              disabled: false,
            },
          ],
        },
        {
          typeName: "专车-舒适型",
          checkboxList: [
            {
              busType: 1,
              checked: true,
              disabled: false,
            },
            {
              busType: 2,
              checked: 1,
              disabled: false,
            },
            {
              busType: 3,
              checked: 1,
              disabled: false,
            },
            {
              busType: 4,
              checked: 1,
              disabled: false,
            },
            {
              busType: 5,
              checked: 1,
              disabled: false,
            },
            {
              busType: 6,
              checked: 1,
              disabled: false,
            },
          ],
        },
      ],
      option: [],

      handleValidate,
      handleUpdateValue,
      handleReset,
    };
  },
});
</script>
<style lang="scss" scoped>
.opening-business {
  display: flex;
  align-content: flex-start;
  justify-content: flex-start;
  &-left {
    width: 350px;
    background-color: $white;
    padding: 20px 10px 10px;
  }
  &-right {
    width: calc(100% - 350px - 10px);
    background-color: $white;
    max-width: 600px;
    padding: 20px 10px 10px;
    box-sizing: border-box;
    margin-left: 10px;
  }
  .striped {
    background-color: #fafafc;
  }
  .flex-align-start {
    display: flex;
    align-content: center;
    border: 1px solid #efeff5;
    margin-top: -1px;
    .n-checkbox-group {
      width: 100%;
    }
    .n-checkbox {
      min-width: 52px;
      padding: 10px;
      border-left: 1px solid #f2f3f5;
      justify-content: center;
    }
  }
  .vehicle-type-item {
    padding: 10px;
    display: inline-block;
    min-width: 120px;
    text-align: center;
  }
}
</style>
