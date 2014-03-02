get '/' do
  # Look in app/views/index.erb
  erb :index
end

post '/add_todo' do
  p params
  return params.to_json
end

