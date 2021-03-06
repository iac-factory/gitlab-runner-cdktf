echo 'installing additional software for logging'
# installing in a loop to ensure the cli is installed.
for i in {1..7}
do
  echo "Attempt: ---- " $i
  yum install -y aws-cli awslogs jq && break || sleep 60
done

# Inject the CloudWatch Logs configuration file contents
cat > /etc/awslogs/awslogs.conf <<- EOF
[general]
state_file = /var/lib/awslogs/agent-state

[/var/log/dmesg]
file = /var/log/dmesg
log_stream_name = {instanceId}/dmesg
log_group_name = ${log_group_name}
initial_position = start_of_file

[/var/log/messages]
file = /var/log/messages
log_stream_name = {instanceId}/messages
log_group_name = ${log_group_name}
datetime_format = %b %d %H:%M:%S
initial_position = start_of_file

[/var/log/user-data.log]
file = /var/log/user-data.log
log_stream_name = {instanceId}/user-data
log_group_name = ${log_group_name}
initial_position = start_of_file

EOF

# Set the region to send CloudWatch Logs data to (the region where the instance is located)
region=$(curl -s -H "X-aws-ec2-metadata-token: $token" http://169.254.169.254/latest/dynamic/instance-identity/document | jq -r .region)
sed -i -e "s/region = us-east-1/region = $region/g" /etc/awslogs/awscli.conf

# Replace instance id.
instanceId=$(curl -s -H "X-aws-ec2-metadata-token: $token" http://169.254.169.254/latest/dynamic/instance-identity/document | jq -r .instanceId)
sed -i -e "s/{instanceId}/$instanceId/g" /etc/awslogs/awslogs.conf

if grep -q ':2$' /etc/system-release-cpe  ; then
  # AWS Linux 2 renamed the awslogs service to awslogsd and uses systemd
  systemctl enable awslogsd
  systemctl start awslogsd
else
  service awslogs start
  chkconfig awslogs on
fi
