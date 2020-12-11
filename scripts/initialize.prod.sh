#!/bin/bash

#setup centos 7.x AS ROOT
yum update -y -q -e 0
yum install -y -q -e 0 git vim wget pushd popd bzip2 zip unzip nano less dnsutils nc telnet yum-utils
yum clean all

#setup docker AS ROOT
yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
yum install -y -q -e 0 docker-ce docker-ce-cli containerd.io
usermod -aG docker centos
systemctl enable docker
systemctl start docker
curl -L -s https://github.com/docker/compose/releases/download/1.25.1-rc1/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose > /dev/null
chmod +x /usr/local/bin/docker-compose
docker network create -d bridge web
docker run -d -p 5000:5000 --restart=always --name registry registry:latest

#setup codebase as ROOT
cd /opt
git clone https://github.com/kydreth/postexample.git
docker build -t centos/api api
docker build -t centos/web web
docker build -t centos/nginx nginx
ln -s docker-compose.prod.yml docker-compose.yml

#setup services as ROOT
cp services/postexample.service /etc/systemd/system/postexample.service
systemctl enable postexample.service
systemctl start postexample.service
systemctl status -l postexample.service
