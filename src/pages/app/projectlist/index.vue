<template>
  <ProjectListsView/>
</template>

<script>
import ProjectListsView from "@/components/projectlist/ProjectListsView.vue";
import {localuser} from "@/services/localAccount";
import {useHead} from "@unhead/vue";

export default {
  components: {ProjectListsView},
  async created() {
    if (localuser.isLogin.value === false) {
      this.$router.push("/app/account/login");
    }
  },
  data() {
    return {
      localuser: localuser,
    };
  },
  name: "projectlist",
  setup() {
    useHead({
      title: "我的项目列表",
    });
  },
};
</script>
