# -*- mode: ruby -*-
# vi: set ft=ruby :
#
# plugins:
# vagrant plugin install vagrant-vbguest; vagrant plugin install vagrant-disksize

$setup_os = <<SCRIPT
yum update -y -q -e 0
yum install -y -q -e 0 git vim wget pushd popd bzip2 zip unzip nano less dnsutils nc telnet yum-utils

SCRIPT

$setup_docker = <<SCRIPT
yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
yum install -y -q -e 0 docker-ce docker-ce-cli containerd.io
usermod -aG docker vagrant
systemctl enable docker
systemctl start docker
curl -L -s https://github.com/docker/compose/releases/download/1.25.1-rc1/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose > /dev/null
chmod +x /usr/local/bin/docker-compose
#docker network create -d bridge web
docker run -d -p 5000:5000 --restart=always --name registry registry:latest

SCRIPT

$code = <<SCRIPT
cp -R /vagrant /opt/postexample
cd /opt/postexample
docker build -t centos/api api
docker build -t centos/web web
ln -s docker-compose.dev.yml docker-compose.yml
cp services/postexample.service /etc/systemd/system/postexample.service
systemctl enable postexample.service
systemctl start postexample.service

SCRIPT

$os_cleanup = <<SCRIPT
yum clean all
cat /dev/null > ~/.bash_history && history -c && exit

SCRIPT

Vagrant.configure("2") do |config|
	config.vm.box = "centos/7"
	#config.vm.box_version = "1905.1"
	#config.vm.box_version = "2004.01"
	config.vm.hostname = "postexample-dev"
	config.vm.provider "virtualbox" do |v|
		v.name="postexample-dev"
		v.memory=8192
		v.cpus=2
        #v.customize ["modifyvm", :id, "--vram", "48"]
        #v.customize ["modifyvm", :id, "--clipboard", "bidirectional"]
        #v.customize ["modifyvm", :id, "--draganddrop", "bidirectional"]
        v.customize ["storageattach", :id,
                        "--storagectl", "IDE",
                        "--port", "0", "--device", "1",
                        "--type", "dvddrive",
                        "--medium", "emptydrive"]
        #v.gui = true # Display the VirtualBox GUI when booting the machine. In virtualbox while VM is off, set Display Graphics Controller to VBoxSVGA, and enable all acceleration options
	end

	config.vm.synced_folder ".", "/vagrant", type: "virtualbox"

	config.vm.provision "shell", inline: $setup_os
	config.vm.provision "shell", inline: $setup_docker
	config.vm.provision "shell", inline: $code
	config.vm.provision "shell", inline: $os_cleanup

	#config.vm.network "private_network", ip: "10.0.0.0"
	config.vm.network "forwarded_port", guest: 80, host: 80, id: "http"
	#config.vm.network "forwarded_port", guest: 443, host: 443, id: "https"
	config.vm.network "forwarded_port", guest: 8080, host: 8081, host_ip: "127.0.0.1", id: "tomcat"
	#config.vm.network "forwarded_port", guest: 8888, host: 8888, host_ip: "127.0.0.1", id: "Jupyter Notebook / Lab"
	config.vm.network "forwarded_port", guest: 5432, host: 5432, host_ip: "127.0.0.1", id: "postgresql db service"
	#config.vm.network "forwarded_port", guest: 8081, host: 8081, host_ip: "127.0.0.1", id: "postgresql adminer web"
	config.vm.network "forwarded_port", guest: 8082, host: 8082, host_ip: "127.0.0.1", id: "postgresql pgadmin4 web"
	#config.vm.network "forwarded_port", guest: 9200, host: 9200, host_ip: "127.0.0.1", id: "elasticstack elasticsearch service"
	#config.vm.network "forwarded_port", guest: 9300, host: 9300, host_ip: "127.0.0.1", id: "elasticstack nodes service"
	#config.vm.network "forwarded_port", guest: 5601, host: 5601, host_ip: "127.0.0.1", id: "elasticstack kibana web"
	config.vm.network "forwarded_port", guest: 4200, host: 4200, host_ip: "127.0.0.1", id: "nodejs angularjs web"
	#config.vm.network "forwarded_port", guest: 3000, host: 3000, host_ip: "127.0.0.1", id: "nodejs reactjs web"

end
