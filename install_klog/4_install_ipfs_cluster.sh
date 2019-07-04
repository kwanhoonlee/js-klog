#!/bin/sh

wget https://dist.ipfs.io/ipfs-cluster-ctl/v0.10.1/ipfs-cluster-ctl_v0.10.1_linux-amd64.tar.gz
wget https://dist.ipfs.io/ipfs-cluster-service/v0.10.1/ipfs-cluster-service_v0.10.1_linux-amd64.tar.gz
tar -xvzf ipfs-cluster-ctl_v0.10.1_linux-amd64.tar.gz
tar -xvzf ipfs-cluster-service_v0.10.1_linux-amd64.tar.gz
cp ipfs-cluster-service/ipfs-cluster-service $GOPATH/bin/
cp ipfs-cluster-ctl/ipfs-cluster-ctl $GOPATH/bin/
