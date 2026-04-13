variable "project_name" {}
variable "instance_type" {}
variable "public_subnet_ids" {}
variable "vpc_id" {}
variable "target_group_arn" {}
variable "iam_instance_profile" {}
variable "security_group_id" {}
variable "launch_template_id" {
  description = "Launch template ID for the ASG"
  type        = string
}