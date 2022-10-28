<template>
  <q-page>
    <q-ajax-bar
      ref="bar"
      position="top"
      color="accent"
      size="10px"
      skip-hijack
    />

    <div class="q-pa-md q-gutter-sm">
      <q-breadcrumbs>
        <q-breadcrumbs-el icon="home" to="/"/>
        <q-breadcrumbs-el :label="name" icon="widgets"/>
      </q-breadcrumbs>
    </div>

    <div class="q-pa-md q-gutter-md">
      <q-list padding>
        <q-item-label header>主题</q-item-label>

        <template v-for="subject in collection.subjects" :key="subject.title">
          <q-item clickable v-ripple :to='{path:"/cards",query:{proj:name,subject:subject.title}}'>
            <q-item-section avatar top>
              <q-avatar icon="catching_pokemon" color="primary" text-color="white"/>
            </q-item-section>

            <q-item-section>
              <q-item-label lines="1">{{ subject.title }}</q-item-label>
              <q-item-label caption>{{ subject.remark ?? '似乎没有填写备注...' }}</q-item-label>
            </q-item-section>

            <q-item-section side>
              <q-icon name="info" color="green"/>
            </q-item-section>
          </q-item>

        </template>


        <q-separator spaced/>

        <!--
                <q-item clickable v-ripple>
                  <q-item-section avatar top>
                    <q-avatar icon="assignment" color="grey" text-color="white"/>
                  </q-item-section>

                  <q-item-section>
                    <q-item-label lines="1">Expenses spreadsheet</q-item-label>
                    <q-item-label caption>March 2nd, 2019</q-item-label>
                  </q-item-section>

                  <q-item-section side>
                    <q-icon name="info"/>
                  </q-item-section>
                </q-item>

                <q-item clickable v-ripple>
                  <q-item-section avatar top>
                    <q-avatar icon="place" color="grey" text-color="white"/>
                  </q-item-section>

                  <q-item-section>
                    <q-item-label lines="1">Places to visit</q-item-label>
                    <q-item-label caption>February 22, 2019</q-item-label>
                  </q-item-section>

                  <q-item-section side>
                    <q-icon name="info" color="amber"/>
                  </q-item-section>
                </q-item>

                <q-item clickable v-ripple>
                  <q-item-section avatar top>
                    <q-avatar icon="library_music" color="grey" text-color="white"/>
                  </q-item-section>

                  <q-item-section>
                    <q-item-label lines="1">My favorite song</q-item-label>
                    <q-item-label caption>Singing it all day</q-item-label>
                  </q-item-section>

                  <q-item-section side>
                    <q-icon name="info"/>
                  </q-item-section>
                </q-item>-->
      </q-list>
    </div>

  </q-page>
</template>

<script setup lang="ts">
import {QAjaxBar} from 'quasar'
import {useRouter} from 'vue-router';
import {onMounted, ref} from 'vue';
import {MindLineSubjectCollection} from 'components/models';
import {LoadSubjectCollection} from 'src/utils/MindLineLoader';
import Application from 'src/Application';

const bar = ref(null)
const name = ref('')
const collection = ref<MindLineSubjectCollection>({subjects: []})

onMounted(async () => {
  name.value = useRouter().currentRoute.value.query.proj as string;
  const barRef: QAjaxBar = bar.value!
  barRef.start()

  barRef.increment(20)

  collection.value = await LoadSubjectCollection(Application.ProjList.find(x => x.name == name.value)!.raw)
  collection.value.name = name.value;

  barRef.stop();

})


</script>

<style scoped>

</style>
