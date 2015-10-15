deploy: stopcurrent update install run

stopcurrent:
	echo "waiting for kafka to unbind"
	curl --fail --silent --show-error  'http://localhost:8181/index.html?processname=nodejs&action=stop'
	sleep 5	
	killall node
	sleep 120
	echo "302 indicates success"


update:
	git reset --hard
	git pull origin master

test:
	gulp --harmony test

install:
	npm install
	npm install gulp
  
run:
	curl --fail --silent --show-error 'http://localhost:8181/index.html?processname=nodejs&action=start'
	echo "302 indicates success"
