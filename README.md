BrowserMidiMonitor
==================

Working version: [http://adjustablesquelch.github.io/BrowserMidiMonitor/index.html] but see Usage below before trying it!


This project uses the currently experimental MIDI I/O features of HTML5 to implement a midi monitor.

Primarily I created this to ease the discovery of features of the superb synthesizer the Ensoniq Fizmo which was rushed into production (due to various issues at the company level) and never had documented a full MIDI spec. Which wouldn't be so bad but there are many paramenters under the hood that you cannot reach from the knobs on the synth.

A program called SoundDiver could edit these via way of a 3097 byte sysex dump, but we have no specs on this. So the idea is to try and reverse engineer this dump. So a lot of features I add will be Fizmo decoding specific. 

Usage
-----

So... MIDI is expermintal at the moment. All I can do is tell you what works for me. This runs inside Google Chrome 33.0.1750.154 m on my PC. You will need to enable MIDI support. Open the link below inside Chrome to enable MIDI support.

>chrome://flags/#enable-web-midi

And restart chrome. Hopefully then it will work.

When you view the actual web page on chrome for the first time it will ask you if you want to allow full access to midi devices at the very top of the page in a not-very-obvious like gray bar. You will have to allow it access.

Please, try it on other browsers, on other operating systems and let me know how it goes.
