# https://spring.io/guides/gs/spring-boot-docker/
# docker build -t centos/api api
FROM gradle:jdk8
WORKDIR /opt/postexample/api
COPY . ./
#RUN gradle build
RUN gradle bootJar
RUN cp build/libs/api-0.0.1-SNAPSHOT.jar app.jar
ENTRYPOINT ["java","-jar","app.jar"]
