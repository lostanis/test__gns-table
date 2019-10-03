<template>
  <div class="table-item">
    <div class="card">
      <div class="row" v-for="(prop, index) in entries" :key="index">
        <div class="prop">{{ prop[0] }}:</div>
        <div class="val">{{ prop[1] }}</div>
      </div>
      <hr />
      <Button class="btn" type="primary" @click="() => $router.go(-1)">OK, go back</Button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { Button } from "element-ui";

export default {
  name: "TableItem",
  components: { Button },
  data() {
    return {
      itemId: this.$route.params.id
    };
  },
  computed: {
    ...mapGetters(["item"]),
    entries() {
      return Object.entries(this.item);
    }
  },
  async created() {
    await this.$store.dispatch("GET_ITEM_BY_ID", this.itemId);
  }
};
</script>

<style lang="scss">
.table-item {
  max-width: 800px;
  margin: 100px auto 0;
}
.card {
  padding: 24px;
  color: #333;
}
.row {
  display: flex;
  font-size: 20px;
  line-height: 1.7;
}
.prop {
  flex: 0 0 200px;
}
.val {
  font-weight: bold;
}
</style>