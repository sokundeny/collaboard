variable "aws_region" {
  default = "ap-southeast-2"
}

variable "ami_id" {
  type = string
  default = "ami-080076ef6c5abbe50"
}

variable "project_name" {
  default = "project-cloud"
}

variable "vpc_cidr" {
  default = "10.0.0.0/16"
}

variable "public_subnet_cidrs" {
  default = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "private_subnet_cidrs" {
  default = ["10.0.3.0/24", "10.0.4.0/24"]
}

variable "availability_zones" {
  default = ["ap-southeast-2a", "ap-southeast-2b"]
}

variable "instance_type" {
  default = "t3.micro"
}

variable "db_username" {
  default = "admin"
}

variable "db_password" {
  default = "Admin12345!"
}

variable "db_name" {
  default = "projectdb"
}

variable "key_name" {
  description = "AWS EC2 key pair name"
  type        = string
  default     = "TheBestKey"
}