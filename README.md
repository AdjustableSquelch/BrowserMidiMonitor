BrowserMidiMonitor
==================
Live version: [http://adjustablesquelch.github.io/BrowserMidiMonitor/index.html] but see Usage below before trying it!

This project uses the currently experimental MIDI I/O features of HTML5 to implement a midi monitor.

Usage
-----
So... MIDI is expermintal at the moment. All I can do is tell you what works for me. This runs inside Google Chrome 33.0.1750.154 m on my PC. You will need to enable MIDI support. Open the link below inside Chrome to enable MIDI support.

>chrome://flags/#enable-web-midi

And restart chrome. Hopefully then it will work. Chrome has recently added a little tray icon to keep itself loaded all the time ready for quick launch, even when you have no windows open, I'm not sure whether just closing chrome and restarting it will work. If all else seems to fail, reboot the machine (yeah I'm serious).

When you view the actual web page on chrome for the first time it will ask you if you want to allow full access to midi devices at the very top of the page in a not-very-obvious like gray bar. You will have to allow it access.

Please, try it on other browsers, on other operating systems and let me know how it goes.

Ensoniq Fizmo Decoding
----------------------
Primarily I created this to ease the discovery of features of the superb synthesizer the Ensoniq Fizmo which was rushed into production (due to various issues at the company level) and never had documented a full MIDI spec. Which wouldn't be so bad but there are many paramenters under the hood that you cannot reach from the knobs on the synth. And the only thing that knows about it is an obsolete (and twitchy) program from years ago called SoundDiver.

I am trying to document what I find on the Fizmo MIDI spec at another project you will want to have a look at : https://github.com/AdjustableSquelch/Ensoniq-Fizmo-Midi

As of build 4 (21 Apr 2014) I've added simple decoding of Fizmo sound parameter change sysex messages (doesnt include effects and stuff yet, slightly different message ill look into later). If it detects one of these messages, the param number, length and value are decoded. 

This you can use to see what SoundDiver (SD) is up to. You'll need 2 MIDI ports (either 1 computer 2 ports or 2 computers with a port each. 2 computers if you are using Windows is MUCH easier). Hookup the Fiz midi in and out to one port on the computer. Then hook up the MIDI Thru port from the Fiz to the MIDI in on a second port (or second computer).

If you're using 2 computers, great, you can just spin up SoundDiver on one and the brower monitor on the other.

If you're using a Mac - it might be ok with one machine. I can see no way of blocking ports in the SD manual, so maybe it will just work?

If not and you're using Windows, we're going to have to tell SoundDiver not to use the 2nd port. This is a faff. Briefly 
+ Make sure the browser isn't running and has control of any of the MIDI ports. Worst case scenario: Reboot.
+ Spin up SoundDiver so it finds all your ports. You could scan for the Fiz now if you want.
+ Quit Sounddiver
+ We need to edit win.ini now...faff!
+ Click Start menu and in the search box type in 'notepad'
+ Right click on the program it finds and select 'run as administrator' (otherwise we cant save file)
+ Inside notepad open c:\windows\win.ini
+ Find the section named [SoundDiver]
+ Inside are entrys for every midi in and out port. Disable the ins and out that the fizmo is NOT connected to by changing the value after equals to 0. Here's an example from my machine:
```
[SoundDiver]
MidiIn_ESI_M4U=0
MidiIn_MIDIIN2__ESI_M4U=0
MidiIn_MIDIIN3__ESI_M4U=0
MidiIn_MIDIIN4__ESI_M4U=0
MidiIn_USB_Midi=1
MidiOut_Microsoft_GS_Wavetable_Synth=0
MidiOut_ESI_M4U=0
MidiOut_MIDIOUT2__ESI_M4U=0
MidiOut_MIDIOUT3__ESI_M4U=0
MidiOut_MIDIOUT4__ESI_M4U=0
MidiOut_USB_Midi=7
```
+ Don't change any values (to a 1 or a 7 or anything) for stuff that you want to keep, just disable all the other ports by setting them to 0.
+ Save the file. If it won't let you save, you didn't do 'run as administrator' above.
+ Spin up SoundDiver, check it can talk to the Fiz.
+ Run the browser midi monitor and monitor all the other ports.
+ Change a param inside sounddiver - see the decoded output in the browser.

If that doesn't work, reboot, delete the sounddiver prefs file and start again. Yes it's a real pain :)


