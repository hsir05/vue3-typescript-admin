<script lang="tsx">
import { defineComponent, h, ref } from "vue";
import { NInput } from "naive-ui";
export default defineComponent({
  name: "ShowOrEdit",
  props: {
    value: {
      type: [String, Number],
      default: null,
    },
    onUpdateValue: {
      type: Function,
      default: () => {},
    },
  },
  setup(props) {
    const isEdit = ref(false);
    const inputRef = ref(null);
    const inputValue = ref(props.value);
    function handleOnClick() {
      isEdit.value = true;
      //   nextTick(() => {
      //      inputRef.value?.focus()
      //   })
    }
    function handleChange() {
      props.onUpdateValue(inputValue.value);
      isEdit.value = false;
    }
    return () =>
      h(
        "div",
        {
          onClick: handleOnClick,
        },
        isEdit.value
          ? h(NInput as any, {
              ref: inputRef,
              value: inputValue.value,
              onUpdateValue: (v: string) => {
                inputValue.value = v;
              },
              onChange: handleChange,
              onBlur: handleChange,
            })
          : props.value
      );
  },
});
</script>
