#!/bin/bash
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
usage()
{
cat << EOF
 usage:
bash /data/apps/src/blastn.sh \$1 \$2 \$3 \$4
\$1 - input fastfile (format is checked, but blastn only takes fasta)
\$2 - reference fasta
\$3 - threads
\$4 - reference threshold (identity and length cutoffs)

example:
input="/data/seqdata/phase2/initial_analyses/NB_BA-R9/fastq/9.fastq"
REF="/data/refdata/phase2/amplicons/blastdb_all_amplicons"
refThresh="90"
bash /data/apps/src/blastn.sh "\$input" "\$REF" "\$THREADS" "\$refThresh"

EOF
}
if [[ "$1" == "" ]]; then usage; exit; fi
if [[ "$2" == "" ]]; then usage; exit; fi
if [[ "$3" == "" ]]; then usage; exit; fi
if [[ "$4" == "" ]]; then usage; exit; fi

input="$1"
REF="$2"
THREADS="$3"
refThresh="$4"

# make other variables and directories
base=$(basename "$input" | sed 's/\.f.*//')
ref_base=$(basename "$REF" | sed 's/\.f.*//')
indir=$(dirname "$input")
workdir="$indir/align_blastn/$base-V-$ref_base"

if [[ -d "$workdir" ]]; then
	echo "$workdir already exists, skipping"
	exit
fi

mkdir -p "$workdir"

# NOTE: could be >1 output line per sequence
#	convert fastq input to fasta 'on the fly'
blast6()
{
	bn=$(basename "$1")
	# check format
	if [[ $(head -c1 "$1") == "@" ]]; then
		blastn -num_threads 1 -db "$REF" -query <(sed -n '1~4s/^@/>/p;2~4p' "$1" 2> /dev/null) -outfmt 6 > "$workdir/blast_out/$bn.b6" 2> /dev/null
	elif [[ $(head -c1 "$1") == ">" ]]; then
		blastn -num_threads 1 -db "$REF" -query "$1" -outfmt 6 > "$workdir/blast_out/$bn.b6" 2> /dev/null
	else
		echo "$1 is not in fasta/q format"
	fi
}
export REF workdir
export -f blast6

# split fastq into 100,000 seqs per file
mkdir -p "$workdir/split"
mkdir -p "$workdir/blast_out"

if [[ "$input" == *.gz ]]; then
	gunzip -c "$input" | split -l 400000 - "$workdir/split/seq-"
else
	split -l 400000 "$input" "$workdir/split/seq-"
fi

if [[ ! -f "$workdir/parallel.blast.complete" ]]; then
	find "$workdir/split" -name "seq-*" > "$workdir/parallel.blast"
	parallel --arg-file "$workdir/parallel.blast" --jobs="$THREADS" blast6
	touch "$workdir/parallel.blast.complete"
fi

#	FILTER 1
# filter b6 for best hit per seq (based on identity $3)
cat "$workdir/blast_out/"*.b6 | awk -F'\t' '{tmp[$1]=$3; if(arr[$1]==""){arr[$1]=$3; filtered[$1]=$0}else{if($3>arr[$1]){filtered[$1]=$0}}}END{for(h in filtered){print(filtered[h])}}' > "$workdir/$base.b6"

#	FILTER 2
# filter on identity and alignment length based on refThresh
awk -F'\t' -v thresh="$refThresh" '{if(NR==FNR){ref[$1]=length($2)}else{if($3>=thresh){if($4>=(thresh/100*ref[$2])){print($0)}}}}' <(sed $'$!N;s/\\\n/\t/' "$REF.fasta" 2> /dev/null | sed 's/^>//') "$workdir/$base.b6" > "$workdir/$base.filter2.b6"

# counts for specific references
cut -f2 "$workdir/$base.filter2.b6" | sort | uniq -c | sed -e 's/^ \+//' -e 's/ /\t/' | awk -F'\t' '{printf("%s\t%s\n",$2,$1)}' > "$workdir/rname_count.tsv"

# total reads, 'mapped', and 'unmapped'
reads_total=$(awk 'END{printf("%s",NR/4)}' "$input")
reads_mapped=$(cut -f2 "$workdir/rname_count.tsv" | awk '{x+=$0}END{printf("%s",x)}')
reads_unmapped=$(printf "$reads_total" | awk -v mapped="$reads_mapped" '{printf("%s",$0-mapped)}')
printf "datatype\trname\tcount\n" > "$workdir/df_rname_count.tsv"
printf "totals\treads_total\t$reads_total\n" >> "$workdir/df_rname_count.tsv"
printf "totals\treads_mapped\t$reads_mapped\n" >> "$workdir/df_rname_count.tsv"
printf "totals\treads_unmapped\t$reads_unmapped\n" >> "$workdir/df_rname_count.tsv"
# mapped/classified as specific 'references'
awk '{printf("%s\t%s\n","references",$0)}' "$workdir/rname_count.tsv" >> "$workdir/df_rname_count.tsv"

# get headers, get counts of mapped reads per header
grep "^>" "$REF.fasta" | sort -V | sed -e 's/^>//' -e 's/ .*//' | while read r1; do
	ref_count=$(grep -P "^$r1\t" "$workdir/rname_count.tsv" | cut -f2)
	if [[ "$ref_count" == "" ]]; then
		ref_count="0"
	fi
	printf "%s\t%s\n" "$r1" "$ref_count"
done > "$workdir/df_all_ref_counts.tsv"

# clean up
rm -rf "$workdir/blast_out"
rm -rf "$workdir/split"
