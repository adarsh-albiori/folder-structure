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
              v-model="EditItem.value"
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
import { ref, reactive, defineProps, onBeforeMount } from "vue";
import TreeStyle from "./TreeStyle.vue";
import axios from "axios";

defineProps(["children", "value"]);
const card = ref(false);
const ind = ref(null);
const isValid = ref(null);

let Data = ref([]);

let fieldRules = reactive([
  (value) => {
    if (value) return true;
    return "This field is required";
  },
]);

onBeforeMount(() => {
  fetchData();
});

const fetchData = async () => {
  try {
    const response = await axios.get(
      "https://folder-structure-api.onrender.com/"
    );
    Data.value = response.data;
  } catch (error) {
    throw new Error("Error fetching data:", error);
  }
};

const EditItem = ref({
  value: "",
});

const DefaultItem = {
  value: "",
};

function handleIndex(i) {
  ind.value = i;
}

async function save() {
  const apiUrl = "https://folder-structure-api.onrender.com/initialize-root";
  const requestData = { ...EditItem.value };
  EditItem.value = { ...DefaultItem };
  card.value = false;
  try {
    const response = await axios.post(apiUrl, requestData);

    Data.value = response.data;
    return response.data;
  } catch (error) {
    throw new Error("Failed to initialize root folder.", error);
  }
}

function close() {
  card.value = false;
}

async function handleSave(data) {
  const apiUrl = "https://folder-structure-api.onrender.com/";
  const requestData = { ...data.item };

  try {
    const response = await axios.post(apiUrl, requestData);
    Data.value = response.data;
    return response.data;
  } catch (error) {
    throw new Error("Failed to initialize root folder.");
  }
}

function handleRemove(id) {
  deleteChildRecursively(Data.value, id);
}

async function deleteChildRecursively(children, targetChild) {
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    if (child === targetChild) {
      try {
        const response = await axios.delete(
          `https://folder-structure-api.onrender.com/${child._id}`
        );
        Data.value = response.data;
      } catch (error) {
        throw new Error("Error deleting data:", error);
      }
      return;
    }
    if (child.children) {
      deleteChildRecursively(child.children, targetChild);
    }
  }
}

function addFolder() {
  card.value = true;
  EditItem.value.children = [];
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
}
.tree-item:before {
  position: absolute;
  top: 15px;
  left: 0;
  width: 10px;
  height: 2px;
  margin: auto;
  content: "";
  background-color: #000000;
}

.tree-item:after {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 2px;
  height: 100%;
  content: "";
  background-color: #666;
}

.tree-item:last-child:after {
  height: 15px;
}

.tree-item {
  margin-left: 40px;
}
</style>
