<template>
  <v-card>
    <!-- 卡片标题和控制区 -->
    <template v-if="showHeader">
      <v-card-title class="d-flex align-center justify-space-between">
        <div>
          <v-icon start>mdi-bell</v-icon>
          我的通知
          <v-badge
            v-if="unreadCount > 0"
            :content="unreadCount"
            class="ml-2"
            color="error"
            inline
          ></v-badge>
        </div>
        <v-btn
          :disabled="!hasUnread"
          variant="text"
          @click="contentRef?.markAllAsRead"
        >
          标记全部已读
        </v-btn>
      </v-card-title>
      <v-divider></v-divider>
    </template>

    <!-- 选项卡 (仅在menuMode=true时显示) -->
    <template v-if="menuMode">
      <Suspense>
        <NotificationsCardContent
          ref="contentRef"
          :autoFetch="autoFetch"
          :maxHeight="'420px'"
          @update:unread-count="updateUnreadCount"
        />
        <template #fallback>
          <div class="d-flex justify-center align-center py-4">
            <v-progress-circular indeterminate></v-progress-circular>
          </div>
        </template>
      </Suspense>
    </template>

    <!-- 仅通知内容 (menuMode=false) -->
    <template v-else>
      <v-card-text>
        <Suspense>
          <NotificationsCardContent
            ref="contentRef"
            :autoFetch="autoFetch"
            :maxHeight="'auto'"
            :showPagination="showPagination"
            @update:unread-count="updateUnreadCount"
          />
          <template #fallback>
            <div class="d-flex justify-center align-center py-4">
              <v-progress-circular indeterminate></v-progress-circular>
            </div>
          </template>
        </Suspense>
      </v-card-text>
    </template>
  </v-card>
</template>

<script>
import {ref} from "vue";
import NotificationsCardContent from "./NotificationsCardContent.vue";

export default {
  name: "NotificationsCard",
  components: {
    NotificationsCardContent,
  },
  props: {
    autoFetch: {
      type: Boolean,
      default: true,
    },
    menuMode: {
      type: Boolean,
      default: false,
    },
    showHeader: {
      type: Boolean,
      default: true,
    },
    maxHeight: {
      type: String,
      default: "auto",
    },
    showPagination: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const activeTab = ref("notifications");
    const contentRef = ref(null);
    const unreadCount = ref(0);
    const hasUnread = ref(false);

    const updateUnreadCount = (count) => {
      unreadCount.value = count;
      hasUnread.value = count > 0;
    };

    const checkUnreadNotifications = () => {
      if (contentRef.value) {
        return contentRef.value.checkUnreadNotifications();
      }
      return 0;
    };

    const fetchNotifications = () => {
      if (contentRef.value) {
        contentRef.value.fetchNotifications();
      }
    };

    return {
      activeTab,
      contentRef,
      unreadCount,
      hasUnread,
      updateUnreadCount,
      checkUnreadNotifications,
      fetchNotifications,
    };
  },
};
</script>
