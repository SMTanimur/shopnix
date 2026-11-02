# ==============================================================================
# SHOPNIX — ECOMMERCE OPERATIONS & BUSINESS MANAGEMENT SAAS
# Enterprise Makefile for Local Development, Docker, Testing & Logging
# Cross-Platform Compatible (Windows, Linux, macOS)
# ==============================================================================

.DEFAULT_GOAL := help
.PHONY: help install clean fresh dev dev-api dev-web \
        docker-up docker-down docker-build docker-restart docker-logs docker-logs-all docker-ps docker-shell docker-mongo docker-redis \
        build build-api build-web typecheck test test-watch lint \
        logs-api logs-error logs-controllers logs-controller logs-clear

# ------------------------------------------------------------------------------
# HELP & DOCUMENTATION
# ------------------------------------------------------------------------------
help: ## Display this help menu with all available commands
	@echo.
	@echo ================================================================================
	@echo   SHOPNIX COMMAND CENTER
	@echo ================================================================================
	@echo.
	@echo Development ^& Local Runtime:
	@echo   make dev              - Run both Backend API (8000) and Frontend Web (5000)
	@echo   make dev-api          - Run NestJS API on port 8000 with watch mode
	@echo   make dev-web          - Run Next.js Web on port 5000
	@echo.
	@echo Docker Backend ^& Database (with Hot Reload):
	@echo   make docker-up        - Start Docker Backend API, MongoDB 8, and Redis
	@echo   make docker-down      - Stop all Docker containers
	@echo   make docker-build     - Rebuild Docker Backend image (without cache)
	@echo   make docker-restart   - Restart the Backend API container
	@echo   make docker-logs      - Tail live Backend API Docker logs
	@echo   make docker-logs-all  - Tail logs from all Docker containers
	@echo   make docker-ps        - List status of all Shopnix containers
	@echo   make docker-shell     - Open interactive shell inside API container
	@echo   make docker-mongo     - Open mongosh shell inside MongoDB container
	@echo   make docker-redis     - Open redis-cli inside Redis container
	@echo.
	@echo Build ^& Quality Assurance:
	@echo   make build            - Build all workspaces using Turborepo
	@echo   make build-api        - Build NestJS API for production
	@echo   make build-web        - Build Next.js Web for production
	@echo   make typecheck        - Run strict TypeScript check across all packages
	@echo   make test             - Run unit ^& schema tests (Vitest)
	@echo   make test-watch       - Run tests in interactive watch mode
	@echo   make lint             - Run linter across all workspaces
	@echo.
	@echo Logs ^& Auditing (Per-Controller ^& Central API):
	@echo   make logs-api         - Inspect central API request/response log
	@echo   make logs-error       - Inspect error and exception log
	@echo   make logs-controllers - List all per-controller log files
	@echo   make logs-controller  - View specific controller log (e.g. make logs-controller name=orders)
	@echo   make logs-clear       - Clear all generated log files
	@echo.
	@echo Setup ^& Maintenance:
	@echo   make install          - Install dependencies with Bun
	@echo   make clean            - Remove dist, .turbo, .next, and build caches
	@echo   make fresh            - Clean and reinstall all dependencies
	@echo ================================================================================
	@echo.

# ------------------------------------------------------------------------------
# DEPENDENCIES & CLEANUP
# ------------------------------------------------------------------------------
install: ## Install dependencies using Bun
	bun install

clean: ## Clean build artifacts, caches, and output directories
	bun -e "const fs = require('fs'); ['apps/api/dist', 'apps/web/.next', '.turbo', 'apps/api/.turbo', 'apps/web/.turbo', 'packages/types/.turbo', 'packages/schemas/.turbo', 'packages/utils/.turbo', 'packages/api-client/.turbo'].forEach(p => fs.rmSync(p, { recursive: true, force: true })); console.log('Clean completed.');"

fresh: clean install ## Perform clean install of all dependencies

# ------------------------------------------------------------------------------
# LOCAL RUNTIME (OUTSIDE DOCKER)
# ------------------------------------------------------------------------------
dev: ## Run full stack locally (API on 8000, Web on 5000)
	bun run dev

dev-api: ## Run API locally on port 8000 with live watch reload
	bun --filter api dev

dev-web: ## Run Web frontend locally on port 5000
	bun --filter web dev

# ------------------------------------------------------------------------------
# DOCKER (BACKEND API, MONGODB & REDIS WITH LIVE HOT-RELOAD)
# ------------------------------------------------------------------------------
docker-up: ## Start Backend API, MongoDB, and Redis in background
	docker compose up -d

docker-down: ## Stop and remove all containers
	docker compose down

docker-build: ## Rebuild Docker containers from scratch
	docker compose build --no-cache

docker-restart: ## Restart Backend API container
	docker compose restart api

docker-logs: ## Tail real-time Backend API container logs
	docker compose logs -f api

docker-logs-all: ## Tail logs for all containers
	docker compose logs -f

docker-ps: ## View running container status
	docker compose ps

docker-shell: ## Open interactive shell in backend API container
	docker compose exec api sh

docker-mongo: ## Open MongoDB interactive shell
	docker compose exec mongo mongosh shopnix

docker-redis: ## Open Redis CLI
	docker compose exec redis redis-cli

# ------------------------------------------------------------------------------
# BUILD & VERIFICATION
# ------------------------------------------------------------------------------
build: ## Build all workspaces
	bun run build

build-api: ## Build API workspace only
	bun run build --filter=api

build-web: ## Build Web workspace only
	bun run build --filter=web

typecheck: ## Strict TypeScript typechecking
	bun run typecheck

test: ## Run unit and schema tests
	bunx vitest run

test-watch: ## Run tests in watch mode
	bunx vitest

lint: ## Run linter
	bun run lint

# ------------------------------------------------------------------------------
# LOGGING (PER-CONTROLLER & API LOGS)
# ------------------------------------------------------------------------------
logs-api: ## View central API request log (last 50 lines)
	@bun -e "const fs = require('fs'); const p = 'apps/api/logs/api.log'; if (fs.existsSync(p)) console.log(fs.readFileSync(p, 'utf8').split('\n').filter(Boolean).slice(-50).join('\n')); else console.log('No api.log found yet.');"

logs-error: ## View error log (last 50 lines)
	@bun -e "const fs = require('fs'); const p = 'apps/api/logs/error.log'; if (fs.existsSync(p)) console.log(fs.readFileSync(p, 'utf8').split('\n').filter(Boolean).slice(-50).join('\n')); else console.log('No error.log found yet.');"

logs-controllers: ## List all per-controller log files
	@bun -e "const fs = require('fs'); const p = 'apps/api/logs/controllers'; if (fs.existsSync(p)) { console.log('Available controller logs:'); fs.readdirSync(p).forEach(f => console.log('  - ' + f)); } else { console.log('No controllers logged yet.'); }"

logs-controller: ## View specific controller log (e.g. make logs-controller name=admin)
	@bun -e "const fs = require('fs'); const name = '$(name)'; if (!name) { console.log('Usage: make logs-controller name=<controller>'); console.log('Available: admin, health, auth, orders, products, inbox, stores, ai'); process.exit(0); } const p = 'apps/api/logs/controllers/' + name + '.log'; if (fs.existsSync(p)) console.log(fs.readFileSync(p, 'utf8').split('\n').filter(Boolean).slice(-50).join('\n')); else console.log('No log found for controller: ' + name);"

logs-clear: ## Clear all generated log files
	@bun -e "const fs = require('fs'); ['apps/api/logs/api.log', 'apps/api/logs/error.log'].forEach(f => fs.existsSync(f) && fs.unlinkSync(f)); const d = 'apps/api/logs/controllers'; if (fs.existsSync(d)) fs.readdirSync(d).forEach(f => fs.unlinkSync(d + '/' + f)); console.log('All log files cleared.');"
