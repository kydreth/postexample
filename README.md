# Post Example v1.0.0 Documentation

## Overview

This is a demo of some projects tech stack that we're working on. 
We'll be publishing some materials on this repository soon!

* Front-End: Angular/TypeScript. We started with creative-tim angular dashboard and stripped it to meet our needs for this demo
* Back-End: Java/Spring Boot, with JPA/Hibernate/JDBC PostgreSQL database driver
* Database: PostgreSQL
* Infrastructure: Vagrant+VirtualBox or AWS. Initialized with scripts and docker-compose files

## Quick Start

You'll need to install [VirtualBox](https://www.virtualbox.org/wiki/Downloads) and 
[Vagrant](https://www.vagrantup.com/downloads.html). [This article has more info](https://observablehq.com/@kydreth/vagrant-docker-on-macos-windows-or-linux).

Using a terminal such as cmd.exe or powershell on Windows, or terminal on macos or linux.
```
git clone https://github.com/kydreth/postexample.git
cd postexample

```

then from root code directory, start the Virtual Machine (VM) with vagrant and virtualbox
```
vagrant up
vagrant ssh
```

Then you'll need to add the enumerated values from `docs/api.*.sql` after logging into postgres. 
You'll also need to drop the unique constraints on the posts table for user_id and status_id columns.

```
docker exec -it postgresql /bin/bash
psql -h postgresql -U postgres # enter password from docker-compose.*.yml which was `changeThisToASecureP@SSW0RD!`

\d+ posts;
alter table posts drop constraint <your value for user_id>;
alter table posts drop constraint <your value for status_id>;

insert into roles ...
insert into statuses ...

```

To set an admin user, you have to login to postgres via about notes
```
select * from users;
select * from roles;
update user_roles set role_id = (select id from roles where name = 'ROLE_ADMIN') where user_id = (select id from users where email = '');
```

Then you can go to http://localhost to register, and login.

If you're not familiar with JetBrains IDEA, [this article](https://observablehq.com/@kydreth/onboarding-pivotal-spring-boot-2-x-example-with-java) might help. 

## Getting Started on Production on AWS

If you're not familiar with AWS, start here. If you are go to AWS Console. 

Setup SSH key pair and download it. Then in your terminal:
```
$ mv path/postexample.pem ~/.ssh/
$ chmod 400 ~/.ssh/postexample.pem
```

In AWS console, you'll need to set up an EC2 instance with the following:
load AMI for CentOS 7.x
EC2 t2.large
name: postexample-<stage>
tags: env=<stage>; customer=corporate; project=postexample
security group: allow SSH/port 22 from a specific IP address(es), HTTP/port 80 and HTTPS/port 433 from any IP address

To connect to your AWS, open your terminal:
```
ssh -i ~/.ssh/postexample.pem centos@post.example.com
sudo su - 
cd /opt
git clone https://github.com/kydreth/postexample.git
cd postexample
chmod a+x scripts/initialize.prod.sh
./scripts/initialize.prod.sh

```

## New Account Registration

A user is unverified after registration. AWS SES will send an email with a verification string. The user will have the following state:

```
verified = false, verification_string = "xxx"
```
When the user clicks the link from the new account registration verification email. The FE sends the BE verification string

```
verified = false|true, verification_string = "xxx"
```
During a user’s first login, if their account is verified, continue; otherwise, send verification string. If their login is successful, and the verification string isn’t null, it will be nulled. 

```
verified = true, verification_string = null
```


## Dependencies

### Web

* [Angular/TS]()
  * Creative Tim Material UI/UX [dashboard](https://github.com/creativetimofficial/material-dashboard-angular2) / [kit](https://github.com/creativetimofficial/paper-kit-2-angular) templates
  * [Material Icons](https://material.io/resources/icons/)
  * Install SASS for IDEA via [instructions](https://www.jetbrains.com/help/post/transpiling-sass-less-and-scss-to-css.html)
  * [Router](https://angular.io/guide/router)

### API

[jcenter]()
* We're using jcenter, but search https://mvnrepository.com/ for gradle packages. jfrogs search ui is awful

[Swagger OpenAPI v3 Specification](https://swagger.io/specification/)

[Spring JPA](https://spring.io/projects/spring-data-jpa)
* [jpa.repositories](https://docs.spring.io/spring-data/jpa/docs/2.3.4.RELEASE/reference/html/#jpa.repositories)
[Spring Security](https://spring.io/projects/spring-security)

[JSON Web Token (JWT)](https://jwt.io/introduction/)
* [repo java](https://github.com/jwtk/jjwt)
* [repo javascript](https://github.com/kjur/jsrsasign)

[Liquidbase](https://www.liquibase.org/)
* [article](https://auth0.com/blog/integrating-spring-data-jpa-postgresql-liquibase/)

[dbdiagram](https://dbdiagram.io) is being used for database relationship visualizations
* [DBML](https://www.dbml.org/home/#intro)

### Updating Staging Environment

To rebuild api in dev: (note: you should set env to DEV in /api/src/main/resources/application.properties)
```
# cd /opt/postexample; rm -rf api; cp -R /vagrant/api .; docker build -t centos/api api
```

To rebuild web in dev: (you should iterate on a local deployment of web)
```
# cd /opt/postexample; rm -rf web; cp -R /vagrant/web .; docker build -t centos/web web

```

Setup a local deployment of web:
# comment out the following web related settings
  * docker-compose.dev.yml: the web service
  * nginx/dev.conf.d/app.dev.conf: change proxy_pass hostname from web to localhost
  * Vagrantfile: line opening port 4200 for "nodejs angularjs web"
# then run the following via command line

```
$ vagrant ssh
$ sudo su - 
# systemctl stop postexample
# cd /opt/postexample; docker-compose -f docker-compose.dev.yml up
```

To rebuild api or web, in prod
```
# cd /opt/postexample; git pull # enter password
# docker build -t centos/api api
# docker build -t centos/web web

```

To reload service:
```
# systemctl stop postexample; systemctl start postexample; systemctl status -l postexample
```

To follow/tail the service:
```
# journalctl -fu postexample
```

To manually start docker-compose and view all logs consolidated:
```
# cd /opt/postexample
# systemctl stop postexample
# docker-compose -f docker-compose.dev.yml up

```

### Update Documentation

* docs/*.(yaml|svg|dbml|png) using OpenAPI/IDEA Ultimate, DBDiagram, LiquidChart

### Miscellaneous

docker
* https://docs.docker.com/compose/startup-order/

pgadmin
* https://www.pgadmin.org/docs/pgadmin4/latest/container_deployment.html

nginx
* https://www.docker.com/blog/how-to-use-the-official-nginx-docker-image/
* https://github.com/docker-library/docs/tree/master/nginx
