.PHONY: help install dev start build test clean docker-up docker-down db-setup db-migrate db-seed db-studio db-reset

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

install: ## Install dependencies
	npm install

dev: ## Start development server
	npm run start:dev

start: ## Start production server
	npm run start:prod

build: ## Build the application
	npm run build

test: ## Run tests
	npm run test

test-e2e: ## Run e2e tests
	npm run test:e2e

test-cov: ## Run tests with coverage
	npm run test:cov

lint: ## Run linter
	npm run lint

format: ## Format code
	npm run format

docker-up: ## Start Docker services
	docker-compose up -d

docker-down: ## Stop Docker services
	docker-compose down

docker-logs: ## View Docker logs
	docker-compose logs -f

db-setup: ## Complete database setup (generate + migrate + seed)
	npx prisma generate
	npx prisma migrate dev
	npm run prisma:seed

db-generate: ## Generate Prisma Client
	npx prisma generate

db-migrate: ## Run database migrations
	npx prisma migrate dev

db-seed: ## Seed database with test data
	npm run prisma:seed

db-studio: ## Open Prisma Studio
	npx prisma studio

db-reset: ## Reset database (WARNING: deletes all data)
	npx prisma migrate reset

quick-start: install docker-up db-setup ## Complete quick start setup
	@echo "✅ Setup complete! Run 'make dev' to start the server"

clean: ## Clean build artifacts
	rm -rf dist
	rm -rf node_modules
	rm -rf logs/*
	rm -rf uploads/*

restart: docker-down docker-up ## Restart Docker services
	@echo "✅ Docker services restarted"
