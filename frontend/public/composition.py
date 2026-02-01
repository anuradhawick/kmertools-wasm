import pykmertools as pkt
from Bio import SeqIO
import gzip


def vectorise_from_files(file_paths: list[str], k: int) -> str:
    print(f"Vectorising sequences from files: {file_paths} with k={k}")
    kmer_counter = pkt.OligoComputer(k)
    vectors = []

    for file_path in file_paths:
        for record in SeqIO.parse(file_path, "fasta"):
            vector = kmer_counter.vectorise_one(str(record.seq))
            vectors.append({'file': file_path, 'id': record.id, 'vector': vector})

    return {'header': kmer_counter.get_header(), 'vectors': vectors}


if __name__ == "__main__":
    import sys

    input_files = sys.argv[1].split(",")
    k = int(sys.argv[2])
    vectors = vectorise_from_files(input_files, k)

    for seq_id, vector in vectors:
        print(f">{seq_id}\n{' '.join(map(str, vector))}")
