/**
 * Copyright 2022, The Johns Hopkins University Applied Physics Laboratory LLC
 * All rights reserved.
 * Distributed under the terms of the BSD 3-Clause License.
 */
import axios from 'axios'

const API_URL = '/api/analysis'

class AnalysisService {
    startAnalysis(data) {
        return axios.post(API_URL, data)
    }

    stopAnalysis() {
        return axios.delete(API_URL)
    }

    getLog() {
        return axios.get(`${API_URL}/log`)
    }

    getPlot() {
        return axios.get(`${API_URL}/plot`)
    }

    getOrg() {
        return axios.get(`${API_URL}/org`)
    }

    getNtc() {
        return axios.get(`${API_URL}/ntc`)
    }
}

export default new AnalysisService()
