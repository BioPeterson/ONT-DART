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
      <v-col align="center">
        <div class="text-h1">nanoDART</div>
        <div class="text-subtitle-2">
          <u>nano</u>pore <u>D</u>etection of <u>A</u>mplicons in <u>R</u>eal-<u>T</u>ime  
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <div class="text-body-1">
          The nanoDART (nanopore Detection of Amplicons in Real-Time) analysis pipeline is used to identify the presence of amplicons
          produced from a multiplex PCR reaction from sequence read output of an Oxford Nanopore Technologies (ONT) sequencing device 
          (e.g. MK1B, MK1C, or GridION). If all amplicon products from a particular organism are above the algorithm's three detection
          thresholds, the organism is flagged as present in the sample.
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <div class="text-body-1">
          R9 or FLG flowcells are expected to have been used for sequencing the pooled barcoded library (one sample per barcode), using
          the Native Barcoding kit, and MinKNOW software utilized for experiment setup, basecalling, and demultiplexing of sequence reads.
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <div class="text-body-1">
          Positive detection thresholds occur in the following order:
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <div class="text-body-2">
          T1. per read alignment thresholds (>=90% alignment identity and length)
        </div>
      </v-col>
      <v-col>
        <div class="text-body-2">
          T2. per sample threshold (>2% total aligned read count)
        </div>
      </v-col>
      <v-col>
        <div class="text-body-2">
          T3. per flow cell threshold (based on NTCs, amplicon called negative if the sample count &lt; {[mean NTC counts] + [3*NTC count standard deviation]})
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col align="center">
        <v-btn block outlined color="primary" to="/analysis">
          Go to Analysis
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: 'Home'
}
</script>
