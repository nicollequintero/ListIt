before '/user/:user_id*' do
  p session[:id]
  p params[:user_id]
  redirect '/session' unless session[:id] == params[:user_id].to_i
  @user = User.find(params[:user_id])
end

get '/user/:user_id/list/all' do
  erb :list_index
end
