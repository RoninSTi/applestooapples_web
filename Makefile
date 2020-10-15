set-prod-environment:
	heroku config:set REACT_APP_API_URL=https://api.sipstir.app/ && \
	heroku config:set REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_51GxGm9BLR3Udnav9uSY5jUPSSpJ5ucaRotFTFexD5so0eaO5RBlvYfVUBgBZCI0NtA6i83zKLXQF28ydmvXwmcyW000cQ0Id08 && \
	heroku config:set REACT_APP_GOOGLE_PLACE_API_KEY=AIzaSyBTTjWmcEQzb9xWo02nbND_-CiAJf-0-E0

set-staging-environment:
	heroku config:set REACT_APP_API_BASE_URL=https://applestooapples-api-staging.herokuapp.com/

deploy-prod:
	git push prod master

deploy-staging:
	git push staging master

prod: set-prod-environment deploy-prod

staging: set-staging-environment deploy-staging