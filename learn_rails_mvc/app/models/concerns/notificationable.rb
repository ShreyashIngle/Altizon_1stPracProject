# app/models/concerns/notificationable.rb
module Notificationable
  extend ActiveSupport::Concern

  included do
    after_create_commit  -> { notify("#{self.class.name} created: #{title}") if respond_to?(:title) }
    after_update_commit  -> { notify("#{self.class.name} updated: #{title}") if respond_to?(:title) }
    after_destroy_commit -> { notify("#{self.class.name} deleted: #{title}") if respond_to?(:title) }
  end

  private

  def notify(message)
    NotificationJob.perform_async(
      {
        "model" => self.class.name,
        "message" => message,
        "id" => id.to_s,
        "at" => Time.current.strftime("%H:%M:%S")
      }
    )
  end
end
