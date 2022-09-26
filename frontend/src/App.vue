<!-- 
  Copyright 2022, The Johns Hopkins University Applied Physics Laboratory LLC
  All rights reserved.
  Distributed under the terms of the BSD 3-Clause License.

  NO WARRANTY, NO LIABILITY. THIS MATERIAL IS PROVIDED “AS IS.” JHU/APL MAKES NO
  REPRESENTATION OR WARRANTY WITH RESPECT TO THE PERFORMANCE OF THE MATERIALS, INCLUDING
  THEIR SAFETY, EFFECTIVENESS, OR COMMERCIAL VIABILITY, AND DISCLAIMS ALL WARRANTIES IN
  THE MATERIAL, WHETHER EXPRESS OR IMPLIED, INCLUDING (BUT NOT LIMITED TO) ANY AND ALL
  IMPLIED WARRANTIES OF PERFORMANCE, MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE,
  AND NON-INFRINGEMENT OF INTELLECTUAL PROPERTY OR OTHER THIRD PARTY RIGHTS. ANY USER OF
  THE MATERIAL ASSUMES THE ENTIRE RISK AND LIABILITY FOR USING THE MATERIAL. IN NO EVENT
  SHALL JHU/APL BE LIABLE TO ANY USER OF THE MATERIAL FOR ANY ACTUAL, INDIRECT,
  CONSEQUENTIAL, SPECIAL OR OTHER DAMAGES ARISING FROM THE USE OF, OR INABILITY TO USE,
  THE MATERIAL, INCLUDING, BUT NOT LIMITED TO, ANY DAMAGES FOR LOST PROFITS.
 -->
<template>
  <v-app>
    <v-app-bar app color="primary">
      <v-img
        class="mx-2"
        src="@/assets/logo-white.png"
        max-height="40"
        max-width="40"
        contain
      ></v-img>
      <v-toolbar-title><span style="color:white">nanoDART</span></v-toolbar-title>

      <v-spacer></v-spacer>
      <v-btn v-for="item in navItems" :key="item.title" :to="item.link" text tile color="white">
        <v-icon left>
          {{ item.icon }}
        </v-icon>
        {{ item.title }}
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container>
        <router-view/>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import store from './store'
import AnalysisService from '@/services/analysis.service'

export default {
  name: 'App',
  data: () => ({
    drawer: false,
    navItems: [
      { title: 'Home', icon: 'mdi-home', link: '/' },
      { title: 'Analysis', icon: 'mdi-test-tube', link: '/analysis' },
      { title: 'Results', icon: 'mdi-file-chart', link: '/results' }
    ],
    logTimeout: null,
    plotTimeout: null,
    orgTimeout: null,
    ntcTimeout: null,
  }),
  mounted() {
    this.pollLog()
    this.pollPlot()
    this.pollOrg()
    this.pollNtc()
  },
  unmounted() {
    clearTimeout(this.logTimeout)
    clearTimeout(this.plotTimeout)
    clearTimeout(this.orgTimeout)
    clearTimeout(this.ntcTimeout)
  },
  methods: {
    pollLog() {
      AnalysisService.getLog()
        .then(response => store.setLogDataAction(response.data.content))
        .finally(() => {
          this.logTimeout = setTimeout(this.pollLog, 2000)
        })
    },
    pollPlot() {
      AnalysisService.getPlot()
        .then(response => store.setPlotDataAction(response.data))
        .finally(() => {
          this.plotTimeout = setTimeout(this.pollPlot, 2000)
        })
    },
    pollOrg() {
      AnalysisService.getOrg()
        .then(response => store.setOrgDataAction(response.data))
        .finally(() => {
          this.orgTimeout = setTimeout(this.pollOrg, 2000)
        })
    },
    pollNtc() {
      AnalysisService.getNtc()
        .then(response => store.setNtcDataAction(response.data))
        .finally(() => {
          this.ntcTimeout = setTimeout(this.pollNtc, 2000)
        })
    }
  }
}
</script>
