class Book
  include Mongoid::Document
  include Mongoid::Timestamps

  include Elasticsearch::Model
  include Elasticsearch::Model::Callbacks

  field :title,       type: String
  field :author,      type: String
  field :description, type: String

  index_name "books"

  settings index: { number_of_shards: 1 } do
    mappings dynamic: false do
      indexes :title,       type: :text, analyzer: :english
      indexes :author,      type: :text, analyzer: :english
      indexes :description, type: :text, analyzer: :english
    end
  end

  def as_indexed_json(_options = {})
    {
      title: title,
      author: author,
      description: description
    }
  end

  def self.search_query(query)
    __elasticsearch__.search(
      {
        query: {
          multi_match: {
            query: query,
            fields: %w[title author description]
          }
        }
      }
    )
  end
end
