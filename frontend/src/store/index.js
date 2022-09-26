/**
 * Copyright 2022, The Johns Hopkins University Applied Physics Laboratory LLC
 * All rights reserved.
 * Distributed under the terms of the BSD 3-Clause License.
 */
const store = {
    state: {
        org: {
            data: []
        },
        plot: {
            data: []
        },
        ntc: {
            data: []
        },
        log: {
            data: ''
        }
    },
    setOrgDataAction(data) {
        if (JSON.stringify(this.state.org.data) !== JSON.stringify(data)) {
            this.state.org.data = data
        }
    },
    setPlotDataAction(data) {
        if (JSON.stringify(this.state.plot.data) !== JSON.stringify(data)) {
            this.state.plot.data = data
        }
    },
    setNtcDataAction(data) {
        if (JSON.stringify(this.state.ntc.data) !== JSON.stringify(data)) {
            this.state.ntc.data = data
        }
    },
    setLogDataAction(data) {
        this.state.log.data = data
    }
}

export default store
