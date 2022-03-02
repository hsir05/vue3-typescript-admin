<template>
<n-layout-content >
    <RouterView />
</n-layout-content>
</template>
<script lang="ts" setup></script>
<style lang="scss">
.n-layout-content {
    padding: 24px;
    height: calc(100vh - 115px);
    background-color: #e5e7eb;
}
</style>