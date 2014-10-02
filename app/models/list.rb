class List < ActiveRecord::Base
  belongs_to :user
  has_many :items

  def status
  	status_groups = self.items.group_by { |item| item.completed }
  	
  	if (status_groups[false] && status_groups[true])
  	  return "#{status_groups[true].count} completed out of #{self.items.length}"
  	elsif (status_groups[false])
  	  return "All items incomplete"
  	else
  	  return "All done"
  	end

  end
end
