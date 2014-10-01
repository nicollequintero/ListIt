before '/item*' do
  redirect '/session' unless session[:id]
  @user = User.find(session[:id])
end

post '/item' do
  item = Item.create(description: params[:description], list_id: params[:list].to_i)
  item.to_json
end

put '/item' do
  item = Item.find(params[:id])
  item.update(description: params[:description])
  item.to_json
end

delete '/item' do
  item = Item.find(params[:id])
  list = item.list
  puts "*" * 30
  p "ITEM TO DELETE"
  puts "*" * 30
  p item
  item.delete
  p list.items
end
