#!/bin/bash

wget https://dl.google.com/go/go1.12.5.linux-amd64.tar.gz
sudo tar -C /usr/local -xzf go1.12.5.linux-amd64.tar.gz
echo 'export PATH=$PATH:/usr/local/go/bin' > ~/.bashrc
source ~/.bashrc

