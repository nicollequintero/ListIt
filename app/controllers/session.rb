get '/session' do
  if session[:error]
    @error = session[:error]
    session[:error] = nil
  end
  erb :login
end

post '/session' do
  user = User.find_by(username: params[:username]).try(:authenticate, params[:password])
  if user
    session[:id] = user.id
    redirect "user/#{user.id}/list/all"
  else
    session[:error] = "Login Failed. Please try again."
    redirect '/session'
  end
end
