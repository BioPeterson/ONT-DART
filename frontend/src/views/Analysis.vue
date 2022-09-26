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
  <div>
    <v-row>
      <v-col>
        <v-alert
          v-model="alert"
          dismissible
          outlined
          :type="responseType"
          transition="slide-y-transition"
        >
          {{ responseMessage }}
        </v-alert>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6">
        <analysis-form ref="analysisForm" @response="handleResponse" :height="height"></analysis-form>
      </v-col>
      <v-col cols="6">
        <analysis-log :height="height"></analysis-log>
      </v-col>
    </v-row>
    <v-row>
      <v-col align="center">
        <v-btn v-if="plot.data.length > 0 && org.data.length > 0" block outlined color="primary" to="/results">
          View Analysis Results
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import AnalysisForm from '@/components/AnalysisForm'
import AnalysisLog from '@/components/AnalysisLog'
import store from '@/store'

export default {
  name: 'Analysis',
  components: {
    AnalysisForm,
    AnalysisLog
  },
  data: () => ({
    alert: false,
    height: '450px',
    responseType: 'success',
    responseMessage: '',
    plot: store.state.plot,
    org: store.state.org
  }),
  methods: {
    handleResponse(data) {
      this.responseType = data.type
      this.responseMessage = data.message
      this.alert = true
    }
  }
}
</script>
