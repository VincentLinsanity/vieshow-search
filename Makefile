include Makefile.inc

IMAGE = $(USER)/$(IMAGE)
VERSION ?= latest

.PHONY: docker build push push-version

docker: build push push-version

build:
	docker build --pull -t $(IMAGE) .
