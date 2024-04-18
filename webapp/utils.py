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

from pathlib import Path

import pandas as pd

ORG_FILE = 'for_vis_org.tsv'
ORG_JSON = 'org.json'

PLOT_FILE = 'for_vis_plot.tsv'
PLOT_JSON = 'plot.json'

NTC_FILE = 'for_vis_ntc.tsv'
NTC_JSON = 'ntc.json'


def process_org_tsv(output_directory: Path):
    """ Read the org tsv file from the output directory and save it as json in the output directory

    Returns:
        boolean - if data processing was successful
    """
    try:
        df_org = pd.read_csv(output_directory / ORG_FILE, sep='\t', header=None,
                             names=["barcode", "orgcode", "organism", "detection", "orgspec", "maarc"])
        df_org.to_json(output_directory / ORG_JSON, orient='records', double_precision=4)

    except FileNotFoundError:
        return False

    return True


def process_plot_tsv(output_directory: Path):
    """ Read the plot tsv file from the output directory and save it as json in the output directory

    Returns:
        boolean - if data processing was successful
    """
    header = ["barcode", "sampletype", "orgamp", "arc", "parc", "t2detection", "marc", "arcsd", "t3detection",
              "finalcall", "orgcode", "orgname", "orgdetection", "numorgamp", "meanorgaarc"]
    try:
        df = pd.read_csv(output_directory / PLOT_FILE, sep='\t', header=None, names=header)
        split_col = df['orgamp'].astype(str).str.split(",", n=1, expand=True)
        df['amplicon'] = split_col[1]
        df['detecttype'] = [''] * len(df)
        df.loc[df.orgdetection == 1, 'detecttype'] = 'Organism Detected'
        df.loc[(df.finalcall == 'positive') & (df.orgdetection == 0), 'detecttype'] = 'Amplicon Detected'
        df.loc[df.finalcall == 'negative', 'detecttype'] = 'No Detection'
        df.loc[df.sampletype == 'NTC', 'detecttype'] = 'NTC'
        df.sort_values(['barcode', 'orgamp'], inplace=True)
        df.loc[df['marc'] != 'NTC', 'marc'] = df.loc[df['marc'] != 'NTC', 'marc'].astype(float).round(4).astype(str)
        df.loc[df['arcsd'] != 'NTC', 'arcsd'] = df.loc[df['arcsd'] != 'NTC', 'arcsd'].astype(float).round(4).astype(str)
        df.to_json(output_directory / PLOT_JSON, orient='records', double_precision=4)

    except FileNotFoundError:
        return False

    return True


def process_ntc_tsv(output_directory: Path):
    """ Read the ntc tsv file from the output directory and save it as json in the output directory

    Returns:
        boolean - if data processing was successful
    """
    try:
        df_org = pd.read_csv(output_directory / NTC_FILE, sep='\t', header=None,
                             names=["orgamp", "marc", "arcsd"])
        df_org.to_json(output_directory / NTC_JSON, orient='records', double_precision=4)

    except FileNotFoundError:
        return False

    return True
