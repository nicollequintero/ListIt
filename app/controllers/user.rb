before '/user/:user_id*' do
  p session[:id]
  p params[:user_id]
  redirect '/session' unless session[:id] == params[:user_id].to_i
  @user = User.find(params[:user_id])
end

get '/user' do
  if session[:error]
    @error = session[:error]
    p @error
    session[:error] = nil
  end
  erb :create_user
end

post '/user' do

  user = User.create(params[:user])
  # user = User.new(params[:user])
  # if user.valid?
  #   user.save;
  #   redirect '/session' unless request.xhr?
  # else
  #   if request.xhr?
  #     {error: user.errors.messages}.to_json
  #   else
  #     session[:error] = user.errors.messages
  #     redirect '/user'
  #   end
  # end

end
