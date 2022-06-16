<template>
  <BasicModal
    width="950px"
    :title="title"
    ref="ModalRef"
    :maskClosable="true"
    @on-cancel="handleReset"
    @on-ok="handleValidate"
  >
    <n-form
      ref="formRef"
      :rules="rules"
      require-mark-placement="right-hanging"
      label-placement="top"
      :model="form"
    >
      <n-grid :cols="24" :x-gap="12" :y-gap="2">
        <n-form-item-gi :span="6" label="订单总报价" path="oldPrice">
          <n-input-number
            v-model:value="form.oldPrice"
            clearable
            :readonly="true"
          />
        </n-form-item-gi>

        <n-form-item-gi :span="6" label="订单调整后总报价" path="newPrice">
          <n-input-number
            v-model:value="form.newPrice"
            clearable
            :readonly="true"
          />
        </n-form-item-gi>

        <n-form-item-gi :span="6" label="订单浮动费" path="oldFloatCost">
          <n-input-number
            v-model:value="form.oldFloatCost"
            clearable
            :readonly="true"
          />
        </n-form-item-gi>

        <n-form-item-gi :span="6" label="订单调整后浮动费" path="newFloatCost">
          <n-input-number
            v-model:value="form.newFloatCost"
            clearable
            :readonly="true"
          />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="清空所有费用">
          <n-button attr-type="button" type="warning" @click="clearAllCost">清空所有费用</n-button>&nbsp;
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="订单固定费" path="orderFixedCost">
          <n-input-number
            v-model:value="form.orderFixedCost"
            clearable
            :min=0
            :max=9999
            :disabled="isMeituan"
            @update:value="calculateOrderPriceData"
          />
        </n-form-item-gi>

        <n-form-item-gi :span="12" label="订单里程(公里)" path="orderServiceMileage">
          <n-input-number
            v-model:value="form.orderServiceMileage"
            clearable
            :min=0
            :max=9999
            @update:value="calculateOrderPriceData"
          />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="订单里程费" path="orderMileageCost">
          <n-input-number
            v-model:value="form.orderMileageCost"
            clearable
            :disabled=true
          />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="订单时长(分钟)" path="orderServiceDuration">
          <n-input-number
            v-model:value="form.orderServiceDuration"
            :validator="validator"
            clearable
            :min=0
            :max=9999
            @update:value="calculateOrderPriceData"
          />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="订单时长费" path="orderDurationCost">
          <n-input-number
            v-model:value="form.orderDurationCost"
            clearable
            :disabled="true"
          />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="订单等待时长(分钟)" path="driverWaitPassengerDuration">
          <n-input-number
            v-model:value="form.driverWaitPassengerDuration"
            clearable
            :validator="validator"
            :min=0
            :max=9999
            :disabled="isMeituan"
            @update:value="calculateOrderPriceData"
          />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="订单等待费" path="driverWaitPassengerDurationCost">
          <n-input-number
            v-model:value="form.driverWaitPassengerDurationCost"
            clearable
            :disabled=true
          />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="路桥费" path="roadCost">
          <n-input-number
            v-model:value="form.roadCost"
            clearable
            :min=0
            :max=9999
            @update:value="calculateOrderPriceData"
          />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="停车费" path="parkingCost">
          <n-input-number
            v-model:value="form.parkingCost"
            clearable
            :min=0
            :max=9999
            @update:value="calculateOrderPriceData"
          />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="清洁费" path="cleaningCost">
          <n-input-number
            v-model:value="form.cleaningCost"
            clearable
            :min=0
            :max=9999
            @update:value="calculateOrderPriceData"
          />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="其他费" path="otherCost">
          <n-input-number
            v-model:value="form.otherCost"
            clearable
            :min=0
            :max=9999
            @update:value="calculateOrderPriceData"
          />
        </n-form-item-gi>
        <n-form-item-gi :span="24" label="调整原因" path="adjustReason">
          <n-input
            v-model:value="form.adjustReason"
            type="textarea"
            clearable
            :maxlength="100"
            :minlength="1"
            :autosize="{
              minRows: 3,
              maxRows: 5
            }"
          ></n-input>
        </n-form-item-gi>
        <n-form-item-gi
          path="password"
          label="管理员密码" :span="14">
          <n-input
            style="width: 200px"
            v-model:value="form.password"
            type="password"
            showPasswordOn="click"
            placeholder="请输入密码"
            :maxlength="20"
          >
            <template #prefix>
              <n-icon size="18" color="#808695">
                <LockClosedOutline/>
              </n-icon>
            </template>
          </n-input>
        </n-form-item-gi>
      </n-grid>
      <div cass="text-center">
        <n-button attr-type="button" type="primary" @click="submit">保存</n-button>
      </div>
    </n-form>
  </BasicModal>
</template>

<script lang="ts">
import {defineComponent, ref, unref, onMounted} from "vue";
import {FormInst, FormItemRule, useMessage} from "naive-ui";
import BasicModal from "@/components/Modal/Modal.vue";
import {positiveDecimal} from "@/utils/verify";
import {AdjustFinishOrderPriceForm} from "@/views/operateOrder/servingOrder/type";
import {adjustFinishOrderPrice, calculateOrderPrice, getOrderDetail} from "@/api/operateOrder/operateOrder";
import md5 from "blueimp-md5";
import {LockClosedOutline} from "@vicons/ionicons5";
export default defineComponent({
  name: "FinishOrderPriceModel",
  components: {BasicModal,LockClosedOutline},
  emits: ["on-save-after"],
  setup: function (_, {emit}) {
    const ModalRef = ref();
    const message = useMessage();
    const loading = ref(true);
    const title = ref();
    const form = ref<AdjustFinishOrderPriceForm>({
      oldPrice: null,
      newPrice: null,
      driverWaitPassengerDurationCost: null,
      orderDurationCost: null,
      oldFloatCost: null,
      newFloatCost: null,
      orderId: null,
      orderFixedCost: null,
      orderServiceMileage: null,
      orderServiceDuration: null,
      roadCost: null,
      parkingCost: null,
      cleaningCost: null,
      otherCost: null,
      driverWaitPassengerDuration: null,
      adjustReason: null,
      password: "",
      orderMileageCost: null

    });
    const isMeituan = ref(false)
    const detail = ref();
    const isShow = ref(false)
    const formRef = ref<FormInst | null>(null);
    const handleModal = (t: string, o: string) => {
      console.log(t)
      title.value = t
      form.value.orderId = o
      getData()
      const {showModal} = ModalRef.value;
      showModal();
    };

    const cancelModal = () => {
      const {cancel} = ModalRef.value;
      cancel()
    }

    function handleValidate() {
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

    function handleReset() {
      form.value = {
        oldPrice: null,
        newPrice: null,
        driverWaitPassengerDurationCost: null,
        orderDurationCost: null,
        oldFloatCost: null,
        newFloatCost: null,
        orderId: null,
        orderFixedCost: null,
        orderServiceMileage: null,
        orderServiceDuration: null,
        roadCost: null,
        parkingCost: null,
        cleaningCost: null,
        otherCost: null,
        driverWaitPassengerDuration: null,
        adjustReason: null,
        password: "",
        orderMileageCost: null
      };
      formRef.value?.restoreValidation();
    }

    const getData = async () => {
      if (!form.value.orderId){
        return false;
      }
      loading.value = true;
      try {
        let res = await getOrderDetail({orderId: form.value.orderId});
        if (res.success) {
          // 如果是美团的单子，固定费不能修改
          if (res.data.influxCode === 'IFT0005') {
            isMeituan.value = true
          } else {
            isMeituan.value = false
          }
          form.value.orderId = res.data.orderId;
          form.value.oldPrice = res.data.orderTotalCost;
          form.value.newPrice = res.data.orderTotalCost;
          form.value.driverWaitPassengerDurationCost = res.data.driverWaitPassengerDurationCost;
          form.value.orderDurationCost = res.data.orderDurationCost;
          form.value.oldFloatCost = res.data.orderFloatCost;
          form.value.newFloatCost = res.data.orderFloatCost;
          form.value.orderFixedCost = res.data.orderFixedCost;
          form.value.orderServiceMileage = res.data.orderServiceMileage;
          form.value.orderServiceDuration = res.data.orderServiceDuration;
          form.value.roadCost = res.data.roadCost;
          form.value.parkingCost = res.data.parkingCost;
          form.value.cleaningCost = res.data.cleaningCost;
          form.value.otherCost = res.data.otherCost;
          form.value.driverWaitPassengerDuration = res.data.driverWaitPassengerDuration;
          form.value.orderMileageCost = res.data.orderMileageCost;
        }
        loading.value = false;
      } catch (err) {
        console.log(err);
        loading.value = false;
      }
    };

    async function calculateOrderPriceData(value: number | null) {
     console.log(value)
      try {
        let option = {
          orderId: form.value.orderId,
          orderFixedCost: form.value.orderFixedCost,
          orderServiceMileage: form.value.orderServiceMileage,
          orderServiceDuration: form.value.orderServiceDuration,
          roadCost: form.value.roadCost,
          parkingCost: form.value.parkingCost,
          cleaningCost: form.value.cleaningCost,
          otherCost: form.value.otherCost,
          driverWaitPassengerDuration: form.value.driverWaitPassengerDuration
        };
        let res = await calculateOrderPrice(option);
        if (res.success) {
          form.value.newPrice = res.data.orderTotalCost
          form.value.orderMileageCost = res.data.orderMileageCost
          form.value.orderDurationCost = res.data.orderDurationCost
          form.value.driverWaitPassengerDurationCost = res.data.driverWaitPassengerDurationCost
          form.value.newFloatCost = res.data.orderFloatCost
        }
        console.log(res);
      } catch (err) {
        console.log(err);
      }
    }

    function onCloseAfter() {
      isShow.value = false
      loading.value = false
    }

    function submit(e: MouseEvent) {
      e.preventDefault();
      formRef.value?.validate(async (errors) => {
        if (!errors) {
          let option = {
            orderId: form.value.orderId,
            orderFixedCost: form.value.orderFixedCost,
            orderServiceMileage: form.value.orderServiceMileage,
            orderServiceDuration: form.value.orderServiceDuration,
            roadCost: form.value.roadCost,
            parkingCost: form.value.parkingCost,
            cleaningCost: form.value.cleaningCost,
            otherCost: form.value.otherCost,
            driverWaitPassengerDuration: form.value.driverWaitPassengerDuration,
            adjustReason: form.value.adjustReason,
            password: md5(unref(form).password)
          }
          let res = await adjustFinishOrderPrice(option);
          if (res.success) {
            message.success(window.$tips[res.code]);
            emit("on-save-after");
            cancelModal()
          } else {
            message.error("改价失败")
          }
          loading.value = false;
        } else {
          console.log(errors);
          message.error("验证失败");
        }
      });
    }

    function clearAllCost() {
      form.value = {
        oldPrice: form.value.oldPrice,
        newPrice: 0,
        driverWaitPassengerDurationCost: 0,
        orderDurationCost: 0,
        oldFloatCost: form.value.oldFloatCost,
        newFloatCost: 0,
        orderFixedCost: 0,
        orderServiceMileage: 0,
        orderServiceDuration: 0,
        roadCost: 0,
        parkingCost: 0,
        cleaningCost: 0,
        otherCost: 0,
        driverWaitPassengerDuration: 0,
        orderMileageCost: 0,
        password: form.value.password,
        adjustReason: form.value.adjustReason,
        orderId: form.value.orderId
      };
      formRef.value?.restoreValidation();
    }

    onMounted(() => {
      getData();
    })
    return {
      ModalRef,
      formRef,
      form,
      loading,
      isShow,
      title,
      rules: {
        orderServiceMileage: {
          required: true,
          type: "number",
          trigger: ["blur", "change"],
          validator: (rule: FormItemRule, value: string) => {
            return positiveDecimal(rule, value)
          },
          message: "请输入正确里程"
        },
        orderFixedCost: {
          required: true,
          type: "number",
          trigger: ["blur", "change"],
          validator: (rule: FormItemRule, value: string) => {
            return positiveDecimal(rule, value)
          },
          message: "请输入正确费用"
        },
        driverWaitPassengerDuration: {
          required: true,
          type: "number",
          trigger: ["blur", "change"],
          message: "请输入正确等待时长"
        },
        orderServiceDuration: {
          required: true,
          type: "number",
          trigger: ["blur", "change"],
          message: "请输入正确订单时长"
        },
        roadCost: {
          required: true,
          type: "number",
          trigger: ["blur", "change"],
          validator: (rule: FormItemRule, value: string) => {
            return positiveDecimal(rule, value)
          },
          message: "请输入正确路桥费"
        },
        parkingCost: {
          required: true,
          type: "number",
          trigger: ["blur", "change"],
          validator: (rule: FormItemRule, value: string) => {
            return positiveDecimal(rule, value)
          },
          message: "请输入正确停车费"
        },
        cleaningCost: {
          required: true,
          type: "number",
          trigger: ["blur", "change"],
          validator: (rule: FormItemRule, value: string) => {
            return positiveDecimal(rule, value)
          },
          message: "请输入正确清洁费"
        },
        otherCost: {
          required: true,
          type: "number",
          trigger: ["blur", "change"],
          validator: (rule: FormItemRule, value: string) => {
            return positiveDecimal(rule, value)
          },
          message: "请输入正确其他费用"
        },
        adjustReason: {
          required: true,
          trigger: ["blur", "change"],
          message: "请输入调整原因"
        },
        password: {
          required: true,
          trigger: ["blur", "change"],
          message: "请输入管理员密码"
        }
      },
      validator: (x: number) => x >= 0 && x<=9999,
      detail,
      handleModal,
      handleValidate,
      handleReset,
      onCloseAfter,
      submit,
      clearAllCost,
      isMeituan,
      calculateOrderPriceData
    };
  },
});
</script>
