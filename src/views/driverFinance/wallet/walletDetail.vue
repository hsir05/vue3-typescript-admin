<template>
  <n-divider title-placement="left">{{ title }}</n-divider>
  <n-descriptions label-placement="left" bordered :column="3">
    <n-descriptions-item label="司机工号">{{ walletInfo.driverNo }}</n-descriptions-item>
    <n-descriptions-item label="客户姓名">{{ walletInfo.driverFullName }}</n-descriptions-item>
    <n-descriptions-item label="客户手机号">{{ walletInfo.driverPhone }}</n-descriptions-item>
    <n-descriptions-item label="总金额(元)">{{ walletInfo.totalBalance }}</n-descriptions-item>
    <n-descriptions-item label="冻结金额(元)">{{ walletInfo.frozenAmount }}</n-descriptions-item>
    <n-descriptions-item label="可用余额(元)">{{ walletInfo.availablealance }}</n-descriptions-item>
    <n-descriptions-item label="预留阈值">{{ walletInfo.reserveBalanceLimit }}</n-descriptions-item>
    <n-descriptions-item label="钱包创建时间"
      >{{ dayjs(walletInfo.createTime).format("YYYY-MM-DD HH:mm") }}
    </n-descriptions-item>
  </n-descriptions>
</template>
<script lang="ts" setup>
import { toRefs } from "vue";
import { WalletInfoInter } from "./type";
import dayjs from "dayjs";
const props = defineProps({
  title: {
    type: String,
    default: "个人客户钱包",
  },
  walletInfo: {
    type: Object as PropType<WalletInfoInter>,
    require: true,
    default: () => {
      return {};
    },
  },
});
const { title } = toRefs(props);
</script>
