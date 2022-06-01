<template>
  <n-loading-bar-provider>
    <n-dialog-provider>
      <n-notification-provider>
        <n-message-provider>
          <MessageContent />
          <slot></slot>
        </n-message-provider>
      </n-notification-provider>
    </n-dialog-provider>
  </n-loading-bar-provider>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { MessageContent } from "@/components/MessageContent/index";

import {
  NDialogProvider,
  NNotificationProvider,
  NMessageProvider,
  NLoadingBarProvider,
} from "naive-ui";
export default defineComponent({
  name: "Application",
  components: {
    NDialogProvider,
    MessageContent,
    NNotificationProvider,
    NMessageProvider,
    NLoadingBarProvider,
  },
  setup() {
    return {};
  },
});
</script>
