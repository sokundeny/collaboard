variable "project_name" {}
variable "s3_bucket_arn" {}
variable "instance_type" { default = "t3.micro" }
variable "ami_id" { default = "ami-080076ef6c5abbe50" }
variable "subnet_ids" { type = list(string) }
variable "security_group_ids" { type = list(string) }
variable "app_repo_url" {}
variable "key_name" {
  description = "The name of the EC2 key pair to use for SSH access"
  type        = string
}