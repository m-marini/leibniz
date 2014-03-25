@echo off
rem Batch file to run on Windows

rem Remove "rem" from following two lines, if you'd like to use j2sdk.
rem set JAVA_HOME=...

if not "%JRE_HOME%" == "" goto gotJreHome
if not "%JAVA_HOME%" == "" goto gotJavaHome
echo Neither the JAVA_HOME nor the JRE_HOME environment variable is defined
echo At least one of these environment variable is needed to run this program
goto exit

:gotJavaHome
rem No JRE given, use JAVA_HOME as JRE_HOME
set "JRE_HOME=%JAVA_HOME%"

:gotJreHome
rem Check if we have a usable JRE
if not exist "%JRE_HOME%\bin\java.exe" goto noJreHome
if not exist "%JRE_HOME%\bin\javaw.exe" goto noJreHome
goto okJava

:noJreHome
rem Needed at least a JRE
echo The JRE_HOME environment variable is not defined correctly
echo This environment variable is needed to run this program
goto exit

:okJava
rem Set standard command for invoking Java.
rem Note that NT requires a window name argument when using start.
rem Also note the quoting as JAVA_HOME may contain spaces.
set _RUNJAVA="%JRE_HOME%\bin\javaw"
set JAVA_OPTS=-jar "../lib/${pom.build.finalName}.jar"

echo %_RUNJAVA% %JAVAOPTS%
start "${pom.build.finalName}" %_RUNJAVA% %JAVA_OPTS%
IF ERRORLEVEL 2 goto noJavaw
goto end

:noJavaw
echo.
echo Failed to run.
echo Java runtime environment is required.
echo Setup Java environment at first.
echo.
echo If you would like to run java in your specified folder, you can edit runnit.bat
echo like followings and set your JAVA_HOME.
echo     before:
echo       rem set JAVA_HOME=...
echo     after:
echo       set JAVA_HOME=...
echo.
echo.
pause
goto end

:exit
exit /b 1

:end
exit /b 0
