class Item < ActiveRecord::Base
  belongs_to :list
  has_one :user, through: :list
end
