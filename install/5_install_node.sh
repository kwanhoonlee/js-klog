#!/bin/sh

sudo apt-get install build-essential libssl-dev
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
source ~/.bashrc
nvm --version
nvm install 10.15.0
node --version
npm --version
