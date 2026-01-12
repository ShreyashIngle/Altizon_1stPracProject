# namespace :sidekiq do
#   desc "Remove sidekiq logs older than 2 minutes"
#   task clear_old_logs: :environment do
#     log_file = Rails.root.join('log', 'sidekiq_json.log')
    
#     unless File.exist?(log_file)
#       puts "Log file #{log_file} does not exist."
#       next
#     end

#     threshold = 1.minutes.ago

#     # We read the file, filter lines, and write back.
#     # Lines are assumed to be JSON with a 'created_at' or 'timestamp' field.
#     # Looking at the filename 'sidekiq_json.log', it's likely JSON formatted.
    
#     temp_file = "#{log_file}.tmp"
    
#     begin
#       File.open(temp_file, 'w') do |out|
#         File.foreach(log_file) do |line|
#           begin
#             data = JSON.parse(line)
#             # Sidekiq JSON logs usually have '@timestamp' or 'created_at'
#             # Let's check common keys: '@timestamp', 'timestamp', 'created_at'
#             timestamp_str = data['@timestamp'] || data['timestamp'] || data['created_at']
            
#             if timestamp_str
#               timestamp = Time.parse(timestamp_str)
#               out.puts(line) if timestamp >= threshold
#             else
#               # If no timestamp found, keep the line to be safe or ignore? 
#               # Let's keep it if we can't parse it to avoid data loss of modern logs.
#               out.puts(line)
#             end
#           rescue JSON::ParserError
#             # If line is not JSON, we might want to keep it or ignore.
#             # Usually these logs are strictly JSON.
#             out.puts(line)
#           rescue => e
#             puts "Error processing line: #{e.message}"
#             out.puts(line)
#           end
#         end
#       end
      
#       File.rename(temp_file, log_file)
#       puts "Sidekiq logs cleared. Kept entries from the last minute(s)."
#     ensure
#       File.delete(temp_file) if File.exist?(temp_file)
#     end
#   end
# end


namespace :sidekiq_logs do
  desc "Clear development and sidekiq logs older than 10 minutes"
  task clear_old_logs: :environment do
    logs = {
      Rails.root.join("log/development.log") => :plain,
      Rails.root.join("log/sidekiq_json.log") => :json
    }

    threshold = 10.minutes.ago

    logs.each do |log_file, type|
      unless File.exist?(log_file)
        puts "Skipping missing log: #{log_file}"
        next
      end

      temp_file = "#{log_file}.tmp"

      File.open(temp_file, "w") do |out|
        File.foreach(log_file) do |line|
          begin
            keep = case type
            when :json
              data = JSON.parse(line)
              ts = data["@timestamp"] || data["timestamp"] || data["created_at"]
              ts ? Time.parse(ts) >= threshold : true

            when :plain
              # development.log has no timestamps per line
              # best safe approach: truncate whole file by time
              false
            end

            out.puts(line) if keep
          rescue
            out.puts(line)
          end
        end
      end

      if type == :plain
        # truncate development.log safely
        File.truncate(log_file, 0)
        puts "Cleared development.log completely"
      else
        File.rename(temp_file, log_file)
        puts "Cleaned sidekiq_json.log"
      end

      File.delete(temp_file) if File.exist?(temp_file)
    end
  end
end
