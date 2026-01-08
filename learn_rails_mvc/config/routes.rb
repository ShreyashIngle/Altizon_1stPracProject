Rails.application.routes.draw do
  # Posts with search
  resources :posts do
    collection do
      get :search
    end
  end

  # Books with search
  resources :books do
    collection do
      get :search
    end
  end

  # Articles with search
  resources :articles do
    collection do
      get :search
    end
  end

  # Health check
  get "up" => "rails/health#show", as: :rails_health_check
end
