<template>
  <BasicDrawer :isDrawer="isDrawer" @open-drawer="openDrawer">
    <div class="">1312313123</div>
  </BasicDrawer>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import BasicDrawer from "@/components/BasicDrawer/BasicDrawer.vue";
export default defineComponent({
  name: "",
  components: { BasicDrawer },
  setup() {
    const isDrawer = ref(false);
    function openDrawer() {
      console.log(2222);
      isDrawer.value = true;
    }

    return {
      isDrawer,

      openDrawer,
    };
  },
});
</script>
