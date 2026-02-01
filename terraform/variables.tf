# AWS configuration
variable "common-tags" {
  type        = map(string)
  description = "A set of tags to attach to every created resource."
  default = {
    NAME = "kmertools-wasm"
  }
}

## App config
variable "webapp-name" {
  type        = string
  description = "Name"
  default     = "kmertools-wasm"
}

# Build commands
variable "webapp-dir" {
  type        = string
  description = "Relative path to webapp"
  default     = "../frontend/"
}

variable "install-command" {
  type        = string
  description = "Install command to install requirements"
  default     = "npm install"
}


variable "build-command" {
  type        = string
  description = "Build command to build the webapp"
  default     = "./node_modules/.bin/ng build --configuration production --subresource-integrity"
}

variable "build-destination" {
  type        = string
  description = "Path to built source"
  default     = "../frontend/dist/kmertools-wasm/browser/"
}