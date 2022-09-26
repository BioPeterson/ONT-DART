# Copyright 2022, The Johns Hopkins University Applied Physics Laboratory LLC
# All rights reserved.
# Distributed under the terms of the BSD 3-Clause License.
#
# NO WARRANTY, NO LIABILITY. THIS MATERIAL IS PROVIDED “AS IS.” JHU/APL MAKES NO
# REPRESENTATION OR WARRANTY WITH RESPECT TO THE PERFORMANCE OF THE MATERIALS, INCLUDING
# THEIR SAFETY, EFFECTIVENESS, OR COMMERCIAL VIABILITY, AND DISCLAIMS ALL WARRANTIES IN
# THE MATERIAL, WHETHER EXPRESS OR IMPLIED, INCLUDING (BUT NOT LIMITED TO) ANY AND ALL
# IMPLIED WARRANTIES OF PERFORMANCE, MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE,
# AND NON-INFRINGEMENT OF INTELLECTUAL PROPERTY OR OTHER THIRD PARTY RIGHTS. ANY USER OF
# THE MATERIAL ASSUMES THE ENTIRE RISK AND LIABILITY FOR USING THE MATERIAL. IN NO EVENT
# SHALL JHU/APL BE LIABLE TO ANY USER OF THE MATERIAL FOR ANY ACTUAL, INDIRECT,
# CONSEQUENTIAL, SPECIAL OR OTHER DAMAGES ARISING FROM THE USE OF, OR INABILITY TO USE,
# THE MATERIAL, INCLUDING, BUT NOT LIMITED TO, ANY DAMAGES FOR LOST PROFITS.
import io
import json
import os
import os.path
import subprocess
import time
import zipfile
from datetime import datetime
from pathlib import Path
from typing import Optional, Callable

import pdfkit
from flask import Flask, jsonify, render_template, request, send_file
from flask_cors import CORS

from utils import ORG_FILE, ORG_JSON, PLOT_FILE, PLOT_JSON, NTC_FILE, NTC_JSON, \
                process_org_tsv, process_plot_tsv, process_ntc_tsv


dist_path = os.path.abspath('dist')

nanomonitor_path = Path.cwd().parent / 'nanomonitor.sh'
ref_directory = '/app/nanoDART_accessory_files/blastn/unencrypted_db/blastdb_all_amplicons'

running_analysis = False
output_directory: Optional[Path] = None
log_file: Optional[Path] = None

app = Flask(__name__, static_url_path='', template_folder=dist_path, static_folder=dist_path)
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0

# Enable CORS
CORS(app, resources={r'/*': {'origins': '*'}})


def run_nanomonitor(input_directory: Path, barcode_list: str, analysis_interval: str, num_threads: str):
    global running_analysis, output_directory, log_file
    logs_dir = 'logs'
    os.makedirs(logs_dir, exist_ok=True)
    timestamp = time.strftime('%Y%m%d-%H%M%S')
    output_directory = input_directory.parent / 'nanodart-output-{}'.format(timestamp)
    log_file = Path('{}/{}.log'.format(logs_dir, timestamp))

    subprocess.Popen([nanomonitor_path, '-t', num_threads, '-a', analysis_interval,
                      '-i', input_directory, '-n', barcode_list, '-o', output_directory,
                      '-r', ref_directory], stdout=open(log_file, 'wb'), stderr=subprocess.STDOUT)
    running_analysis = True


@app.route('/')
def index():
    """
    Generates main index page for nanoDART from template.

    Returns:
        render_template: renders index.html template
    """
    return render_template('index.html')


@app.route('/api/analysis', methods=['POST', 'DELETE'])
def analysis():
    global running_analysis
    if request.method == 'POST':
        if running_analysis:
            return jsonify(
                {'message': 'An analysis is already running. Stop the current analysis before running a new one.'}
            ), 409

        content = request.get_json()
        input_directory = Path(content['inputDirectory'])
        barcode_list = content['barcodeList']
        analysis_interval = content['analysisInterval']
        num_threads = content['numThreads']

        barcode_list_split = barcode_list.split(',')
        valid_barcodes = len(barcode_list_split) == 3
        for bc in barcode_list_split:
            bc_part = bc[0:7] == 'barcode'
            num_part = bc[7:].isnumeric() and 1 <= int(bc[7:]) <= 12 and len(bc[7:]) == 2
            valid_barcodes = valid_barcodes and bc_part and num_part

        if not input_directory.exists():
            error = 'The input directory does not exist.'
        elif not analysis_interval.isnumeric():
            error = 'Invalid interval'
        elif not num_threads.isnumeric():
            error = 'Invalid threads'
        elif not valid_barcodes:
            error = 'Invalid barcodes'
        else:
            run_nanomonitor(input_directory, barcode_list, analysis_interval, num_threads)
            return jsonify({'message': 'Analysis successfully started'})

        return jsonify({'message': error}), 422

    elif request.method == 'DELETE':
        if not running_analysis:
            return jsonify({'message': 'There is no analysis currently running.'}), 404
        subprocess.Popen('killall nanomonitor.sh', shell=True)
        running_analysis = False
        return jsonify({'message': 'Analysis successfully stopped'})


@app.route('/api/analysis/log')
def analysis_log():
    if log_file is None or not log_file.exists():
        return jsonify({'content': ''})

    proc = subprocess.Popen(['tail', '-n', '100', log_file], stdout=subprocess.PIPE, text=True)
    lines = proc.stdout.readlines()
    return jsonify({'content': ''.join(reversed(lines))})


@app.route('/api/results/zip', methods=['POST'])
def results_zip():
    """
    Create CSV files of all data tables and add to zip file along with
    original plot.tsv and org.tsv files. Send zip file to client. Data tables
    are sent in forms as hidden inputs.

    Returns:
        send_file: sends zip file to client
    """
    if output_directory is None or not output_directory.exists():
        return jsonify({'message': 'The analysis output directory does not exist.'}), 404

    content = request.get_json()
    memory_file = io.BytesIO()
    with zipfile.ZipFile(memory_file, 'w', zipfile.ZIP_DEFLATED) as zip_file:
        for name, value in content.items():
            file_contents = value
            file_name = '{}.csv'.format(name)
            with io.StringIO(file_contents) as csv_file:
                zip_file.writestr(file_name, csv_file.read())
        zip_file.write(output_directory / ORG_FILE, 'org.tsv')
        zip_file.write(output_directory / PLOT_FILE, 'plot.tsv')
        zip_file.write(output_directory / NTC_FILE, 'ntc.tsv')
    memory_file.seek(0)

    return send_file(memory_file,
                     mimetype='application/zip',
                     attachment_filename='nanodart-tables.zip',
                     as_attachment=True, cache_timeout=0)


@app.route('/api/results/pdf', methods=['POST'])
def results_pdf():
    """
    Create a pdf from the submitted HTML data.

    Returns:
        response object: sends pdf file to client
    """
    content = request.get_json()
    options = {'page-size': 'Letter', 'margin-top': '0.75in', 'margin-bottom': '0.75in',
               'margin-left': '0.75in', 'margin-right': '0.75in', 'quiet': ''}
    html_header = '<!doctype html><html lang="en"><head><meta charset="utf-8">' + \
                  '<title>nanoDART</title></head><body>' + \
                  '<h1>nanoDART Report: ' + datetime.now().strftime('%Y-%m-%d %H:%M:%S') + '</h1>'
    html_string = html_header + content['html'] + '</body></html>'
    pdf_bytes = pdfkit.from_string(html_string, options=options)
    return send_file(io.BytesIO(pdf_bytes), attachment_filename='nanodart.pdf', as_attachment=True,
                     mimetype='application/pdf')


@app.route('/api/analysis/org')
def org_data():
    return jsonify(get_output_values(ORG_JSON, process_org_tsv))


@app.route('/api/analysis/plot')
def plot_data():
    return jsonify(get_output_values(PLOT_JSON, process_plot_tsv))


@app.route('/api/analysis/ntc')
def ntc_data():
    return jsonify(get_output_values(NTC_JSON, process_ntc_tsv))


def get_output_values(json_file_name: str, process_tsv: Callable[[Path], bool]):
    data = []
    if output_directory is not None and output_directory.exists():
        if process_tsv(output_directory):
            with open(output_directory / json_file_name) as json_file:
                data = json.loads(json_file.read())
    return data


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=False)
