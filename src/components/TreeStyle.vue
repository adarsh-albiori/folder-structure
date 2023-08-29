<template>
  <div class="tree-item">
    <div>
      <div
        class="d-flex justify-left align-left"
        v-on:mouseleave="mouseleave()"
      >
        <v-icon v-if="props.item.title">
          {{
            props.item.type === "file"
              ? "mdi-file-outline"
              : "mdi-folder-open-outline"
          }}</v-icon
        >
        <div v-on:mouseover="mouseover()">
          {{ props.item.title }}
        </div>

        <div class="d-flex" v-if="mutations">
          <v-btn
            v-if="item.type === 'folder'"
            icon="mdi-plus-circle-outline"
            variant="flat"
            density="compact"
            @click="add(props.index)"
          >
          </v-btn>
          <v-btn
            icon="mdi-minus-circle-outline"
            variant="flat"
            density="compact"
            @click="deleteNode(props.item)"
          >
          </v-btn>
        </div>
      </div>
      <div class="d-flex justify-left align-left tree-item" v-if="buttons">
        <v-btn density="compact" color="black" @click="showFileBox">File</v-btn>
        <v-btn density="compact" color="black" @click="showFolderBox"
          >Folder</v-btn
        >
      </div>

      <div v-if="show" class="tree-item">
        <v-card color="black" variant="outlined" width="300" height="110">
          <v-icon class="ml-1">
            {{
              type === "file" ? "mdi-file-outline" : "mdi-folder-open-outline"
            }}</v-icon
          >

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
                @click="save({ ...item })"
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
    </div>

    <div>
      <template v-if="props.item.nodes?.length">
        <TreeStyle
          class="tree"
          v-for="(node, nodeIndex) in props.item.nodes"
          :key="nodeIndex"
          :item="node"
          @finalData="handleSave"
          @delete="handleRemove"
        />
      </template>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive, defineProps, defineEmits } from "vue";
const show = ref(false);
const buttons = ref(false);
const mutations = ref(false);
const props = defineProps(["item", "index"]);
const emits = defineEmits(["finalData", "delete", "index"]);
const type = ref(null);
const item = ref(props.item);

const isValid = ref(null);
let fieldRules = reactive([
  (value) => {
    if (value) return true;
    return "This field is required";
  },
]);
const EditItem = ref({
  id: Date.now() + Math.random(),
  title: "",
  type: null,
});
const DefaultItem = {
  id: Date.now() + Math.random(),
  title: "",
  type: null,
};
function showFileBox() {
  type.value = "file";
  buttons.value = false;
  show.value = true;
}
function showFolderBox() {
  type.value = "folder";
  buttons.value = false;
  show.value = true;
}
function handleSave(data) {
  emits("finalData", data);
}
function handleRemove(data) {
  deleteNodeRecursively(item.value.nodes, data);
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
  emits("delete", targetNode);
}
function save(val) {
  if (type.value === "file") {
    EditItem.value.type = "file";
    emits("finalData", { data: val, item: { ...EditItem.value } });
    EditItem.value = { ...DefaultItem };
    show.value = false;
  } else if (type.value === "folder") {
    EditItem.value.type = "folder";
    EditItem.value.nodes = [];
    emits("finalData", { data: val, item: { ...EditItem.value } });
    EditItem.value = { ...DefaultItem };
    show.value = false;
  }
}
function deleteNode(item) {
  emits("delete", item);
}

function add(i) {
  emits("index", i);
  buttons.value = !buttons.value;
}
function close() {
  show.value = false;
}

function mouseover() {
  mutations.value = true;
}
function mouseleave() {
  mutations.value = false;
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
.filebox {
  width: 20px;
}
</style>
