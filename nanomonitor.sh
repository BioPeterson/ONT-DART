#!/bin/bash
# Copyright 2022, The Johns Hopkins University Applied Physics Laboratory LLC
# All rights reserved.
# Distributed under the terms of the BSD 3-Clause License.

#	FUNCTIONS
#===============================================================================
usage()
{
cat << EOF

Help message for \`nanomonitor.sh\`:

This algorithm is designed for a very specific amplicon use-case, and is part
of the ONT-DART (Oxford Nanopore Technologies Detection of Amplicons in Real-Time) analysis pipeline.
The input fastq_pass (-i) directory should have subfolders named for barcodes.
For this use-case, subfolder names are expected to be from 'barcode01' to 'barcode12'.

Non-Template Control (NTC) samples:
	Three of the 12 barcodes (01 through 12) are reserved for NTCs.
	Use (-n) parameter to indicate which barcodes were used for the NTCs (eg. barcode01,barcode02,barcode03).

Positive detection thresholds will be indicated in comments where they occur:
	T1. per read alignment thresholds (>=90% alignment identity and length)
	T2. per sample threshold (>2% total aligned read count)
	T3. per flow cell threshold (based on NTCs, amplicon called negative if:
		(NTC mean+(3*stdev)) > (sample count)

NOTES:
	-
	- dependencies: GNU Parallel [1], GNU Core Utils; see README.md for full list
	- please index reference fasta with 'makeblastdb -dbtype nucl -in <FNA>'
	- PRIMARY OUTPUT FORMAT: plot.tsv
		1	barcode (e.g. barcode01)
		2	sample type (sample or control)
		3	<org>,<amplicon_id> (e.g. Org1,Org2)
		4	amplicon aligned read count (INT)
		5	proportion of flowcell total aligned reads
		6	detection after T2: 1 if amplicon count >2% total aligned read count, 0 if not
		7	mean NTC amplicon aligned read count
		8	standard deviation NTC amplicon aligned read count
		9	detection after T3: 1 if (col7+{3*col8}) > col4, 0 if not
		10	final call for amplicon detection; see below
					condition			final_call	description
				if col6==0 && col9==0	negative	amplicon not detected in sample or control
				if col6==0 && col9==1	negative	amplicon not detected in sample but was detected in control
				if col6==1 && col9==0	positive	true positive, amplicon detected in sample but not control
				if col6==1 && col9==1	negative	amplicon detected in sample and control
		11	org code (e.g. Org1, Org2)
		12	organism full name (e.g. Organism 1, Organism 2)
		13	organism detection; 1 if all organism-associated amplicons are 'positive' (col10), 0 if not
		14	number of organism associated amplicons
		15	mean org associated amplicon read count


	- SECONDARY OUTPUT FORMAT: org.tsv
		1	barcode
		2	org code (e.g. Org1, Org2)
		3	org full name (e.g. Genus species)
		4	detection (1 if all 'org associated amplicons are positive', 0 if not)
		5	number of organism associated amplicons
		6	mean org associated amplicon read count

usage:
bash nanomonitor.sh -t <INT> -a <INT> -i <DIR> -n <01-12> -r <FNA> -o <DIR>

REQUIRED:
	-h      show this message
	-t	INT	num threads
	-a	INT	analysis interval; number of seconds between analysis updates [10]
	-i	DIR	input directory <path/to/rundir/fastq_pass> (MinKNOW output dir structure)
	-n	STR	commas separated list of barcodes used for NTCs (eg. "barcode01,barcode02,barcode03")
	-r	FNA	reference fasta used for blastn (please index with makeblastdb)
	-o	DIR	output directory

____________________________________________________________________________________________________
References:
	1. O. Tange (2011): GNU Parallel - The Command-Line Power Tool, ;login: The USENIX Magazine, February 2011:42-47.



	example:


EOF
}


getavgqual()
{
sed $'$!N;s/\\\n/\t/' "$1" | sed $'$!N;s/\\\n/\t/' 2> /dev/null | cut -f4 | awk 'BEGIN{
	# build PHRED33 char to quality (q) array
	#	q = -10 * log10(p), where p is the probability that the corresponding base call is incorrect
	phred33["!"]=0; phred33["\""]=1; phred33["#"]=2; phred33["$"]=3; phred33["%"]=4;
	phred33["&"]=5; phred33["'\''"]=6; phred33["\("]=7; phred33["\)"]=8; phred33["*"]=9;
	phred33["+"]=10; phred33[","]=11; phred33["-"]=12; phred33["."]=13; phred33["/"]=14;
	phred33["0"]=15; phred33["1"]=16; phred33["2"]=17; phred33["3"]=18; phred33["4"]=19;
	phred33["5"]=20; phred33["6"]=21; phred33["7"]=22; phred33["8"]=23; phred33["9"]=24;
	phred33[":"]=25; phred33[";"]=26; phred33["<"]=27; phred33["="]=28; phred33[">"]=29;
	phred33["?"]=30; phred33["@"]=31; phred33["A"]=32; phred33["B"]=33; phred33["C"]=34;
	phred33["D"]=35; phred33["E"]=36; phred33["F"]=37; phred33["G"]=38; phred33["H"]=39;
	phred33["I"]=40; phred33["J"]=41;
};{
	# split quality string into array (readq)
	split($0,readq,"");
	# iterate over each char, find corresponding number from quality array
	#   and get average q for the read (line)
	for(symbol in readq){
		qsum+=phred33[readq[symbol]]	# sum qualities
	}
	lsum+=length($0)					# also sum lengths
}END{
	# print weighted average quality for the fastq file
	print(qsum/lsum);
}' 2> /dev/null

}
export -f getavgqual



#	INPUTS & CHECKS & DEFAULTS
#===============================================================================
# parse args
while getopts "ht:a:i:n:r:o:g:" OPTION
do
	case $OPTION in
		h) usage; exit 1;;
		t) THREADS=$OPTARG;;
		a) AINTERVAL=$OPTARG;;
		i) INDIR=$OPTARG;;
		n) NEGATIVE=$OPTARG;;
		r) REF=$OPTARG;;
		o) OUTDIR=$OPTARG;;
		g) ORGANISMS_FILE=$OPTARG;;
		?) usage; exit;;
	esac
done


# check args
if [[ -z "$THREADS" ]]; then printf "%s\n" "Please specify number of threads (-t)."; exit; fi
if [[ -z "$AINTERVAL" ]]; then AINTERVAL="1"; printf "%s\n" "Analysis interval (-a) set to 1 second default."; fi
if [[ -z "$INDIR" ]]; then printf "%s\n" "Please specify input dir (-i)."; exit; fi
if [[ ! -d "$INDIR" ]]; then printf "%s\n" "The input (-i) $INDIR directory does not exist."; exit; fi
if [[ -z "$NEGATIVE" ]]; then printf "%s\n" "Please specify the 3 barcodes used for the negative control sample (-n)."; exit; fi
# make sure there are 3 and only 3 unique barcodes in the comma separated argument
ntc=$(printf "$NEGATIVE" | sed 's/,/\n/g' | sort | uniq | wc -l)
if [[ "$ntc" != 3 ]]; then
	printf "%s\n" "3 barcodes must be specified for the NTC set, $ntc were provided"
	#exit
fi
# fix formatting (remove white spaces)
negtmp="$NEGATIVE"
NEGATIVE=$(printf "$negtmp" | sed 's/ //g')

if [[ -z "$REF" ]]; then printf "%s\n" "Please specify reference fasta (-r)."; exit; fi
if [[ ! -f "$REF.nhr" ]]; then printf "%s\n" "The reference fasta (-r) has not been indexed with makeblastdb."; exit; fi
if [[ ! -f "$REF.nin" ]]; then printf "%s\n" "The reference fasta (-r) has not been indexed with makeblastdb."; exit; fi
if [[ ! -f "$REF.nsq" ]]; then printf "%s\n" "The reference fasta (-r) has not been indexed with makeblastdb."; exit; fi
if [[ -z "$OUTDIR" ]]; then printf "%s\n" "Please specify an output directory (-o)."; exit; fi
if [[ -d "$OUTDIR" ]]; then printf "%s\n" "The output directory (-o) already exists."; exit; fi
if [[ -z "$ORGANISMS_FILE" ]]; then printf "%s\n" "Please specify the path to the organisms.sh file (-g)."; exit; fi
if [[ ! -f "$ORGANISMS_FILE" ]]; then printf "%s\n" "The specified organisms.sh file (-g) does not exist."; exit; fi

# setup defaults
runtime=$(date +"%Y%m%d%H%M%S%N")
mkdir -p "$OUTDIR/tmp/sort"
#               echo $? (0 = successful execution)
# absolute path to script dir
absolute_path_x="$(readlink -fn -- "$0"; echo x)"
absolute_path_of_script="${absolute_path_x%x}"
scriptdir=$(dirname "$absolute_path_of_script")





#	MAIN
#===============================================================================

# Loads organism definitions from organisms.sh
#source $( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )/organisms.sh
source "$ORGANISMS_FILE"

# don't do anything if barcode dirs do not exist
if [[ $(find "$INDIR" -maxdepth 1 -type d -name "barcode*") == "" ]]; then
	>&2 echo "The input directory (-i) does not contain any barcode folders. Terminating monitor."
	rm -r "$OUTDIR"
	exit
fi
mcount=1
monitorcounts=$(printf "$mcount" | awk -v x="$AINTERVAL" '{print($0*x)}')
echo "$monitorcounts"
# static maxtime at 24 hours (24*60*60 = 86400)
maxtime=86400
while [[ "$maxtime" -ge "$monitorcounts" ]]; do
	# date +%s%N returns unix epoch time in nanoseconds
	start=$(date +%s%N)
	echo "in the loop $monitorcounts"
	mkdir "$OUTDIR/results-at-$monitorcounts-seconds"

	find "$INDIR" -maxdepth 1 -type d -name "barcode*" | sort -V | while read d; do
		echo "$d"
		bc=$(basename "$d")
		wd="$OUTDIR/$bc/analysis-at-$monitorcounts-seconds"
		mkdir -p "$wd"


		find "$d" -name "*.fastq" | sort -V | while read fq; do
			bnfq=$(basename "$fq")
#			echo "$bnfq"
			ln -s "$fq" "$OUTDIR/$bc/$bnfq" 2> /dev/null

#>			# T1. per read alignment thresholds
			# evaluate with blastn script
			bash $scriptdir/align.sh "$OUTDIR/$bc/$bnfq" "$REF" "$THREADS"
			# if output dir from 'align.sh' already exists,
			# analysis for file will be skipped (faster performance)
		done

#>		# T2. per barcode (sample) threshold
		#	aggregate counts per barcode
		#	get total reads per barcode, calc proportion reads per amplicon
		#	if amp_count < 2% of total, is negative [0], else is positive [1]
#		find "$OUTDIR/$bc/align_blastn/" -name "df_all_ref_counts.tsv" -exec cat {} + | awk -F'\t' -v bc="$bc" '{sum[$1]+=$2; total+=$2}END{for(a in sum){if(total==0){printf("%s\t%s\t%s\t%.9f\t%s\n", bc, a, sum[a],"0","0")}else{prop=sum[a]/total; if(prop<0.02){detection=0}else{detection=1}; printf("%s\t%s\t%s\t%.9f\t%s\n", bc, a, sum[a], prop, detection)}}}' | sort -Vk2 > "$wd/bc_amp_count_prop_t2.tsv"
		find "$OUTDIR/$bc/align_blastn/" -name "df_all_ref_counts.tsv" -exec cat {} + | awk -F'\t' -v bc="$bc" '{
			sum[$1]+=$2;
			total+=$2;
		}END{
			for(a in sum){
				if(total==0){
					printf("%s\t%s\t%s\t%.9f\t%s\n", bc, a, sum[a],"0","0");
				}else{
					prop=sum[a]/total;
					if(prop<0.02){
						detection=0;
					}else{
						detection=1;
					};
					printf("%s\t%s\t%s\t%.9f\t%s\n", bc, a, sum[a], prop, detection);
				}
			}
		}' | sort -Vk2 > "$wd/bc_amp_count_prop_t2.tsv"

	done

#>	# T3. per flow cell threshold (based on NTCs)
	# once counts have been aggregated, apply T3 to 'detected' amplicons from T2
	#	for each other barcode (not NTC)
	#	if (NTC amp mean count*3 stdev NTC amp count) > sample amp count...
	#	...amplicon is detected in NTC [1], else is negative in NTC [0] (col8 in '*t2_t3.tsv')
	nwd="$OUTDIR/NTC/analysis-at-$monitorcounts-seconds"
	mkdir -p "$nwd"
	# first get NTC mean and stdev
	npattern=$(printf "$NEGATIVE" | sed 's/,/\\|/g')
	#	concatenate all '*t2.tsv' from NTC samples
	find "$INDIR" -maxdepth 1 -type d -name "barcode*" | sort -V | grep "$npattern" | while read d; do
		bc=$(basename "$d")
		wd="$OUTDIR/$bc/analysis-at-$monitorcounts-seconds"
		cat "$wd/bc_amp_count_prop_t2.tsv"
	done > "$nwd/bc_amp_count_prop_t2.tsv"
    # calc mean/stdev of NTC per amplicon ($3), output 4 col tsv
    #1    NTC
    #2    amplicon name
    #3    NTC amp mean
    #4    NTC amp standard deviation
    # 20220317 - change/fix
    #    instead of using 'cut -f2 "$nwd/bc_amp_count_prop_t2.tsv" | sort | uniq' to the generate
    #        a list of amplicons to iterate over for NTC calculations...
    #    generate list of all amplicons to pull from, as those may be missing in the NTC samples,
    #        which results in generating an empty file
    find "$INDIR" -maxdepth 1 -type d -name "barcode*" | sort -V | while read d; do
        bc=$(basename "$d")
        wd="$OUTDIR/$bc/analysis-at-$monitorcounts-seconds"
        cat "$wd/bc_amp_count_prop_t2.tsv"
    done | cut -f2 | sort | uniq > "$OUTDIR/uniqamp.list"
    while read uniqamp; do
        grep -P "\t$uniqamp\t" "$nwd/bc_amp_count_prop_t2.tsv" | cut -f3 | awk -v uniqamp="$uniqamp" '{x+=$0; y+=$0^2}END{if(NR==0){printf("NTC\t%s\t%.9f\t%.9f\n",uniqamp, 0, 0)}else{mean=x/NR; std=sqrt(y/NR-(x/NR)^2); printf("NTC\t%s\t%.9f\t%.9f\n",uniqamp, mean,std)}}'
    done < "$OUTDIR/uniqamp.list" > "$nwd/ntc_amp_mean_std.tsv"


	find "$INDIR" -maxdepth 1 -type d -name "barcode*" | sort -V | grep -v "$npattern" | while read d; do
		bc=$(basename "$d")
		wd="$OUTDIR/$bc/analysis-at-$monitorcounts-seconds"
		# in comments within awk, the col numbers are for the '*t2_t3.tsv'
		awk -F'\t' '{
			if(NR==FNR){
				# index mean and stdev NTC count per amp
				raw[$2]=$3;
				std[$2]=$4;
				# index actual cutoff value (adjust for T3)
				neg[$2]=$3+(3*$4);
			}else{
				# if detection by T2
				if($5==1){
					if(neg[$2]>$3){
						#col6==1 && col9==1 (likely false positive)
						detection=1; finalcall="negative"
					}else{
						#col6==1 && col9==0
						detection=0; finalcall="positive"
					}
				}else{
					if(neg[$2]>$3){
						#col6==0 && col9==1
						detection=1; finalcall="negative"
					}else{
						#col6==0 && col9==0
						detection=0; finalcall="negative"
					}
				}
				printf("%s\t%s\t%s\t%s\t%s\t%s\t%.9f\t%.9f\t%s\t%s\n", $1,"sample",$2,$3,$4,$5, raw[$2], std[$2], detection, finalcall);
			}
		}' "$nwd/ntc_amp_mean_std.tsv" "$wd/bc_amp_count_prop_t2.tsv" > "$wd/bc_amp_count_prop_t2_t3.tsv"

		# add in placeholder for indicating which barcode is the negative control in plot
		awk -F'\t' '{
			printf("%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\n", $1,"NTC",$2,$3,$4,$5, "NTC", "NTC", "NTC", "NTC");
		}' "$nwd/bc_amp_count_prop_t2.tsv" > "$nwd/bc_amp_count_prop_t2_t3.tsv"

	done

# detection codes: notes about implications of '*t2_t3.tsv' col6 and col8
# the 'true' or 'false' designations are wrt the control
#		condition			finalcall	description
#	if col6==0 && col9==0	negative	amplicon not detected in sample or control
#	if col6==0 && col9==1	negative	amplicon not detected in sample but was detected in control
#	if col6==1 && col9==0	positive	true positive, amplicon detected in sample but not control
#	if col6==1 && col9==1	negative	false positive, amplicon detected in sample and control (NTC threshold > sample count)

	# aggregate barcode results, and replace the plot file (for interface real-time updates)
	#	filter out negative control files, and only get T3 files from latest '$monitorcounts'
	find "$OUTDIR" -type f -name "bc_amp_count_prop_t2_t3.tsv" | sort -V | grep "analysis-at-$monitorcounts-seconds" | while read tsv; do
		cat "$tsv"
	done > "$OUTDIR/plot.tmp"


	# roll up to organism level detection (0 or 1)
	#	org_*.tsv format
	#1	barcode
	#2	org code (from amplicon reference names)
	#3	org full name (hardcoded below)
	#4	detection (1 if all 'org associated amplicons are positive', 0 if not)
	#5	number of organism associated amplicons
	#6	mean org associated amplicon read count

	cut -f1 "$OUTDIR/plot.tmp" | sort | uniq | while read bc; do
		for org_id in "${!ORGANISM_ID[@]}"; do
			org="${ORGANISM_ID[$org_id]}"
			org_name="${ORGANISM_NAME[$org_id]}"

			count=$(grep -P "^$bc\t" "$OUTDIR/plot.tmp" | grep -P "\t$org" | cut -f10 | grep -c 'positive')
			ampcount=$(grep -P "^$bc\t" "$OUTDIR/plot.tmp" | grep -P "\t$org" | wc -l)
			meanrc=$(grep -P "^$bc\t" "$OUTDIR/plot.tmp" | grep -P "\t$org" | cut -f4 | awk '{x+=$0}END{printf("%.0f",x/NR)}')
			if [ ${count} == ${ampcount} ]; then
				d=1
			else
				d=0
			fi

			printf "$bc\t$org\t$org_name\t$d\t$ampcount\t$meanrc\n";
		done
	done > "$OUTDIR/org.tsv"

	# make primary output: plot.tsv
	cat "$OUTDIR/plot.tmp" | while read plot; do
		bc=$(printf "$plot" | cut -f1)
		org=$(printf "$plot" | cut -f3 | sed 's/,.*//')

		# Find the organism name by iterating over the ORGANISM_ID associative array
		org_name=""
		for org_id in "${!ORGANISM_ID[@]}"; do
			if [[ "$org" == "${ORGANISM_ID[$org_id]}" ]]; then
				org_name="${ORGANISM_NAME[$org_id]}"
				break
			fi
		done

		# The rest of the loop remains the same...
		count=$(grep -P "^$bc\t" "$OUTDIR/plot.tmp" | grep -P "\t$org" | cut -f10 | grep -c 'positive')
		ampcount=$(grep -P "^$bc\t" "$OUTDIR/plot.tmp" | grep -P "\t$org" | wc -l)
		meanrc=$(grep -P "^$bc\t" "$OUTDIR/plot.tmp" | grep -P "\t$org" | cut -f4 | awk '{x+=$0}END{printf("%.0f",x/NR)}')
		if [ ${count} == ${ampcount} ]; then
			d=1
		else
			d=0
		fi

		printf "$plot\t$org\t$org_name\t$d\t$ampcount\t$meanrc\n";
	done > "$OUTDIR/plot.tsv"


	# make copies of results
	mv "$OUTDIR/plot.tmp" "$OUTDIR/results-at-$monitorcounts-seconds/"
	cp "$OUTDIR/plot.tsv" "$OUTDIR/results-at-$monitorcounts-seconds/"
	cp "$OUTDIR/org.tsv" "$OUTDIR/results-at-$monitorcounts-seconds/"

	# make copies of results for visualization
    cp "$OUTDIR/plot.tsv" "$OUTDIR/for_vis_plot.tsv"
    cp "$OUTDIR/org.tsv" "$OUTDIR/for_vis_org.tsv"
	cp "$OUTDIR/NTC/analysis-at-$monitorcounts-seconds/ntc_amp_mean_std.tsv" "$OUTDIR/for_vis_ntc.tsv"


	#	only sleep diff between increment and execution time
	end=$(date +%s%N)
	exectime=$(printf "$end" | awk -v s="$start" '{printf("%.9f",($0-s)/1000000000)}')
	echo "stuff took $exectime seconds"
	if [[ $(printf "$exectime" | awk -v i="$AINTERVAL" '{if($0<i){print(1)}else{print(0)}}') == "1" ]]; then
		sleeptime=$(printf "$exectime" | awk -v i="$AINTERVAL" '{printf("%.9f",i-$0)}')
		echo "sleeping for $sleeptime seconds"
		sleep "$sleeptime"
	fi
	((mcount++))
	monitorcounts=$(printf "$mcount" | awk -v x="$AINTERVAL" '{print($0*x)}')

done












