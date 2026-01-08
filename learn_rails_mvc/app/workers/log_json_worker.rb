# app/workers/log_json_worker.rb
class LogJsonWorker
  include Sidekiq::Worker

  LOG_FILE = Rails.root.join("log", "sidekiq_json.log")

  def perform(resource_type, data)
    json_entry = {
      timestamp: Time.current,
      resource: resource_type,
      data: data
    }

    # Log to Rails logger
    Rails.logger.info "[Sidekiq] #{resource_type}: #{data}"

    # Append to file in JSON lines format
    File.open(LOG_FILE, "a") do |file|
      file.puts(json_entry.to_json)
    end
  end
end
