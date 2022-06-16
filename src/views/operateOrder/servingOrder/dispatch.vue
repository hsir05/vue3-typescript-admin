<template>
  <div class="flex-align-start order-detail h-full">
    <div class="left">
      <n-descriptions label-placement="left" bordered :column="2">
        <n-descriptions-item label="流量方订单号" :span="2">{{ order?.influxOrderNo }}</n-descriptions-item>
        <n-descriptions-item label="订单类型" :span="2">{{ order?.orderType }}</n-descriptions-item>
        <n-descriptions-item label="下单客户电话" :span="2">{{ order?.customerPhone }}</n-descriptions-item>
      </n-descriptions>
      <div class="m-10px flex-align-start mt-30px">
        <n-form
          ref="queryFormRef"
          label-placement="left"
          label-width="120"
          style="flex-wrap: wrap"
          :model="queryForm"
          :rules="rules"
        >
          <n-form-item
            :loading="selectLoading"
            path="orderPlaceVehicleId"
            label="选择下单车型">
            <n-select
              v-model:value="queryForm.orderPlaceVehicleId"
              remote
              clearable
              filterable
              placeholder="请选择下单车型"
              style="width: 200px"
              :options="vehicleTypeData"
              @update:value="handleUpdateValue"
            />
          </n-form-item>
          <n-form-item
            :loading="selectLoading"
            path="operationCompanyDriverId"
            label="选择改派司机">
            <n-select
              v-model:value="queryForm.operationCompanyDriverId"
              remote
              clearable
              filterable
              placeholder="请选择要改派司机"
              style="width: 200px"
              @search="handleSearch"
              :options="driverData"
            />
          </n-form-item>

          <n-form-item
            path="loginPassword"
            label="管理员密码">
            <n-input
              style="width: 200px"
              v-model:value="queryForm.loginPassword"
              type="password"
              showPasswordOn="click"
              placeholder="请输入密码"
            >
              <template #prefix>
                <n-icon size="18" color="#808695">
                  <LockClosedOutline/>
                </n-icon>
              </template>
            </n-input>
          </n-form-item>
        </n-form>
      </div>

      <div class="text-center flex-center">
        <n-button attr-type="button" type="primary" @click="handleSubmit">保存</n-button>
      </div>
    </div>
    <div class="right">
      <BaiduMap ref="baiduMapRef" class="map"/>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, ref, unref, onUnmounted} from "vue";
import BaiduMap from "@/components/Map/BaiduMap.vue";
import {FormInst, useMessage} from "naive-ui";
import {DispatchForm} from "@/views/operateOrder/servingOrder/type";
import {
  artificialDistributeOrder, findByDriverNoHeaderUnlock, findVehicleTypeByOrderId,
  getOrderDetail
} from "@/api/operateOrder/operateOrder";
import {useRoute, useRouter} from "vue-router";
import md5 from "blueimp-md5";
import {getDetailViaLoginer} from "@/api/system/system";
import {
  refreshDriverPositionByAreaCode,
  refreshDriverPositionByVehicleTypeAndAreaCode
} from "@/api/common/common";
import freeIconImg from "@/assets/image/icon_driver_map_idle.png";
import busyIconImg from "@/assets/image/icon_driver_map_busy.png";
import restIconImg from "@/assets/image/icon_driver_map_rest.png";
import offDutyIconImg from "@/assets/image/icon_driver_map_offDuty.png";
import {sizeEnum} from "@/enums/breakpointEnum";
import {LockClosedOutline} from "@vicons/ionicons5";
import {getDriverDetail} from "@/api/realtimeDynamic/realtimeDynamic";
import {forEach} from "lodash-es";

export default defineComponent({
  name: "Dispatch",
  components: {
    BaiduMap,
    LockClosedOutline
  },
  setup() {
    const router = useRouter();
    //定义 timer 初始值及类型
    let timer: NodeJS.Timer | null = null
    const route = useRoute();
    const baiduMapRef = ref();
    const message = useMessage();
    const queryFormRef = ref<FormInst | null>(null);
    const loading = ref(false);
    const queryForm = ref<DispatchForm>({
      orderId: null,
      operationCompanyDriverId: null,
      orderPlaceVehicleId: null,
      loginPassword: ""
    });
    const driverInfoOpts = ref({
      width: 130,     // 信息窗口宽度
      height: 150,     // 信息窗口高度
      title: "<b style='color:#3c8dbc;font-size:18px;'>司机信息</b>", // 信息窗口标题
      enableMessage: true//设置允许信息窗发送短息
    })
    const driverMarkerMap = new Map<sizeEnum, number>()
    const driverPositionList = ref()
    const title = ref();
    const selectLoading = ref(false);
    const order = ref();
    const driverData = ref();
    const vehicleTypeData = ref();
    onMounted(async () => {
      getData(route.query.id as string)
    });
    onUnmounted(() => {
      console.log("清理定时器")
      // 清理定时器要处理 timer 的类型
      clearInterval(Number(timer))
      timer = null
      console.log(timer)
    })


    const getData = async (orderId: string) => {
      if (!orderId) {
        return false;
      }
      queryForm.value.orderId = orderId;
      try {
        loading.value = true;
        let res = await getOrderDetail({orderId: queryForm.value.orderId})
        if (res.success && res.data != null) {
          order.value = res.data;
          let vehicleType = await findVehicleTypeByOrderId({orderId:queryForm.value.orderId});
          if (vehicleType.success){
            vehicleTypeData.value = vehicleType.data.map((item: { vehicleTypeName: string; vehicleTypeId: string }) => {
              return {label: item.vehicleTypeName, value: item.vehicleTypeId};
            });
          }
          console.log(res.data.orderBeginAddressLatitude);
          initMap(res.data.orderBeginAddressLongitude * 1e-6, res.data.orderBeginAddressLatitude * 1e-6);
        } else {
          message.error(res.message)
        }
        loading.value = false;
        setTimeout(() => {
          execute()
        }, 1000)
        timer = setInterval(() => {
          execute()
        }, 1000)
      } catch (err) {
        console.log(err);
        loading.value = false;
      }
    };

    const initMap = (lng: number, lat: number): Promise<boolean> => {
      return new Promise((resolve) => {
        const beginLng = lng;
        const beginEnd = lat;

        const {renderBaiduMap} = baiduMapRef.value;
        renderBaiduMap(beginLng, beginEnd);
        resolve(true);
      });
    };

    const handleSearch = async (query: string) => {
      if (queryForm.value.orderPlaceVehicleId === null) {
        return;
      }
      if (!query.length) {
        driverData.value = [];
        return;
      }
      selectLoading.value = true;
      try {
        let res = await findByDriverNoHeaderUnlock({
          driverNoHeader: query,
          operationCompanyId: order.value.operationCompanyId
        });
        driverData.value = res.data.map((item: { driverId: string; driverNo: string }) => {
          return {
            label: item.driverNo,
            value: item.driverId,
          };
        });
        selectLoading.value = false;
      } catch (err) {
        console.log(err);
        selectLoading.value = false;
      }
    };

    const handleSubmit = (e: MouseEvent) => {
      e.preventDefault();
      queryFormRef.value?.validate(async (errors) => {
        if (!errors) {
          loading.value = true;
          try {
            let userData = await getDetailViaLoginer();
            const {adminId} = userData.data;
            let data = await artificialDistributeOrder({
              orderId: queryForm.value.orderId,
              operationCompanyDriverId: queryForm.value.operationCompanyDriverId,
              loginCredentialId: adminId,
              loginPassword: md5(unref(queryForm).loginPassword)
            });
            if (data.success) {
              message.success("改派成功");
              setTimeout(function () {
                router.push({
                  path: "operate-order/serving",
                });
              }, 4000)
            } else {
              message.error(data.message)
            }

          } catch (err) {
            console.log(err);
            loading.value = false;
          }
        } else {
          message.error("验证未通过")
          console.log(errors);
        }
      });
    };
    const execute = async () => {
      driverPositionList.value = []
      let data;
      if (queryForm.value.orderPlaceVehicleId != null) {
        data = await refreshDriverPositionByVehicleTypeAndAreaCode({
          areaCode: order.value.areaCode,
          orderPlaceVehicleId: queryForm.value.orderPlaceVehicleId
        }) // 从服务端获取下单车型的最新的司机位置信息
      } else {
        // 从服务端获取默认最新的司机位置信息
        data = await refreshDriverPositionByAreaCode({
          areaCode: order.value.areaCode
        })
      }
      if (data.result) {
        driverPositionList.value = data.result
        const {removeOverlay, addMarker, updateMarker} = baiduMapRef.value;
        for (let index in driverPositionList.value) {
          let driverPosition = driverPositionList.value[index]
          if (driverPosition) {

            // 添加覆盖物
            if (!driverMarkerMap.get(driverPosition.operationCompanyDriverId)) {
              let marker = addMarker(driverPosition.longitude, driverPosition.latitude,
                (driverPosition.driverServiceState == 'DSS0001' ? freeIconImg : (driverPosition.driverServiceState == 'DSS0003' ? restIconImg : (driverPosition.driverServiceState == 'DSS0002' ? busyIconImg : offDutyIconImg))));
              marker.addEventListener("click", function (e: any) {
                openInfo(driverPosition.operationCompanyDriverId, e)
              })
              driverMarkerMap.set(driverPosition.operationCompanyDriverId, marker)

            }
            //调整覆盖物位置
            if (driverMarkerMap.get(driverPosition.operationCompanyDriverId)) {
              let marker = driverMarkerMap.get(driverPosition.operationCompanyDriverId)
              marker = updateMarker(marker, driverPosition.longitude, driverPosition.latitude, (driverPosition.driverServiceState == 'DSS0001' ? freeIconImg : (driverPosition.driverServiceState == 'DSS0003' ? restIconImg : (driverPosition.driverServiceState == 'DSS0002' ? busyIconImg : offDutyIconImg))))
            }
            //地图上有marker，位置列表中没有的司机要删除marker
            if (driverMarkerMap.size > 0) {
              driverMarkerMap.forEach(function (value, key) {
                let isContains = false
                if (driverPosition.operationCompanyDriverId == key) {
                  isContains = true
                  return false
                }
                if (!isContains) {
                  removeOverlay(value)
                  driverMarkerMap.delete(key)
                }
              })
            }
          }
        }
        // 如果没有查到司机位置信息删除所有maker
        if (!driverPositionList) {
          driverMarkerMap.forEach(function (value, key) {
            removeOverlay(value)
            driverMarkerMap.delete(key)
          })
        }
      }
    }
    const openInfo = async (driverId: string, e: any) => {
      let p = e.target;
      const {getPoint} = baiduMapRef.value;
      let point = getPoint(p.getPosition().lng, p.getPosition().lat);
      let content;
      forEach(driverPositionList.value, async function (driverPosition) {
        if (driverPosition && driverPosition.operationCompanyDriverId == driverId) {
          try {
            let data = await getDriverDetail({driverId: driverId});
            if (data.success) {
              content = "司机工号 : " + data.data.driverNo + "<br/>" +
                "司机姓名 : " + data.data.driverFullName + "<br/>" +
                "司机电话 : " + data.data.driverPhone + "<br/>" +
                "车牌号 : " + data.data.plateNumber + "<br/>" +
                "车辆类型 : " + data.data.vehicleTypeName;
              console.log(content)
              driverData.value = [{
                label: data.data.driverNo,
                value: data.data.operationCompanyDriverId,
              }];
              const {openInfoWindow, getInfoWindow} = baiduMapRef.value;
              let infoWindow = getInfoWindow(content, driverInfoOpts.value);  // 创建信息窗口对象
              openInfoWindow(infoWindow, point); //开启信息窗口
              queryForm.value.operationCompanyDriverId = driverId;
            }
            return false
          } catch (err) {
            console.log(err);
          }
        }
      })
    }
    return {
      loading,
      queryForm,
      queryFormRef,
      baiduMapRef,
      order,
      title, driverData,
      selectLoading,
      vehicleTypeData,
      handleSearch,
      handleSubmit,
      openInfo,
      rules: {
        operationCompanyDriverId: {required: true, trigger: ["blur", "change"], message: "请选择要改派的司机"},
        loginPassword: {required: true, message: "请输入密码", trigger: "blur"},
      },
      handleUpdateValue (value: string) {
        if (value){
          driverData.value = []
        }
      },
    };
  },
});
</script>
<style lang="scss" scoped>
.order-detail {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

.left {
  width: 520px;
  height: 100%;
  overflow-y: scroll;
}

.right {
  width: calc(100% - 520px - 15px);
  height: 100%;
  padding: 5px;
  background-color: $white;
  margin-left: 10px;
  box-sizing: border-box;
  overflow-y: scroll;

  .map {
    height: 100%;
  }
}
</style>
