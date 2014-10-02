get '/user/:user_id/list/all' do
  erb :list_index
end

get '/user/:user_id/list/:list_id' do
  @list = List.find(params[:list_id])
  erb :display_list, :layout => :fetch_list_layout
end

get '/user/:user_id/list' do
  erb :create_list
end

post '/user/:user_id/list' do
  p params
  list = List.create(user: @user, name: params[:name])
  p list
  list.to_json
end

get '/user/1/list/1' do
	  @list = List.find(params[:list_id])
  list.to_json
end

get '/user/:user_id/list/:list_id/data' do 
  @list = List.find(params[:list_id])
  {list: @list, items: @list.items}.to_json
end

delete '/user/:user_id/list/:list_id' do 
  @list = List.find(params[:list_id])
  @list.delete
  redirect "/user/#{@user.id}/list/all"
end