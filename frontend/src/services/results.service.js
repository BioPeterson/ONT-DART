/**
 * Copyright 2022, The Johns Hopkins University Applied Physics Laboratory LLC
 * All rights reserved.
 * Distributed under the terms of the BSD 3-Clause License.
 */
import axios from 'axios'
import fileDownload from 'js-file-download'

const API_URL = '/api/results'

class ResultsService {
    downloadZip(data) {
        axios({
            url: `${API_URL}/zip`,
            method: 'POST',
            data: data,
            responseType: 'blob'
        }).then((response) => {
            fileDownload(response.data, 'nanodart-tables.zip')
        })
    }

    downloadPDF(data) {
        axios({
            url: `${API_URL}/pdf`,
            method: 'POST',
            data: data,
            responseType: 'blob'
        }).then((response) => {
            fileDownload(response.data, 'nanodart.pdf')
        })
    }
}

export default new ResultsService()