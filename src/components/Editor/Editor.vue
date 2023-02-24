<template>
  <div style="border: 1px solid #ccc" class="w-1000px">
    <Toolbar
      style="border-bottom: 1px solid #ccc"
      :editor="editorRef"
      :defaultConfig="toolbarConfig"
      mode="default"
    />
    <Editor
      style="height: 500px; overflow-y: hidden"
      v-model="valueHtml"
      :defaultConfig="editorConfig"
      mode="default"
      @onCreated="handleCreated"
      @onChange="handleChange"
    />
  </div>
</template>
<script lang="ts" setup>
import { onBeforeUnmount, ref, shallowRef } from "vue";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import { IDomEditor } from "@wangeditor/editor";
import "@wangeditor/editor/dist/css/style.css"; // 引入 css
// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef();
const emit = defineEmits(["update:value"]);
// 内容 HTML
const valueHtml = ref("");

// // 模拟 ajax 异步获取内容
// onMounted(() => {
//     setTimeout(() => {
//         valueHtml.value = ""
//     }, 1500)
// })

const toolbarConfig = {
  toolbarKeys: [
    "bold",
    "underline",
    "italic",
    "through",
    "code",
    "sub",
    "sup",
    "clearStyle",
    "color",
    "bgColor",
    "fontSize",
    "fontFamily",
    "indent",
    "delIndent",
    "justifyLeft",
    "justifyRight",
    "justifyCenter",
    "justifyJustify",
    "lineHeight",
    "divider",
    "insertLink",
    "codeBlock",
    "blockquote",
    "headerSelect",
    "header1",
    "header2",
    "header3",
    "header4",
    "header5",
    "todo",
    "redo",
    "undo",
    "fullScreen",
    "enter",
    "bulletedList",
    "numberedList",
  ],
};
const editorConfig = { placeholder: "请输入内容..." };

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});

const handleCreated = (editor: IDomEditor) => {
  editorRef.value = editor; // 记录 editor 实例，重要！
};

const handleChange = (editor: IDomEditor) => {
  emit("update:value", editor.getHtml());
};

defineExpose({
  valueHtml,
});
</script>
