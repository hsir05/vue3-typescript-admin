<template>
  <div class="test">主页</div>
  <n-button>naive-ui</n-button>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { useAppStore } from "@/store/modules/useAppStore";

export default defineComponent({
  name: "Welcome",
  components: {},
  setup() {
    const appStore = useAppStore();
    console.log(appStore.getIsCache);

    return {};
  },
});
</script>
<style lang="scss">
.test {
  color: $test-color;
}
</style>
