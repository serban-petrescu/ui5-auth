git config --global user.email "travis@travis-ci.org"
git config --global user.name "Travis CI"

git clone https://github.com/serban-petrescu/packaged-ui5-auth.git

cp -r dist/* packaged-ui5-auth/
cd packaged-ui5-auth

git remote rm origin
git remote add origin https://serban-petrescu:${GITHUB_TOKEN}@github.com/serban-petrescu/packaged-ui5-auth.git > /dev/null 2>&1

git add . *.*
git commit --message "Travis build: $TRAVIS_BUILD_NUMBER"

git push --follow-tags --quiet --set-upstream origin master