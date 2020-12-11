FROM nginx

VOLUME /etc/letsencrypt
EXPOSE 80
EXPOSE 443

RUN apt update && \
    apt install -y python3 python3-dev libffi6 libffi-dev libssl-dev curl build-essential procps && \
    curl -L 'https://bootstrap.pypa.io/get-pip.py' | python3 && \
    pip install -U cffi certbot && \
    apt remove --purge -y python3-dev build-essential libffi-dev libssl-dev curl && \
    apt-get autoremove -y && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

COPY ./scripts/ /scripts
RUN chmod +x /scripts/*.sh

RUN mkdir -p /scripts/startup

#RUN rm -f /etc/nginx/conf.d/*
#COPY conf /etc/nginx/conf.d/

ENTRYPOINT []
CMD ["/bin/bash", "/scripts/entrypoint.sh"]
