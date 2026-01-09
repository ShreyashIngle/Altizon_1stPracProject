class NotificationJob
  include Sidekiq::Job

  def perform(payload)
    ActionCable.server.broadcast("notifications", payload)
  end
end
