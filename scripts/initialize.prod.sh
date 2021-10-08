#!/bin/bash

#setup debian 10 buster AS ROOT
apt-get update -y -q -e 0
apt-get install -y -q -e 0 curl git vim wget bzip2 zip unzip nano less dnsutils telnet yum-utils
apt-get clean all

#setup docker AS ROOT
apt-get install -y -q -e 0 apt-transport-https ca-certificates gnupg lsb-release
curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/debian \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
apt-get update -y -q -e 0
apt-get install -y -q -e 0 docker-ce docker-ce-cli containerd.io
curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
#usermod -aG docker $USER
#docker run -d -p 5000:5000 --restart=always --name registry registry:latest

#setup codebase as ROOT
cd /opt
git clone https://github.com/kydreth/postexample.git
cd postexample
docker build -t centos/api api
docker build -t centos/web web
docker build -t centos/nginx nginx
ln -s docker-compose.prod.yml docker-compose.yml

#setup services as ROOT
cp services/postexample.service /etc/systemd/system/postexample.service
systemctl enable postexample.service
systemctl start postexample.service
systemctl status -l postexample.service
