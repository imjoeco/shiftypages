module ApplicationHelper
	def full_title(title)
		if title.empty?
			if settings && !settings.slogan.empty?
				"#{settings.title} | #{settings.slogan}"
			elsif settings
				settings.title
      else
        "New Site"
			end
		else
			"#{title} | #{settings.title}"
		end
	end
end
