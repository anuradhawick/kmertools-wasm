# Kmertools-WASM

A web-based bioinformatics application that runs **kmertools** (a Rust-based genomic analysis library) entirely in the browser using WebAssembly. This project demonstrates how to compile a Rust library to WebAssembly using the `wasm32-unknown-emscripten` toolchain and run it via Pyodide in a modern Angular frontend.

## 🧬 What is Kmertools?

[Kmertools](https://github.com/anuradhawick/kmertools) is a high-performance Rust library for k-mer analysis of genomic sequences. It provides tools for:

- **K-mer counting and vectorisation** - Compute oligonucleotide frequency vectors
- **Chaos Game Representation (CGR)** - Visualise DNA sequences as 2D scatter plots

## 🚀 What I've Done

### 1. Compiled Rust to WebAssembly (Emscripten)

The core achievement of this project is compiling the **pykmertools** Rust library (Python bindings for kmertools) using the `wasm32-unknown-emscripten` target. This produces a wheel file:

```
pykmertools-0.2.1-cp39-abi3-emscripten_4_0_9_wasm32.whl
```

This wheel is compatible with **Pyodide** (Python running in WebAssembly), allowing the Rust library's performance to be leveraged directly in the browser without any server-side computation.

### 2. In-Browser Python Execution with Pyodide

The application uses [Pyodide](https://pyodide.org/) (v0.29.3) to run Python code in the browser. The workflow:

1. Load Pyodide runtime from CDN
2. Install the custom `pykmertools` WASM wheel
3. Install BioPython for FASTA file parsing
4. Execute Python scripts that use the Rust-powered kmertools library
5. Return results to Angular for visualisation

### 3. Angular Frontend with Interactive Visualisations

Built a modern Angular 21 application featuring:

- **File upload** - Drag & drop FASTA files for analysis
- **K-mer Composition Visualisation** - Line charts showing oligonucleotide frequencies across sequences
- **CGR (Chaos Game Representation)** - Scatter plots visualising DNA sequence composition
- **PrimeNG UI components** with Tailwind CSS styling
- **ECharts** for interactive data visualisation

### 4. Infrastructure as Code (Terraform)

Complete AWS deployment infrastructure:

- **S3** - Static website hosting
- **CloudFront** - CDN with HTTP/2 and HTTP/3 support
- **ACM** - SSL certificate management
- Automated build and deployment scripts

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser                               │
├─────────────────────────────────────────────────────────────┤
│  Angular 21 Frontend                                         │
│  ├── File Upload (FASTA files)                              │
│  ├── Parameter Configuration (k-mer size, vector size)     │
│  └── Visualisation (ECharts - Line/Scatter plots)          │
├─────────────────────────────────────────────────────────────┤
│  Pyodide (Python in WebAssembly)                            │
│  ├── BioPython (FASTA parsing)                              │
│  └── pykmertools (Rust → WASM)                              │
│      ├── OligoComputer (k-mer frequency vectors)           │
│      └── CgrComputer (Chaos Game Representation)            │
└─────────────────────────────────────────────────────────────┘
```

## 📁 Project Structure

```
kmertools-wasm/
├── frontend/                    # Angular application
│   ├── src/
│   │   └── app/
│   │       ├── pages/           # Main application pages
│   │       │   ├── composition-visualisation-by-kmers/
│   │       │   └── composition-visualisation-by-cgr/
│   │       ├── components/      # Reusable UI components
│   │       └── services/        # Angular services
│   └── public/
│       ├── pykmertools-*.whl    # Compiled WASM wheel
│       ├── composition.py       # K-mer analysis script
│       ├── cgr.py               # CGR computation script
│       └── *.fasta              # Sample FASTA files
└── terraform/                   # AWS infrastructure
    ├── main.tf
    ├── cloudfront-s3.tf
    ├── s3.tf
    └── variables.tf
```

## 🛠️ Development

### Prerequisites

- Node.js 20+
- npm 11+

### Setup

```bash
cd frontend
npm install
npm start
```

The application will be available at `http://localhost:4200`

### Building

```bash
npm run build
```

### Testing

```bash
npm run test
```

## 🔬 Features

### K-mer Composition Analysis

Upload multiple FASTA files and compute oligonucleotide frequency vectors:

- Select k-mer size (1-8)
- Compare composition across multiple sequences
- Interactive line charts for frequency comparison

### Chaos Game Representation (CGR)

Visualise DNA sequences as 2D fractal patterns:

- Select vector size for resolution
- Scatter plot visualisation
- Compare patterns across multiple sequences

## 🌐 Deployment

The application is deployed to AWS using Terraform:

```bash
cd terraform
terraform init
terraform apply
```

This creates:
- S3 bucket for static hosting
- CloudFront distribution with HTTPS
- Proper caching and error handling for SPA routing

## 🔧 Technical Details

### WASM Compilation

The pykmertools wheel was compiled using:

- **Target**: `wasm32-unknown-emscripten`
- **Emscripten SDK**: Version compatible with Pyodide 0.29.3
- **Python ABI**: `cp39-abi3` (stable ABI)

### Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| Angular | 21.1.x | Frontend framework |
| Pyodide | 0.29.3 | Python in WASM |
| pykmertools | 0.2.1 | Rust k-mer library |
| BioPython | latest | FASTA parsing |
| ECharts | 6.0.0 | Data visualisation |
| PrimeNG | 21.1.x | UI components |

## 📜 License

GPL-3.0 License

## 🙏 Acknowledgements

- [kmertools](https://github.com/anuradhawick/kmertools) - The original Rust library
- [Pyodide](https://pyodide.org/) - Python scientific stack in WebAssembly
- [maturin](https://www.maturin.rs/) - Build and publish Rust crates as Python packages
