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
        <n-form-item-gi :span="6" label="订单总报价" path="orderTotalCost">
          <n-input-number v-model:value="form.orderTotalCost" clearable :readonly="true" />
        </n-form-item-gi>

        <n-form-item-gi :span="6" label="订单调整后总报价" path="orderCancelCost">
          <n-input-number v-model:value="form.orderCancelCost" clearable />
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
              maxRows: 5,
            }"
          />
        </n-form-item-gi>
        <n-form-item-gi path="password" label="管理员密码" :span="14">
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
                <LockClosedOutline />
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
import { defineComponent, ref, unref, onMounted } from "vue";
import { FormInst, FormItemRule, useMessage } from "naive-ui";
import BasicModal from "@/components/Modal/Modal.vue";
import { positiveDecimal } from "@/utils/verify";
import { AdjustCancelOrderPriceForm } from "@/views/operateOrder/servingOrder/type";
import { adjustCancelOrderPrice, getOrderDetail } from "@/api/operateOrder/operateOrder";
import md5 from "blueimp-md5";
import { LockClosedOutline } from "@vicons/ionicons5";
export default defineComponent({
  name: "AdjustCancelOrderPriceModel",
  components: { BasicModal, LockClosedOutline },
  emits: ["on-save-after"],
  setup: function (_, { emit }) {
    const ModalRef = ref();
    const message = useMessage();
    const loading = ref(true);
    const title = ref();
    const form = ref<AdjustCancelOrderPriceForm>({
      orderId: null,
      orderTotalCost: null,
      orderCancelCost: null,
      adjustReason: null,
      password: "",
    });
    const detail = ref();
    const isShow = ref(false);
    const formRef = ref<FormInst | null>(null);
    const handleModal = (t: string, o: string) => {
      console.log(t);
      title.value = t;
      form.value.orderId = o;
      getData();
      const { showModal } = ModalRef.value;
      showModal();
    };

    const cancelModal = () => {
      const { cancel } = ModalRef.value;
      cancel();
    };

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
        orderId: null,
        orderTotalCost: null,
        orderCancelCost: null,
        adjustReason: null,
        password: "",
      };
      formRef.value?.restoreValidation();
    }

    const getData = async () => {
      if (!form.value.orderId) {
        return false;
      }
      loading.value = true;
      try {
        let res = await getOrderDetail({ orderId: form.value.orderId });
        if (res.success) {
          form.value.orderId = res.data.orderId;
          form.value.orderTotalCost = res.data.orderTotalCost;
          form.value.orderCancelCost = res.data.orderCancelCost;
        }
        loading.value = false;
      } catch (err) {
        console.log(err);
        loading.value = false;
      }
    };

    function onCloseAfter() {
      isShow.value = false;
      loading.value = false;
    }

    function submit(e: MouseEvent) {
      e.preventDefault();
      formRef.value?.validate(async (errors) => {
        if (!errors) {
          let option = {
            orderId: form.value.orderId,
            orderCancelCost: form.value.orderCancelCost,
            adjustReason: form.value.adjustReason,
            password: md5(unref(form).password),
          };
          let res = await adjustCancelOrderPrice(option);
          if (res.success) {
            message.success(window.$tips[res.code]);
            emit("on-save-after");
            cancelModal();
          } else {
            message.error("改价失败");
          }
          loading.value = false;
        } else {
          console.log(errors);
          message.error("验证失败");
        }
      });
    }

    onMounted(() => {
      getData();
    });
    return {
      ModalRef,
      formRef,
      form,
      loading,
      isShow,
      title,
      rules: {
        orderCancelCost: {
          required: true,
          type: "number",
          trigger: ["blur", "change"],
          validator: (rule: FormItemRule, value: string) => {
            return positiveDecimal(rule, value);
          },
          message: "请输入正确价格",
        },
        adjustReason: {
          required: true,
          trigger: ["blur", "change"],
          message: "请输入调整原因",
        },
        password: {
          required: true,
          trigger: ["blur", "change"],
          message: "请输入管理员密码",
        },
      },
      validator: (x: number) => x >= 0 && x <= 9999,
      detail,
      handleModal,
      handleValidate,
      handleReset,
      onCloseAfter,
      submit,
    };
  },
});
</script>
