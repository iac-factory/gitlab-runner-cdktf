data "aws_iam_policy" "s3" {
  name = "AmazonS3FullAccess"
}

data "aws_iam_policy" "sqs" {
  name = "AmazonSQSFullAccess"
}

data "aws_iam_policy" "ssm" {
  name = "AmazonSSMManagedInstanceCore"
}

data "aws_iam_policy" "ec2" {
  name     = "AmazonEC2FullAccess"
}

data "aws_iam_policy" "cloud-watch" {
  name = "CloudWatchAgentServerPolicy"
}

