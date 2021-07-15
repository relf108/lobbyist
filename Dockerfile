FROM ubuntu 

RUN apt-get update 
RUN apt-get install –y nodejs npm wget 
RUN wget $path
RUN run $path
CMD [“echo”,”Image created”] 