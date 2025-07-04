<template>
  <v-container fluid>
    <v-card>
      <v-card-title class="d-flex align-center">
        <span>系统配置</span>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="searchQuery"
          prepend-icon="mdi-magnify"
          label="搜索配置项"
          placeholder="输入名称或键名搜索"
          hide-details
          class="mr-4"
          style="max-width: 300px"
          density="compact"
          variant="outlined"
          clearable
        ></v-text-field>
        <v-btn variant="tonal" @click="reload" prepend-icon="mdi-reload" class="mr-2"> 重载配置 </v-btn>
        <v-btn
          color="primary"
          @click="loadConfigs"
          :loading="loading"
          prepend-icon="mdi-refresh"
        >
          刷新
        </v-btn>
      </v-card-title>

      <v-card-text>
        <config-item-group
          :configs="filteredConfigs"
          @save-error="handleSaveError"
        />
      </v-card-text>
    </v-card>

    <!-- 保存错误提示 -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="3000"
    >
      {{ snackbar.text }}
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import ConfigItemGroup from '@/components/admin/ConfigItemGroup.vue'
import axios from '@/axios/axios'

// 状态变量
const loading = ref(false)
const configs = ref([])
const searchQuery = ref('')

const snackbar = ref({
  show: false,
  text: '',
  color: 'success'
})

// 过滤后的配置项
const filteredConfigs = computed(() => {
  if (!searchQuery.value) return configs.value

  const query = searchQuery.value.toLowerCase()
  return configs.value.filter(config =>
    config.key.toLowerCase().includes(query) ||
    (config.description && config.description.toLowerCase().includes(query))
  )
})

// 方法
const loadConfigs = async () => {
  loading.value = true
  try {
    const unified = await axios.get('/admin/config/unified')
    if (unified.status === 200) {
      configs.value = unified.data.configs
    }
  } catch (error) {
    showError('加载配置失败')
  }
  loading.value = false
}

const handleSaveError = (key) => {
  const config = configs.value.find(c => c.key === key)
  showError(`保存 ${config?.description || key} 失败`)
}

const showSuccess = (text) => {
  snackbar.value = {
    show: true,
    text,
    color: 'success'
  }
}

const showError = (text) => {
  snackbar.value = {
    show: true,
    text,
    color: 'error'
  }
}

const reload = () => {
  axios.get('/api/admin/config/reload').then(res => {
    if (res.status === 200) {
      showSuccess('重载配置成功')
    }
  })
}

// 生命周期
onMounted(() => {
  loadConfigs()
})
</script>

<style scoped>
.v-card {
  margin-bottom: 24px;
}
</style>
