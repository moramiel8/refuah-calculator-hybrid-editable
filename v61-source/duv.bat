@echo off

REM deletes old dist dir content
call cd dist && rd . /s /q 2>nul & cd ..

REM copies src dir to dist dir
call robocopy .\src .\dist\src /E & copy index.html .\dist

REM deletes js dir content in dist dir as well as css dir
call cd dist\src\js && rd . /s /q 2>nul & cd ..\css && rd . /s /q 2>nul & cd ..\..\..

REM copies service-worker file to dist dir
call copy .\src\js\utils\service-worker.js .\dist\src\js

REM bundles js files together and outputs to dist dir
call npx webpack

REM notifies the user before publishing the website
echo.
echo Dont Forget to change manifest URL, JS ref as well as delete CSS ref!
echo.

pause