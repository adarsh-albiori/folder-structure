<template>
  <v-btn color="black" size="small" @click="addFolder" class="ml-4"
    >Add folder to root</v-btn
  >
  <div v-if="card" class="tree-item">
    <v-card color="black" variant="outlined" width="300" height="110">
      <v-icon class="mt-2"> mdi-folder-open-outline</v-icon>
      <v-row align="center" justify="center">
        <v-col cols="10" md="8">
          <v-form ref="form" v-model="isValid">
            <v-text-field
              :rules="fieldRules"
              density="compact"
              v-model="EditItem.title"
              class="mt-2"
              variant="outlined"
              label="Folder Name"
            ></v-text-field>
          </v-form>
        </v-col>
        <v-col cols="10" md="3">
          <v-btn
            icon="mdi-check-circle-outline"
            variant="flat"
            :disabled="!isValid"
            density="compact"
            @click="save"
          >
          </v-btn>
          <v-btn
            icon="mdi-close-circle-outline"
            variant="flat"
            density="compact"
            @click="close"
          >
          </v-btn>
        </v-col>
      </v-row>
    </v-card>
  </div>

  <TreeStyle
    v-for="(item, itemIndex) in Data"
    :item="item"
    :index="itemIndex"
    :key="item"
    @index="handleIndex"
    @finalData="handleSave"
    @delete="handleRemove"
  />
</template>

<script setup>
import { ref, reactive, defineProps } from "vue";
import TreeStyle from "./TreeStyle.vue";

defineProps(["nodes", "title"]);
const card = ref(false);
const ind = ref(null);
const isValid = ref(null);

let Data = reactive([]);
let fieldRules = reactive([
  (value) => {
    if (value) return true;
    return "This field is required";
  },
]);
const EditItem = ref({
  id: Date.now() + Math.random(),
  title: "",
  type: "folder",
  nodes: [],
});
const DefaultItem = {
  id: Date.now() + Math.random(),
  title: "",
  type: "folder",
  nodes: [],
};
function handleIndex(i) {
  ind.value = i;
}
function save() {
  Data.push({ ...EditItem.value });
  EditItem.value = { ...DefaultItem };
  card.value = false;
}

function close() {
  card.value = false;
}

function handleSave(data) {
  data.data.nodes.push({ ...data.item });
}

function handleRemove(id) {
  deleteNodeRecursively(Data, id);
}
function deleteNodeRecursively(nodes, targetNode) {
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (node === targetNode) {
      nodes.splice(i, 1);
      return;
    }
    if (node.nodes) {
      deleteNodeRecursively(node.nodes, targetNode);
    }
  }
}

function addFolder() {
  card.value = true;
  EditItem.value.nodes = [];
}
</script>
<style scoped>
.tree-item {
  position: relative;
  padding-top: 5px;
  padding-bottom: 5px;
  padding-left: 15px;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;

  &:before {
    position: absolute;
    top: 15px;
    left: 0;
    width: 10px;
    height: 2px;
    margin: auto;
    content: "";
    background-color: #000000;
  }

  &:after {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 2px;
    height: 100%;
    content: "";
    background-color: #666;
  }

  &:last-child:after {
    height: 15px;
  }
}
.tree-item {
  margin-left: 40px;
}
</style>
