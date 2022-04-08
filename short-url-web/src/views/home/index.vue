<template>
  <div
    :style="{ backgroundImage: `url(${imageUrl})` }"
    class="home-container flex items-center justify-center"
  >
    <div
      class="bg-white bg-opacity-60 rounded-0 md:rounded-lg w-full md:w-110 pl-8 pr-10 pt-10 py-4"
    >
      <a-form
        ref="formRef"
        :model="formData"
        name="basic"
        autocomplete="off"
        label-width="100px"
        :label-col="{ style: { width: '110px' } }"
        @finish="onFinish"
      >
        <a-form-item
          label="Url"
          name="url"
          :rules="[
            { required: true, message: 'Please input url' },
            { validator: validateUrl, trigger: 'change' },
          ]"
        >
          <a-input v-model:value="formData.url" />
        </a-form-item>

        <a-form-item label="Custom" name="custom">
          <a-input v-model:value="formData.custom" />
        </a-form-item>

        <a-form-item label="Expiration" name="expire">
          <a-date-picker
            v-model="formData.expire"
            show-time
            type="date"
            placeholder="Expiration time"
          />
        </a-form-item>

        <a-form-item label="limit" name="limit">
          <a-input-number v-model="formData.limit" :min="0" placeholder="maximum number of calls" />
        </a-form-item>

        <a-form-item class="mt-10">
          <a-button :loading="loading" type="primary" class="w-full" html-type="submit">
            Create
          </a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { Button, notification } from 'ant-design-vue';
  import { FormInstance, Rule } from 'ant-design-vue/lib/form';
  import { h, onMounted, reactive, ref } from 'vue';
  import { get, post } from '/@/utils/request';
  import { isUrl } from '/@/utils/validate';

  const loading = ref(false);
  const imageUrl = ref('');
  const formRef = ref<FormInstance>();

  const formData = reactive({
    url: '',
    custom: '',
    limit: '',
    expire: '',
  });

  const validateUrl = (_rule: Rule, value: string) => {
    if (!value) {
      return Promise.reject('');
    } else {
      if (isUrl(value)) {
        return Promise.resolve();
      } else {
        return Promise.reject('Incorrect url format');
      }
    }
  };

  const onFinish = async (values: any) => {
    loading.value = true;
    const data = await post({
      data: values,
    });
    if (!data) return;

    formRef.value?.resetFields();
    successNotify(data.url);
    loading.value = false;
  };

  const successNotify = (url: string) => {
    const key = `open${Date.now()}`;
    notification.open({
      message: 'created',
      description: url,
      btn: () =>
        h(
          Button,
          {
            type: 'primary',
            size: 'small',
            onClick: () => {
              copy(url);
              notification.close(key);
            },
          },
          { default: () => 'copy' },
        ),
      key,
      onClose: close,
    });
  };

  const copy = (content: string) => {
    var aux = document.createElement('input');
    aux.setAttribute('value', content);
    document.body.appendChild(aux);
    aux.select();
    document.execCommand('copy');
    document.body.removeChild(aux);
  };

  onMounted(() => {
    loadImage();
  });

  const loadImage = async () => {
    const data = await get({
      url: 'bing',
    });
    if (!data) return;

    imageUrl.value = 'https://bing.com' + data.url;
  };
</script>

<style lang="less">
  .home-container {
    width: 100%;
    height: 100%;
  }
</style>
