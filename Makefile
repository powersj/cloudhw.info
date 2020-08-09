.PHONY: build clean server test venv

all: build

build:
	python3 -m src

clean:
	rm -fr html
	@find . -regex '.*\(__pycache__\|\.py[co]\)' -delete

server: build
	python3 -m http.server --directory html &
	watchmedo shell-command --command "make build" --recursive src static

test:
	isort src
	flake8 --max-line-length=88 src
	black --check src
	@echo -e '\xe2\x9c\x85 \xe2\x9c\x85 \xe2\x9c\x85'

venv:
	virtualenv -p /usr/bin/python3 .venv
	.venv/bin/pip install -r requirements.txt -r requirements-test.txt
