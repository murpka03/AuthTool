@ECHO OFF
IF NOT "%~f0" == "~f0" GOTO :WinNT
@"ruby.exe" "c:/Ruby Stuffs/AuthTool-master/AuthTool-master/vendor/cache/ruby/1.9.1/bin/sqlite3_ruby" %1 %2 %3 %4 %5 %6 %7 %8 %9
GOTO :EOF
:WinNT
@"ruby.exe" "%~dpn0" %*
