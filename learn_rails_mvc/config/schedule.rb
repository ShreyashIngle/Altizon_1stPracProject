# example:
#
# set :output, "/path/to/my/cron_log.log"
#
# every 2.hours do
#   command "/usr/bin/some_great_command"
#   runner "MyModel.some_method"
#   rake "some:great:rake:task"
# end
#
# every 4.days do
#   runner "AnotherModel.prune_old_records"
# end

# Learn more: http://github.com/javan/whenever

env :PATH, "/home/test/.rvm/gems/ruby-3.2.2/bin:/home/test/.rvm/gems/ruby-3.2.2@global/bin:/home/test/.rvm/rubies/ruby-3.2.2/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/snap/bin:/snap/bin:/home/test/.rvm/bin"
env :GEM_PATH, "/home/test/.rvm/gems/ruby-3.2.2:/home/test/.rvm/gems/ruby-3.2.2@global"
env :GEM_HOME, "/home/test/.rvm/gems/ruby-3.2.2"

set :output, "log/cron.log"
set :environment, "development"

# Use bin/rake instead of bundle exec rake
job_type :rake, "cd :path && :environment_variable=:environment bin/rake :task --silent :output"

every 10.minute do
  rake "sidekiq_logs:clear_old_logs"
end
