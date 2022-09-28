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
        <div v-if="plot.data.length === 0 || org.data.length === 0" class="text-h4">
            Waiting for analysis results ...
        </div>
        <div v-show="heatmapData.length > 0">
            <results-toolbar
                @toggle-thresholds="toggleThresholds"
                @download-graph="downloadGraph"
                @download-all="downloadAll"
                @download-pdf="downloadPDF"
            ></results-toolbar>
            <v-row>
                <v-col align="center">
                    <div id="heatmap-text-hover">{{ hoverText }}</div>
                    <div id="heatmap"></div>
                </v-col>
            </v-row>
            <v-row v-for="(value, name) in tables" :key="name">
                <v-col>
                    <v-card elevation="2">
                        <v-card-title>{{ value.title }}</v-card-title>
                        <v-card-text>
                            <v-data-table
                                :headers="value.headers"
                                :items="value.rows"
                                :items-per-page="5"
                                class="elevation-1"
                            ></v-data-table>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn text color="primary" @click="downloadTable(name)">Download CSV</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>
        </div>
    </div>
</template>

<script>
import ResultsToolbar from '@/components/ResultsToolbar'
import ResultsService from '@/services/results.service'
import store from '@/store'
import * as d3 from 'd3v4'
import d3_save_svg from 'd3-save-svg'
import { saveAs } from 'file-saver'

export default {
    name: 'Results',
    components: {
        ResultsToolbar
    },
    data: () => ({
        org: store.state.org,
        plot: store.state.plot,
        ntc: store.state.ntc,
        heatmapData: [],
        currentChart: 'arc',
        hoverText: '',
        tables: {
            table1: {
                title: 'Table 1. Summary of detected organisms',
                headers: [
                    {
                        text: 'Barcode',
                        value: 'barcode',
                        sortable: false
                    },
                    {
                        text: 'Organism',
                        value: 'organism',
                        sortable: false
                    },
                    {
                        text: 'Organism specific amplicons',
                        value: 'orgspec',
                        sortable: false
                    },
                    {
                        text: 'Mean amplicon aligned read count',
                        value: 'maarc'
                    }
                ],
                rows: []
            },
            table2: {
                title: 'Table 2. Summary of sample read alignments to individual amplicons',
                headers: [
                    {
                        text: 'Barcode',
                        value: 'barcode',
                        sortable: false
                    },
                    {
                        text: 'Organism code,Amplicon name',
                        value: 'orgamp',
                        sortable: false
                    },
                    {
                        text: 'Aligned read count',
                        value: 'arc'
                    },
                    {
                        text: 'Proportion aligned reads of barcode',
                        value: 'parc'
                    }
                ],
                rows: []
            },
            table3: {
                title: 'Table 3. Summary of read alignments among NTC barcodes',
                headers: [
                    {
                        text: 'Organism code,Amplicon name',
                        value: 'orgamp',
                        sortable: false
                    },
                    {
                        text: 'Mean aligned read count',
                        value: 'marc'
                    },
                    {
                        text: 'Aligned read count standard deviation',
                        value: 'arcsd'
                    }
                ],
                rows: []
            }
        }
    }),
    mounted() {
        this.$nextTick(function () {
            this.renderHeatmap()
        })
    },
    methods: {
        renderHeatmap() {
            const data = this.heatmapData
            if (data.length === 0) {
                return
            }

            const chartType = this.currentChart
            const setHoverText = this.setHoverText
            const margin = { top: 60, right: 200, bottom: 225, left: 90 }
            const height = 300
            const width = 700
            const boxBorder = 1
            const borderColor = 'black'
            const heatmapId = '#heatmap'
            let g

            d3.select(heatmapId).select('svg').remove()  // Remove existing svg

            const svg = d3.select(heatmapId)
                .append('svg')
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
                .append('g')
                .attr('transform',
                    'translate(' + margin.left + ',' + margin.top + ')')

            const barcodes = ['barcode12', 'barcode11', 'barcode10', 'barcode09', 'barcode08', 'barcode07', 'barcode06', 'barcode05', 'barcode04', 'barcode03', 'barcode02', 'barcode01']

            const amplicons = []
            const orgcodeMap = new Map()
            data.forEach(d => {
                const orgcode = d['orgcode']
                if (!orgcodeMap.has(orgcode)) {
                    orgcodeMap.set(orgcode, [])
                }
                const amplicon = d['amplicon']
                amplicons.push(amplicon)
                orgcodeMap.get(orgcode).push(amplicon)
            })

            let maxValue
            if (chartType === 'arc') {
                maxValue =  d3.max(data, d => +d.arc)
            }

            amplicons.sort(d3.ascending)

            // Build X scales and axis:
            const x = d3.scaleBand()
                .range([0, width])
                .domain(amplicons)
                .padding(0.05)

            svg.append('g')
                .style('font-size', 15)
                .attr('transform', 'translate(0,' + height + ')')
                .call(d3.axisBottom(x).tickSize(0))
                .selectAll('text')
                    .style('text-anchor', 'end')
                    .attr('dx', '-.8em')
                    .attr('dy', '.15em')
                    .attr('transform', 'rotate(-90)')

            // text label for the x-axis
            svg.append('text')
                .attr('x', width / 2)
                .attr('y', height + margin.bottom * 0.5)
                .style('text-anchor', 'middle')
                .text('AMPLICON')

            // text label for the x-axis
            svg.append('text')
                .attr('x', width / 2)
                .attr('y', -25)
                .style('text-anchor', 'middle')
                .text('ORGANISM')

            // organism labels for amplicons
            orgcodeMap.forEach((amplicons, orgcode) => {
                const xPos = x(amplicons[0])
                svg.append('text')
                    .attr('x', xPos)
                    .attr('y', -5)
                    .style('font-size', 14)
                    .text(orgcode)
            })

            // Build Y scales and axis:
            const y = d3.scaleBand()
                .range([height, 0])
                .domain(barcodes)
                .padding(0.05)

            svg.append('g')
                .style('font-size', 15)
                .call(d3.axisLeft(y).tickSize(0))
                .select('.domain').remove()

            // Build color scale
            let myColor
            if (chartType === 'arc') {
                myColor = d3.scaleLinear()
                    .domain([0,1,maxValue])
                    .range(['white','blue','red'])
            } else {
                myColor = d3.scaleOrdinal()
                    .domain(['Organism Detected', 'Amplicon Detected', 'No Detection', 'NTC'])
                    .range(['red','blue','white','gray'])
            }

            const mouseover = function (d) {
                let hoverText = `${d['orgcode']}, ${d['amplicon']}, ${d['barcode']}: `
                hoverText += chartType === 'arc' ? d['arc'] : d['detecttype']
                setHoverText(hoverText)
            }

            // add the squares
            svg.selectAll()
                .data(data, d => d['amplicon'] + ':' + d['orgcode'])
                .enter()
                .append('rect')
                .attr('x', d => x(d['amplicon']))
                .attr('y', d => y(d['barcode']))
                .attr('rx', 4)
                .attr('ry', 4)
                .attr('width', x.bandwidth() )
                .attr('height', y.bandwidth() )
                .style('fill', d => chartType === 'arc' ? myColor(d.arc) : myColor(d['detecttype']))
                .style('stroke', borderColor)
                .style('stroke-width', boxBorder)
                .style('opacity', 1)
                .on('mouseover', mouseover)
                .on('mouseleave', () => setHoverText(''))

            // Legend
            const zeroWidth = x.bandwidth()
            const padding = 9
            const lWidth = 320

            if (chartType === 'arc') {
                const innerWidth = lWidth - (padding * 2)
                const barHeight = y.bandwidth()
                const tickHeight = barHeight * 1.5
                const xTicksLegend = [1, Math.round(maxValue / 2), maxValue]

                const legendData = [{'color': '#0000FF', 'value': 1}, {'color': '#FF0000', 'value': maxValue}]
                const extent = d3.extent(legendData, d => d.value)

                const xScaleLegend = d3.scaleLinear()
                    .range([0, innerWidth])
                    .domain(extent)

                const xAxisLegend = d3.axisBottom(xScaleLegend)
                    .tickSize(tickHeight)
                    .tickValues(xTicksLegend)

                g = svg.append('g').attr('transform', 'translate(' + padding + ', 0)')

                const defs = svg.append('defs')
                const linearGradient = defs.append('linearGradient').attr('id', 'myGradient')
                linearGradient.selectAll('stop')
                    .data(legendData)
                    .enter().append('stop')
                    .attr('offset', d => ((d['value'] - extent[0]) / (extent[1] - extent[0]) * 100) + '%')
                    .attr('stop-color', d => d['color'])

                g.append('rect')
                    .attr('width', zeroWidth)
                    .attr('height', barHeight)
                    .attr('transform', 'translate(' + ((width-lWidth)/2-zeroWidth)  + ',' + (height+margin.bottom*.75) + ')')
                    .style('fill', 'white')
                    .style('stroke', 'black')
                    .style('stroke-width', 1)

                // text label for the legend
                svg.append('text')
                    .attr('transform', 'translate(' + ((width-lWidth)/2-zeroWidth+padding) + ' ,' +
                        (height+margin.bottom*.75+tickHeight+padding*1.5) + ')')
                    .style('text-anchor', 'middle')
                    .text('0')

                g.append('rect')
                    .attr('width', innerWidth)
                    .attr('height', barHeight)
                    .attr('transform', 'translate(' + (width-lWidth)/2  + ',' + (height+margin.bottom*.75) + ')')
                    .style('fill', 'url(#myGradient)')
                    .style('stroke', 'black')
                    .style('stroke-width', 1)

                g.append('g')
                    .call(xAxisLegend)
                    .style('font-size', 15)
                    .attr('transform', 'translate(' + (width-lWidth)/2  + ',' + (height+margin.bottom*.75) + ')')
                    .select('.domain').remove()

                // text label for the legend
                svg.append('text')
                    .attr('transform', 'translate(' + (width/2) + ' ,' + (height + margin.bottom*.7) + ')')
                    .style('text-anchor', 'middle')
                    .text('Aligned Read Counts')

            } else {
                const lHeight = 150
                const boxWidth = zeroWidth
                const spacing = (lHeight - boxWidth * 4) / 3
                const startX = width + padding
                const startY = (height - lHeight) / 2

                g = svg.append('g').attr('transform', 'translate(' + padding + ', 0)')
                g.append('rect')
                    .attr('width', zeroWidth)
                    .attr('height', boxWidth)
                    .attr('transform', 'translate(' + (startX)  + ',' + (startY) + ')')
                    .style('fill', 'red')
                    .style('stroke', 'black')
                    .style('stroke-width', 1)
                g.append('rect')
                    .attr('width', zeroWidth)
                    .attr('height', boxWidth)
                    .attr('transform', 'translate(' + (startX)  + ',' + (startY+spacing+boxWidth) + ')')
                    .style('fill', 'blue')
                    .style('stroke', 'black')
                    .style('stroke-width', 1)
                g.append('rect')
                    .attr('width', zeroWidth)
                    .attr('height', boxWidth)
                    .attr('transform', 'translate(' + (startX)  + ',' + (startY+spacing*2+boxWidth*2) + ')')
                    .style('fill', 'white')
                    .style('stroke', 'black')
                    .style('stroke-width', 1)
                g.append('rect')
                    .attr('width', zeroWidth)
                    .attr('height', boxWidth)
                    .attr('transform', 'translate(' + (startX)  + ',' + (startY+spacing*3+boxWidth*3) + ')')
                    .style('fill', 'gray')
                    .style('stroke', 'black')
                    .style('stroke-width', 1)

                // text label for the legend
                svg.append('text')
                    .style('font-size', 16)
                    .attr('transform', 'translate(' + (startX+boxWidth*1.5) + ' ,' + (startY+(boxWidth*0.5)) + ')')
                    .style('text-anchor', 'start')
                    .style('alignment-baseline','middle')
                    .text('Organism Detected')
                svg.append('text')
                    .style('font-size', 16)
                    .attr('transform', 'translate(' + (startX+boxWidth*1.5) + ' ,' + (startY+boxWidth*1.5+spacing) + ')')
                    .style('text-anchor', 'start')
                    .style('alignment-baseline','middle')
                    .text('Amplicon Detected')
                svg.append('text')
                    .style('font-size', 16)
                    .attr('transform', 'translate(' + (startX+boxWidth*1.5) + ' ,' + (startY+boxWidth*2.5+spacing*2) + ')')
                    .style('text-anchor', 'start')
                    .style('alignment-baseline','middle')
                    .text('No Detection')
                svg.append('text')
                    .style('font-size', 16)
                    .attr('transform', 'translate(' + (startX+boxWidth*1.5) + ' ,' + (startY+boxWidth*3.5+spacing*3) + ')')
                    .style('text-anchor', 'start')
                    .style('alignment-baseline','middle')
                    .text('NTC')
            }
        },
        toggleThresholds() {
            this.currentChart = this.currentChart === 'detect' ? 'arc' : 'detect'
            this.renderHeatmap(this.plot.data)
        },
        downloadGraph() {
            const config = { filename: 'ont-dart_results' };
            d3_save_svg.save(d3.select('svg').node(), config);
        },
        downloadAll() {
            const data = {}
            Object.keys(this.tables).forEach(key => {
                data[key] = this.convertTableToCSV(key)
            })
            ResultsService.downloadZip(data)
        },
        downloadPDF() {
            let htmlString = ''

            // Add both graphs
            if (this.currentChart === 'detect') {
                this.toggleThresholds()
                htmlString += document.getElementById('heatmap').outerHTML
                this.toggleThresholds()
                htmlString += document.getElementById('heatmap').outerHTML
            } else {
                htmlString += document.getElementById('heatmap').outerHTML
                this.toggleThresholds()
                htmlString += document.getElementById('heatmap').outerHTML
                this.toggleThresholds()
            }

            Object.keys(this.tables).forEach(key => htmlString += this.convertTableToHTML(key))
            ResultsService.downloadPDF({ html: htmlString });
        },
        downloadTable(tableId) {
            const csvString = this.convertTableToCSV(tableId)
            const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8' });
            saveAs(blob, `${tableId}.csv`)
        },
        convertTableToCSV(tableId) {
            const table = this.tables[tableId]
            const keys = table.headers.map(header => header.value)
            const headerStr = table.headers.map(header => header.text).join(',')
            const bodyStr = table.rows.map(row => keys.map(key => row[key]).join(',')).join('\n')
            const csvString = `${headerStr}\n${bodyStr}`
            return csvString
        },
        convertTableToHTML(tableId) {
            const table = this.tables[tableId]
            const headers = table.headers.map(header => header.text)
            const keys = table.headers.map(header => header.value)
            const rows =  table.rows.map(row => keys.map(key => row[key]))

            const style = 'border: 1px solid black; padding: 8px;'
            let headerHTML = '<tr>'
            headers.forEach(header => headerHTML += `<th style="${style}">${header}</th>`)
            headerHTML += '</tr>'

            let bodyHTML = ''
            rows.forEach(row => {
                bodyHTML += '<tr>'
                row.forEach(col => bodyHTML += `<td style="${style}">${col}</td>`)
                bodyHTML += '</tr>'
            })

            return `<h2>${table.title}</h2><table>${headerHTML}${bodyHTML}</table>`
        },
        updateTable(table, data) {
            const keys = table.headers.map(header => header.value)
            table.rows = data.map(d => {
                const row = {}
                keys.forEach(key => row[key] = d[key])
                return row
            })
        },
        setHoverText(text) {
            this.hoverText = text
        }
    },
    watch: {
        org: {
            handler: function (newOrg) {
                const data = newOrg.data
                this.updateTable(this.tables.table1, data.filter(d => d['detection'] === 1))
            },
            deep: true,
            immediate: true
        },
        plot: {
            handler: function (newPlot) {
                const data = newPlot.data
                this.heatmapData = data
                this.updateTable(this.tables.table2, data.filter(d => d['arc'] > 0))
            },
            deep: true,
            immediate: true
        },
        ntc: {
            handler: function (newNTC) {
                const data = newNTC.data
                this.updateTable(this.tables.table3, data)
            },
            deep: true,
            immediate: true
        },
        heatmapData() {
            this.renderHeatmap()
        },
        hoverText(newHoverText) {
            const opacity = newHoverText ? 1 : 0
            d3.select('#heatmap-text-hover').style('opacity', opacity)
        }
    }
}
</script>

<style scoped>
#heatmap {
    overflow: scroll
}
#heatmap-text-hover {
    opacity: 0;
    height: 40px;
    width: 400px;
    border: solid;
    border-width: 2px;
    border-radius: 5px;
    padding: 4px
}
</style>
