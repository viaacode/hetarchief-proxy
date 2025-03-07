ARG elasticsearch_version=8.13.2
FROM docker.elastic.co/elasticsearch/elasticsearch:${elasticsearch_version}
COPY es8-plugin-2.2.284-SNAPSHOT-8.13.2.zip /tmp/es8-plugin-2.2.284-SNAPSHOT-8.13.2.zip
COPY license /usr/share/elasticsearch/config/theMatchBox-VIAA_Demo.lic

RUN bin/elasticsearch-plugin install --batch file:///tmp/es8-plugin-2.2.284-SNAPSHOT-8.13.2.zip
