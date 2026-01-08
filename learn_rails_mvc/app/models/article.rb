class Article
  include Mongoid::Document
  include Mongoid::Timestamps

  include Elasticsearch::Model
  include Elasticsearch::Model::Callbacks

  field :title, type: String
  field :content, type: String

  index_name "articles"

  settings index: {
    number_of_shards: 1
  } do
    mappings dynamic: false do
      indexes :title,   type: :text, analyzer: :english
      indexes :content, type: :text, analyzer: :english
    end
  end

  # 🔍 SEARCH METHOD (ADD THIS AT THE BOTTOM)
  def self.search_query(query)
    __elasticsearch__.search(
      {
        query: {
          multi_match: {
            query: query,
            fields: %w[title content]
          }
        }
      }
    )
  end

  def as_indexed_json(_options = {})
  {
    title: title,
    content: content
  }
  end

end
