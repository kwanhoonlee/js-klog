#!/bin/sh

mkdir -r $GOPATH/src/github.com/ipfs
cp go-ipfs-chunker.zip $GOPATH/src/github.com/ipfs/
cd $GOPATH/src/github.com/ipfs
unzip go-ipfs-chunker.zip
git clone https://github.com/ipfs/go-ipfs.git
cd go-ipfs
#git checkout 480780ecbcf81c3d98cd772d8454f7e976014806
sed -e '2 i\replace github.com/ipfs/go-ipfs-chunker v0.0.1 => ../go-ipfs-chunker' go.mod
make install

