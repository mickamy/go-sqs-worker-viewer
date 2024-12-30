.PHONY: \
	build \
	up \
	up-d \
	down \
	down-v \
	lint \
	format \
	tsc \
	pre-commit \
	help \

build: ## Build the Docker images as specified in the compose.yaml file
	docker compose build

up: down ## Start the Docker containers, ensuring any running containers are stopped first
	docker compose up

up-d: down ## Start the Docker containers in detached mode, ensuring any running containers are stopped first
	docker compose up -d

down: ## Stop and remove the Docker containers
	docker compose down

down-v: ## Stop and remove the Docker containers, including associated volumes
	docker compose down --volumes

format: ## Format the codebase
	npm run format

lint: ## Lint the codebase
	npm run lint

tsc: ## Run the TypeScript compiler
	npm run typecheck

pre-commit: format lint tsc ## Format, lint, and compile the codebase
	@echo "Pre-commit checks passed"

help: ## Display a list of available Makefile targets with their descriptions
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'
