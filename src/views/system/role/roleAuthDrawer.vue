<template>
  <BasicDrawer v-model:show="isDrawer" title="角色赋权" @on-close-after="onCloseAfter">
    <div class="auth-to-role">
      <p class="role pt-10px pb-10px">角色名称:{{ name }}</p>
    </div>

    <div class="">
      <n-checkbox-group v-model:value="authData">
        <n-space item-style="display: flex;">
          <n-checkbox
            :value="item.authorityId"
            v-for="item in authData"
            :key="item.authorityId"
            class="pt-10px pb-10px pl-10px"
            :label="item.code"
          />
        </n-space>
      </n-checkbox-group>
    </div>

    <n-button attr-type="button" :loading="loading" type="primary" @click="handleValidate"
      >保存
    </n-button>
  </BasicDrawer>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, onMounted, ref } from "vue";
import { useMessage } from "naive-ui";
import { RoleAuthFormInter } from "./type";
import { grantToRole, listViaRole, getLoginerAuth } from "@/api/system/system";
import loading from "naive-ui/lib/_internal/loading";
export default defineComponent({
  name: "RoleAuthDrawer",
  setup(_, { emit }) {
    const state = reactive({
      isDrawer: false,
      loading: false,
      disabled: false,
    });
    const message = useMessage();
    const name = ref();
    interface AuthInter {
      code: string;
      authorityId: string;
    }
    const data = ref<AuthInter[]>([]);
    const authData = ref<AuthInter[]>([]);

    const form = ref<RoleAuthFormInter>({
      roleId: null,
      authorityIdList: [],
    });

    function openDrawer(roleId: string, value: string) {
      if (roleId) {
        getRoleAuthDetail(roleId);
      }
      name.value = value;
      state.isDrawer = true;
    }
    onMounted(() => {
      getCurrentAuthData();
    });

    const getCurrentAuthData = async () => {
      try {
        loading.value = true;
        let res = await getLoginerAuth();
        // console.log(res.data.authorityList);
        authData.value = res.data.authorityList;
        // console.log(authData.value);

        loading.value = false;
      } catch (err) {
        console.log(err);
        loading.value = false;
      }
    };

    const getRoleAuthDetail = async (roleId: string) => {
      try {
        let res = await listViaRole({ roleId });

        form.value.roleId = res.data.roleId;
        form.value.authorityIdList = res.data.grantAuthorityList;
      } catch (err) {
        console.log(err);
        state.loading = false;
      }
    };

    async function handleValidate(e: MouseEvent) {
      e.preventDefault();
      try {
        const { roleId, authorityIdList } = form.value;
        let option = { roleId, authorityIdList };
        let res = await grantToRole(option);
        // if (!form.value.roleId) {

        //     console.log(res);
        // } else {
        //     res = await editRole({ roleId, ...option });
        // }
        state.loading = false;
        message.success(window.$tips[res.code]);
        handleSaveAfter();
      } catch (err) {
        console.log(err);
        state.loading = false;
      }
    }

    function handleSaveAfter() {
      authData.value = [];
      emit("on-save-after");
    }

    function handleReset() {}
    function onCloseAfter() {
      state.isDrawer = false;
      state.loading = false;
      state.disabled = false;
      handleReset();
    }

    return {
      ...toRefs(state),
      name,
      authData,
      data,
      openDrawer,
      handleReset,
      handleSaveAfter,
      onCloseAfter,
      handleValidate,
    };
  },
});
</script>
<style lang="scss">
.role {
  font-weight: 500;
  font-size: 16px;
}
</style>
