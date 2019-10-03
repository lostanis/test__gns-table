<template>
  <div class="wrapper">
    <Input v-model="search" size="mini" placeholder="Type to search" />

    <Table
      :data="db.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
      :default-sort="{prop: 'date', order: 'descending'}"
      show-summary
      sum-text="Total currency"
      style="width: 100%"
    >
      <TableColumn prop="id" label="ID" width="350">
        <template slot-scope="scope">
          <div class="input-cell" v-if="editableRowIndex === scope.$index">
            <Input
              v-model="editableRow.id"
              :class="{'is-error': !validation.id.isValid}"
              @blur="validateField(scope)"
            />
            <div :class="['input-msg', {'visible': !validation.id.isValid}]">{{ validation.id.msg }}</div>
          </div>
          <span v-else>{{ scope.row.id }}</span>
        </template>
      </TableColumn>
      <TableColumn prop="name" label="Name" sortable>
        <template slot-scope="scope">
          <div class="input-cell" v-if="editableRowIndex === scope.$index">
            <Input
              v-model="editableRow.name"
              :class="{'is-error': !validation.name.isValid}"
              @blur="validateField(scope)"
            />
            <div
              :class="['input-msg', {'visible': !validation.name.isValid}]"
            >{{ validation.name.msg }}</div>
          </div>
          <span v-else>{{ scope.row.name }}</span>
        </template>
      </TableColumn>
      <TableColumn prop="location" label="Location" sortable>
        <template slot-scope="scope">
          <div class="input-cell" v-if="editableRowIndex === scope.$index">
            <Input
              v-model="editableRow.location"
              :class="{'is-error': !validation.location.isValid}"
              @blur="validateField(scope)"
            />
            <div
              :class="['input-msg', {'visible': !validation.location.isValid}]"
            >{{ validation.location.msg }}</div>
          </div>
          <span v-else>{{ scope.row.location }}</span>
        </template>
      </TableColumn>
      <TableColumn prop="currency" label="Currency" sortable>
        <template slot-scope="scope">
          <div class="input-cell" v-if="editableRowIndex === scope.$index">
            <Input
              v-model.number="editableRow.currency"
              :class="{'is-error': !validation.currency.isValid}"
              @blur="validateField(scope)"
            />
            <div
              :class="['input-msg', {'visible': !validation.currency.isValid}]"
            >{{ validation.currency.msg }}</div>
          </div>
          <span v-else>{{ scope.row.currency }}</span>
        </template>
      </TableColumn>
      <TableColumn label="Actions" align="right" width="220">
        <template slot-scope="scope">
          <Button
            type="success"
            size="mini"
            v-if="editableRowIndex === scope.$index"
            @click="handleSave(scope.$index, scope.row)"
            @keyup.enter="handleSave(scope.$index, scope.row)"
          >Save changes</Button>
          <Button
            v-else
            size="mini"
            type="primary"
            @click="handleEdit(scope.$index, scope.row)"
          >Edit</Button>
          <Button
            v-if="editableRowIndex === scope.$index"
            size="mini"
            type="danger"
            @click="handleDiscardChanges(scope.$index, scope.row)"
          >Cancel</Button>
          <Button
            v-else
            size="mini"
            type="warning"
            @click="() => $router.push({name: 'TableItem', params: {id: scope.row.id}})"
          >Show more</Button>
        </template>
      </TableColumn>
    </Table>
  </div>
</template>

<script>
import { Table, TableColumn, Input, Button, Message } from "element-ui";
import { mapGetters } from "vuex";

export default {
  name: "Home",
  components: { Table, TableColumn, Input, Button, Message },
  data() {
    return {
      search: "",
      editableRowIndex: null,
      editableRow: {},
      validation: {
        id: {
          isValid: true,
          msg: "test"
        },
        name: {
          isValid: true,
          msg: "test"
        },
        location: {
          isValid: true,
          msg: "test"
        },
        currency: {
          isValid: true,
          msg: "test"
        }
      }
    };
  },
  methods: {
    handleEdit(index, row) {
      this.validationReset();
      this.editableRowIndex = index;
      this.editableRow = { ...row };
    },
    handleSave(index, row) {
      if (Object.values(this.validation).some(item => !item.isValid)) {
        return this.$message.error("You got some invalid field");
      }
      let db = this.db.slice();
      db[index] = this.editableRow;
      this.$store.dispatch("CHANGE_DB", db);
      this.editableRow = {};
      this.editableRowIndex = null;
      this.$message.success("New data saved!");
    },
    handleDiscardChanges(index, row) {
      this.editableRowIndex = null;
      this.validationReset();
    },
    validateField({ column, row }) {
      const prop = column.property;
      if (!this.editableRow[prop].toString().length) {
        this.validation[prop].isValid = false;
        this.validation[prop].msg = "This field is required";
        return;
      }
      if (prop === "id" && this.editableRow.id.length !== 36) {
        this.validation[prop].isValid = false;
        this.validation[prop].msg = "36 chars must be here";
        return;
      }
      this.validation[prop].isValid = true;
    },
    validationReset() {
      const validation = {};
      for (let prop in this.validation) {
        validation[prop] = { isValid: true, msg: "" };
      }
      this.validation = validation;
    }
  },
  computed: {
    ...mapGetters(["db"])
  },
  created() {
    this.$store.dispatch("GET_DB");
  }
};
</script>

<style lang="scss">
.wrapper {
  max-width: 1140px;
  margin: 50px auto;
}
.el-input.is-error .el-input__inner {
  border: 1px solid tomato;
}
.input-msg {
  color: tomato;
  font-size: 11px;
  padding: 0 16px;
  display: none;
  &.visible {
    display: block;
  }
}
.wrapper .el-table td {
  vertical-align: top;
}
</style>
