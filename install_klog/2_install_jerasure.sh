#!/bin/sh

sudo apt-get install dh-autoreconf
#wget http://www.kaymgee.com/Kevin_Greenan/Software_files/jerasure.tar.gz
tar -xfvz jerasure.tar.gz
git clone  https://github.com/ceph/gf-complete.git
current_path=$(pwd)
cd gf-complete
export GFP=$current_path/gf-complete
export LD_LIBRARY_PATH=/usr/local/lib:$GFP/src/.libs
sudo sh ./autogen.sh
sudo sh ./configure
sudo make
sudo make install
cd ../jerasure
sudo sh ./configure
sudo make
sudo make install

