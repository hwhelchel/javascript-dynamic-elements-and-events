get '/' do
  # Look in app/views/index.erb
  erb :index
end

post '/add_todo' do
  return params.to_json
end

delete '/delete_todo' do
  return params.to_json
end

patch '/complete_todo' do
  return params.to_json
end

