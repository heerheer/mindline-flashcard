<template>
  <q-page class="column q-pa-md q-gutter-y-md">


    <q-card style="width: 100%;"  v-for="item in mlList" :key="item.name">
      <q-card-section class="bg-primary text-white ">
        <div class="text-h6 ellipsis">{{ item.name }}</div>
        <div class="text-subtitle2">{{ item.raw }}</div>
      </q-card-section>
      <q-separator/>
      <q-card-actions align="right">
        <q-btn flat color="primary" label="更新文件"/>
        <q-btn color="primary" text-color="white" label="继续复习"
               :to="{ path: '/detail',query: { proj:item.name } }"
        />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">

import {onMounted, ref} from 'vue';
import {useQuasar} from 'quasar';
import {MindLineProj} from 'components/models';
import Application from 'src/Application';
import MindLineCloudUtil from 'src/utils/MindLineCloudUtil';
/*import {ProjList} from 'src/Application';

const mlList = ProjList;*/

const $q = useQuasar();

const mlList = ref<MindLineProj[]>([])


onMounted(async () => {
  $q.loadingBar.start();
  const cloud = new MindLineCloudUtil()
  await cloud.login('13812534080','heershisb123')
  //let raw = await (await fetch('/list.json')).json();
  //mlList.value = raw;
  //Application.ProjList = raw;
  //$q.loadingBar.stop();
})

</script>
