before '/item*' do
  redirect '/session' unless session[:id]
  @user = User.find(session[:id])
end

post '/item' do
  p params
  item = Item.create(description: params[:description], list_id: params[:list].to_i)
  p item
end
