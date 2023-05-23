build:
	docker build -t telegram_bot .

run:
	docker run -d -p 3000:3000 --name telegram_bot --rm telegram_bot

stop:
	docker stop telegram_bot