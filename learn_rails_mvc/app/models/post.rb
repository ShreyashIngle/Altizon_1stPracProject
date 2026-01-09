class Post
  include Mongoid::Document
  include Mongoid::Timestamps

  include Elasticsearch::Model
  include Elasticsearch::Model::Callbacks

  include Notificationable  # ✅ Include for real-time notifications


  field :title, type: String
  field :body,  type: String

  index_name "posts"

  settings index: { number_of_shards: 1 } do
    mappings dynamic: false do
      indexes :title, type: :text, analyzer: :english
      indexes :body,  type: :text, analyzer: :english
    end
  end

  def as_indexed_json(_options = {})
    {
      title: title,
      body: body
    }
  end

  def self.search_query(query)
    __elasticsearch__.search(
      {
        query: {
          multi_match: {
            query: query,
            fields: %w[title body]
          }
        }
      }
    )
  end
end
