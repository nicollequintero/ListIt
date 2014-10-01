class CreateItems < ActiveRecord::Migration
  def change
    create_table :items do |t|
      t.string :description
      t.belongs_to :list
      t.boolean :completed, default: false
      t.timestamps
    end
  end
end
