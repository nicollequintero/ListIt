before '/item*' do
  redirect '/session' unless session[:id]
  @user = User.find(session[:id])
end

post '/item' do
  item = Item.create(description: params[:description], list_id: params[:list].to_i)
  item.to_json
end
