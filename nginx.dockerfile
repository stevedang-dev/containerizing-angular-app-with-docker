FROM nginx:alpine
LABEL authors="Steve Dang"
COPY ./config/nginx.conf /etc/nginx/conf.d/default.conf

# Use the following commands to build the image and run the container(run from root folder)
# 1. Build the project using
# ng build --prod --watch --delete-output-path false

# 2. Build the Docker Image
# docker build -t nginx-angular -f nginx.dockerfile .

# 3. Run the Docker Image
# docker run -p 8080:80 -v $(pwd)/dist:/usr/share/nginx/html nginx-angular
