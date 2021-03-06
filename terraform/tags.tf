locals {
  tags = merge(
    {
      "Name" = format("%s", var.environment)
    },
    {
      "Environment" = format("%s", var.environment)
    },
    var.tags,
  )

  agent_tags = merge(
    {
      "Name" = format("%s", local.name_runner_agent_instance)
    },
    {
      "Environment" = format("%s", var.environment)
    },
    var.tags,
    var.agent_tags
  )

  tags_string = join(",", flatten([
    for key in keys(local.tags) : [key, lookup(local.tags, key)]
  ]))

  runner_tags_string = join(",", flatten([
    for key in keys(var.runner_tags) : [key, lookup(var.runner_tags, key)]
  ]))
}
