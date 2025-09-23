# Simple curl helpers for the presentation-layer API
# Quickstart:
#   1) make token.generate   # copy the printed JWT
#   2) Paste it into TOKEN below
#   3) make municipalities.create   # run any command with defaults

.PHONY: help token.generate municipalities.create municipalities.get prices.create prices.history prices.current prices.by_package packages.create packages.add_price

# Base configuration
BASE_URL ?= http://localhost:3000
# Paste a valid JWT here after running `make token.generate`
TOKEN ?= paste_jwt_here

# Common data
NOW ?= $(shell date -u +"%Y-%m-%dT%H:%M:%SZ")

help:
	@echo "Available targets:"
	@echo "  make token.generate                         # prints a JWT (copy/paste into TOKEN)"
	@echo "  make municipalities.create                  # creates default municipality"
	@echo "  make municipalities.get                     # gets municipality by name"
	@echo "  make prices.create                           # creates a price"
	@echo "  make prices.history                          # price history"
	@echo "  make prices.current                          # current price"
	@echo "  make prices.by_package                       # all prices for package type"
	@echo "  make packages.create                         # create package with initial price"
	@echo "  make packages.add_price                      # add price to existing package"
	@echo ""
	@echo "Note: First run: make token.generate, then paste token into TOKEN in this Makefile."
	@echo "      JWT is signed with JWT_SECRET or 'dev-secret' if unset."

# -------------------- Token generator --------------------
token.generate:
	@echo "Generating JWT using njwt..." >&2
	@node -e "const nJwt=require('njwt');const s=process.env.JWT_SECRET||'dev-secret';const claims={sub:'demo-user',permissions:['municipality:read','municipality:create','price:read','price:create','package:create']};const t=nJwt.create(claims,s);console.log(t.compact());"

# -------------------- Municipalities --------------------
NAME ?= Stockholm
CODE ?= 0180
COUNTRY ?= Sweden

municipalities.create:
	@test "$(TOKEN)" != "" -a "$(TOKEN)" != "PASTE_JWT_HERE" || (echo "Set TOKEN in Makefile (run: make token.generate)" && exit 1)
	@echo "POST /api/municipalities"
	curl -sS -X POST "$(BASE_URL)/api/municipalities" \
	  -H "Authorization: Bearer $(TOKEN)" \
	  -H "Content-Type: application/json" \
	  -d '{"name":"$(NAME)","code":"$(CODE)","country":"$(COUNTRY)"}'

municipalities.get:
	@test "$(TOKEN)" != "" -a "$(TOKEN)" != "PASTE_JWT_HERE" || (echo "Set TOKEN in Makefile (run: make token.generate)" && exit 1)
	@echo "GET /api/municipalities/$(NAME)"
	curl -sS "$(BASE_URL)/api/municipalities/$(NAME)" \
	  -H "Authorization: Bearer $(TOKEN)"

# -------------------- Prices --------------------
PKG_TYPE ?= basic
VALUE_CENTS ?= 9900
CURRENCY ?= SEK
EFFECTIVE_DATE ?= $(NOW)
MUNICIPALITY_NAME ?= Stockholm
MUNICIPALITY_ID ?=
YEAR ?= $(shell date -u +"%Y")

prices.create:
	@test "$(TOKEN)" != "" -a "$(TOKEN)" != "PASTE_JWT_HERE" || (echo "Set TOKEN in Makefile (run: make token.generate)" && exit 1)
	@echo "POST /api/prices"
	curl -sS -X POST "$(BASE_URL)/api/prices" \
	  -H "Authorization: Bearer $(TOKEN)" \
	  -H "Content-Type: application/json" \
	  -d '{"packageType":"$(PKG_TYPE)","valueCents":$(VALUE_CENTS),"currency":"$(CURRENCY)","effectiveDate":"$(EFFECTIVE_DATE)","municipalityName":"$(MUNICIPALITY_NAME)"}'

prices.history:
	@test "$(TOKEN)" != "" -a "$(TOKEN)" != "PASTE_JWT_HERE" || (echo "Set TOKEN in Makefile (run: make token.generate)" && exit 1)
	@echo "GET /api/prices/history?packageType=$(PKG_TYPE)&year=$(YEAR)$(if $(MUNICIPALITY_ID),&municipalityId=$(MUNICIPALITY_ID),)"
	curl -sS "$(BASE_URL)/api/prices/history?packageType=$(PKG_TYPE)&year=$(YEAR)$(if $(MUNICIPALITY_ID),&municipalityId=$(MUNICIPALITY_ID),)" \
	  -H "Authorization: Bearer $(TOKEN)"

prices.current:
	@test "$(TOKEN)" != "" -a "$(TOKEN)" != "PASTE_JWT_HERE" || (echo "Set TOKEN in Makefile (run: make token.generate)" && exit 1)
	@echo "GET /api/prices/current?packageType=$(PKG_TYPE)$(if $(MUNICIPALITY_ID),&municipalityId=$(MUNICIPALITY_ID),)"
	curl -sS "$(BASE_URL)/api/prices/current?packageType=$(PKG_TYPE)$(if $(MUNICIPALITY_ID),&municipalityId=$(MUNICIPALITY_ID),)" \
	  -H "Authorization: Bearer $(TOKEN)"

prices.by_package:
	@test "$(TOKEN)" != "" -a "$(TOKEN)" != "PASTE_JWT_HERE" || (echo "Set TOKEN in Makefile (run: make token.generate)" && exit 1)
	@echo "GET /api/prices/package/$(PKG_TYPE)"
	curl -sS "$(BASE_URL)/api/prices/package/$(PKG_TYPE)" \
	  -H "Authorization: Bearer $(TOKEN)"

# -------------------- Packages --------------------
packages.create:
	@test "$(TOKEN)" != "" -a "$(TOKEN)" != "PASTE_JWT_HERE" || (echo "Set TOKEN in Makefile (run: make token.generate)" && exit 1)
	@echo "POST /api/packages"
	curl -sS -X POST "$(BASE_URL)/api/packages" \
	  -H "Authorization: Bearer $(TOKEN)" \
	  -H "Content-Type: application/json" \
	  -d '{"packageType":"$(PKG_TYPE)","valueCents":$(VALUE_CENTS),"currency":"$(CURRENCY)","effectiveDate":"$(EFFECTIVE_DATE)","municipalityName":"$(MUNICIPALITY_NAME)"}'

packages.add_price:
	@test "$(TOKEN)" != "" -a "$(TOKEN)" != "PASTE_JWT_HERE" || (echo "Set TOKEN in Makefile (run: make token.generate)" && exit 1)
	@echo "POST /api/packages/$(PKG_TYPE)/price"
	curl -sS -X POST "$(BASE_URL)/api/packages/$(PKG_TYPE)/price" \
	  -H "Authorization: Bearer $(TOKEN)" \
	  -H "Content-Type: application/json" \
	  -d '{"packageType":"$(PKG_TYPE)","valueCents":$(VALUE_CENTS),"currency":"$(CURRENCY)","effectiveDate":"$(EFFECTIVE_DATE)","municipalityName":"$(MUNICIPALITY_NAME)"}'


