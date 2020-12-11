# API v1.0.0 Documentation

The API layer is a java/Spring Back-End that focuses on a unified Front-End experience. 
Both are driven by an OpenAPI v3 api document. This code is meant to run in a docker image with the following:

* Docker
* docker-compose v3
* java v8
* gradle v6
* spring boot v2 (security, jpa/hibernate/postgresql)
* json web token (jwt) for authentication of API calls
* lombok for annotations that build getters/setters, constructors, and more. 
[IDEA/Eclipse setup](https://www.baeldung.com/lombok-ide)
* aws: simple email sender (SES)

The main repo README.md file contains an overlapping introduction to the web and api images.

* Update post for Back-End/Java/JPA:
  * api/src/main/
    * java/com/example/post/
      * controller/
        * PostController.java update JPA methods / restful API mapping
        * associated controllers
      * model/
        * Post.java update JPA / lombok annotations
        * associated models
  * then rebuild the api docker image api/Dockerfile, and repo README.md have instructions
