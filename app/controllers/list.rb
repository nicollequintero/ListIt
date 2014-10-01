get '/user/:user_id/list/all' do
  erb :list_index
end

get '/user/:user_id/list/:list_id' do
  @list = List.find(params[:list_id])
  #add erb later
end

get '/user/:user_id/list' do
  erb :create_list
end
