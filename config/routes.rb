RailsApp::Application.routes.draw do
  resources :users, :user_settings, :sessions, :post_types

  resources :photos do
    resources :photo_copyrights
    member do
      get :copy_temp
      get :copy_protect
    end
  end

  resources :posts do
    resources :photos
    collection do
      get 'select_post_type'
    end
    member do
      get 'publish'
      get 'unpublish'
    end
  end

  root to: "static_pages#home"
  match '/signin', to: "sessions#new"
  match '/signout', to: "sessions#destroy"
  match '/signup', to: "users#new"
  match '/password_reset', to: "users#password_reset"
  match '/settings', to: "user_settings#edit"
  match '/update_copy_notice', to: "photo_copyrights#update_default_copyright"
  match '/backup', to: "Users#backup"
  match '/restore', to: "Users#restore"
  match ':id', to:"posts#index"
end
