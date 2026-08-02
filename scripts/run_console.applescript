tell application "Vivaldi"
	activate
	tell front window to set active tab index to (get index of active tab)
	delay 1
	tell application "System Events"
		tell process "Vivaldi"
			keystroke "i" using {option down, command down}
			delay 1
			keystroke "v" using {command down}
			delay 0.5
			key code 36 -- Enter
		end tell
	end tell
end tell
