@echo off
echo Untracking cached files that shouldn't be in git...
git rm -r --cached backend/api/__pycache__
git rm -r --cached backend/salon_backend/__pycache__
git rm -r --cached tmp/

echo Committing the removal...
git add .gitignore backend/salon_backend/settings.py
git commit -m "Remove pycache, tmp from version control and secure settings.py"

echo Pushing updates to GitHub...
git push

echo Done!
pause
