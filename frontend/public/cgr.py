import pykmertools as pkt
from Bio import SeqIO
import gzip


def vectorise_from_files(file_paths: list[str], vecsize: int) -> str:
    print(f"Computing CGR sequences from files: {file_paths} with k={vecsize}")
    cgr_counter = pkt.CgrComputer(vecsize)
    vectors = []

    for file_path in file_paths:
        for record in SeqIO.parse(file_path, "fasta"):
            vector = cgr_counter.vectorise_one(str(record.seq))
            vectors.append({"file": file_path, "id": record.id, "vector": vector})
    return vectors

if __name__ == "__main__":
    import sys

    input_files = sys.argv[1].split(",")
    vecsize = int(sys.argv[2])
    vectors = vectorise_from_files(input_files, vecsize)

    for vector in vectors:
        print(f">{vector['id']}\n{' '.join(map(str, vector['vector']))}")