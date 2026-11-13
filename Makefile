.PHONY: install fetch build rebuild serve clean

install:
	pip3 install requests
	cd dashboard && npm install

fetch:
	python3 pipeline/fetch_nearblocks.py

build:
	cd dashboard && npm run build

rebuild: fetch build
	@echo "\n✓ Data fetched and dashboard rebuilt."
	@echo "  Run: make serve"

serve:
	cd dashboard && npx -y http-server dist -p 4173 -c-1

clean:
	rm -rf dashboard/dist
