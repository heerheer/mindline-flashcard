<template>
  <q-page>
    <q-ajax-bar
      ref="bar"
      position="top"
      color="accent"
      size="10px"
      skip-hijack
    />

    <!--页面布局-->
    <div class="q-pa-md q-gutter-sm">
      <q-breadcrumbs>
        <q-breadcrumbs-el icon="home" to="/"/>
        <q-breadcrumbs-el :label="info.proj" icon="widgets"
                          :to="{ path: '/detail',query: { proj:info.proj } }"/>
        <q-breadcrumbs-el :label="info.subject" icon="whatshot"/>
      </q-breadcrumbs>
    </div>

    <q-tabs
      v-model="tab"
      dense
      class="text-grey"
      active-color="primary"
      indicator-color="primary"
      align="justify"
      narrow-indicator
    >
      <q-tab name="card" label="卡片"/>
      <q-tab name="list" label="列表"/>
    </q-tabs>

    <q-separator/>

    <q-tab-panels v-model="tab" animated>
      <!--以卡片示-->
      <q-tab-panel name="card">
        <div class=" full-height column q-gutter-y-md">
          <q-card class="q-layout-padding">
            <div class="text-h6">Topic</div>

            <q-separator/>
            <q-breadcrumbs>
              <q-breadcrumbs-el disable v-for="p in currentCard.parents" :label="p.text" :key="p.text"/>
            </q-breadcrumbs>
            <div class="text-h6">{{ currentCard.text }}</div>
          </q-card>

          <q-card v-if="currentCard.remark!==''" class="q-layout-padding">
            <div class="text-h6">Remark</div>
            <q-separator/>
            {{ currentCard.remark }}
          </q-card>

          <q-card class="q-layout-padding" v-if="currentCard.options.length>0">
            <div class="text-h6">Options</div>
            <q-separator/>
            <div style="position: relative;height: 100%">
              <q-list bordered separator>
                <q-item clickable v-ripple v-for="opt in currentCard.options" :key="opt.cid">
                  <q-item-section>
                    <q-item-label>{{ opt.text }}</q-item-label>
                    <q-item-label caption v-show="opt.remark!==''">{{ opt.remark }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
              <!--遮盖的div-->
              <div class="mask"
                   ref="opinionMask"
                   @click="maskClick($event)">
                <div>

                </div>
                <div class="flex justify-center absolute-center">
                  <div>点击查看</div>
                </div>
              </div>

            </div>

          </q-card>

          <!--按钮区域-->
          <div class="row q-col-gutter-x-md">
            <div class="col-6">
              <q-btn class="full-width" color="red" icon="tips_and_updates" label="忘记"/>
            </div>
            <div class="col-6">
              <q-btn
                class="full-width" color="primary" icon="done" label="熟悉"
                @click="rememberClick"
              />
            </div>
          </div>
        </div>


      </q-tab-panel>

      <!--以列表显示-->
      <q-tab-panel name="list">
        <q-list separator>
          <q-item clickable v-ripple v-for="card in cards" :key="card.cid" @click="currentCard=card;tab='card'">
            <q-item-section>
              <q-item-label>{{ card.text }}</q-item-label>
              <q-item-label caption>{{ card.remark }}</q-item-label>
              <q-item-label caption v-for="opt in card.options" :key="opt.cid">{{ opt.text }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-tab-panel>
    </q-tab-panels>


  </q-page>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue';
import {useRouter} from 'vue-router';
import {QAjaxBar} from 'quasar';
import {LoadSubjectCollection, GetNodesAsCard} from 'src/utils/MindLineLoader';
import {Card, MindLineSubjectCollection} from 'components/models';
import Application from 'src/Application';

type infoMeta = { subject?: string, proj?: string }

const bar = ref(null)
const opinionMask = ref(null)
const info = ref<infoMeta>({})
const collection = ref<MindLineSubjectCollection>({subjects: []})
const tab = ref('card')
const cards = ref<Card[]>([])
const currentCard = ref<Card>({text: '', remark: '', cid: '', options: [], parents: []})

onMounted(async () => {
  info.value = useRouter().currentRoute.value.query as infoMeta;
  const raw = Application.ProjList.find(x => x.name == info.value.proj)?.raw;

  if (raw) {
    const barRef: QAjaxBar = bar.value!
    barRef.start()
    barRef.increment(20)
    collection.value = await LoadSubjectCollection(raw)
    console.log(collection.value)
    barRef.stop();
    cards.value = GetNodesAsCard(collection.value.subjects.find(x => x.title == info.value.subject)!)
    console.log(cards.value)

    currentCard.value = cards.value[Math.floor(Math.random() * cards.value.length)]

  }
})

const rememberClick = () => {
  currentCard.value = cards.value[Math.floor(Math.random() * cards.value.length)]
  let mask: HTMLElement = opinionMask.value!
  mask.hidden = false;
}

const maskClick = (e: any) => {
  const element = e.target as HTMLElement;
  element.hidden = true;
}
</script>

<style scoped>
.my-content {
  padding: 10px 15px;
  background: rgba(86, 61, 124, .15);
  border: 1px solid rgba(86, 61, 124, .2);
}

.mask {
  top: 0;
  z-index: 10;
  position: absolute;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(8px);
  background: rgb(255, 255, 255, .1);
}


</style>
