FROM golang:1.17

ENV GOPATH=/go/src
ENV WORKSPACE=${GOPATH}/app
RUN mkdir -p ${WORKSPACE}

WORKDIR ${WORKSPACE}

ADD . ${WORKSPACE}

RUN go generate ./handler/api.go
RUN go mod download
RUN go mod tidy