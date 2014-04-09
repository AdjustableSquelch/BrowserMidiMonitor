/**
 * Created by Ian on 05/04/2014.
 */

var midi=null;
var outputs=null;
var midiEvents=null;
var labelOffset=['label-primary','label-success','label-info','label-warning','label-danger','label-default'];
var hexDigits='0123456789ABCDEF';
var midiEventId=0;

function toHex(n) {
	return "0x"+hexDigits[ n>>4] + hexDigits[n&15];
}

function toHexAndDecimal(n) {
	return "0x"+hexDigits[ n>>4] +hexDigits[ n&15 ]+" ("+n+") ";
}

function defaultControllerValueDecoder(value) {
	return "Value:"+toHexAndDecimal(value);
}

function switchControllerValueDecoder(value) {
	return "Value: "+(value<=63 ? "Off" : "On");
}

// in the definition of a controller, is this the MSB, LSB or standalone?
function ControllerPart() {};
ControllerPart.MSB=1;
ControllerPart.LSB=2;
ControllerPart.Standalone=3;

function ControllerDefinition( description, mlsb, associated, decoder) {
	var o = new Object();
	o.description = description;
	o.mlsb = typeof mlsb !== 'undefined' ? mlsb : ControllerPart.Standalone;
	o.associated = typeof associated !== 'undefined' ? associated : null;
	o.decoder = typeof decoder !== 'undefined' ? decoder : defaultControllerValueDecoder
	return o;
}

var defaultControllerDefinitions = {
	0	: new ControllerDefinition( "Bank Select",	ControllerPart.MSB	),
	1	: new ControllerDefinition( "Modulation Wheel",	ControllerPart.MSB	),
	2	: new ControllerDefinition( "Breath Controller",	ControllerPart.MSB	),
	4	: new ControllerDefinition( "Foot Controller",	ControllerPart.MSB	),
	5	: new ControllerDefinition( "Portamento Time",	ControllerPart.MSB	),
	6	: new ControllerDefinition( "Data Entry MSB",	ControllerPart.MSB	),
	7	: new ControllerDefinition( "Channel Volume",	ControllerPart.MSB	),
	8	: new ControllerDefinition( "Balance",	ControllerPart.MSB	),
	10	: new ControllerDefinition( "Pan",	ControllerPart.MSB	),
	11	: new ControllerDefinition( "Expression Controller",	ControllerPart.MSB	),
	12	: new ControllerDefinition( "Effect Control 1",	ControllerPart.MSB	),
	13	: new ControllerDefinition( "Effect Control 2",	ControllerPart.MSB	),
	16	: new ControllerDefinition( "General Purpose Controller 1",	ControllerPart.MSB	),
	17	: new ControllerDefinition( "General Purpose Controller 2",	ControllerPart.MSB	),
	18	: new ControllerDefinition( "General Purpose Controller 3",	ControllerPart.MSB	),
	19	: new ControllerDefinition( "General Purpose Controller 4",	ControllerPart.MSB	),
	32	: new ControllerDefinition( "LSB for Control 0 (Bank Select)",	ControllerPart.LSB	),
	33	: new ControllerDefinition( "LSB for Control 1 (Modulation Wheel)",	ControllerPart.LSB	),
	34	: new ControllerDefinition( "LSB for Control 2 (Breath Controller)",	ControllerPart.LSB	),
	35	: new ControllerDefinition( "LSB for Control 3 (Undefined)",	ControllerPart.LSB	),
	36	: new ControllerDefinition( "LSB for Control 4 (Foot Controller)",	ControllerPart.LSB	),
	37	: new ControllerDefinition( "LSB for Control 5 (Portamento Time)",	ControllerPart.LSB	),
	38	: new ControllerDefinition( "LSB for Control 6 (Data Entry)",	ControllerPart.LSB	),
	39	: new ControllerDefinition( "LSB for Control 7 (Channel Volume, formerly Main Volume)",	ControllerPart.LSB	),
	40	: new ControllerDefinition( "LSB for Control 8 (Balance)",	ControllerPart.LSB	),
	41	: new ControllerDefinition( "LSB for Control 9 (Undefined)",	ControllerPart.LSB	),
	42	: new ControllerDefinition( "LSB for Control 10 (Pan)",	ControllerPart.LSB	),
	43	: new ControllerDefinition( "LSB for Control 11 (Expression Controller)",	ControllerPart.LSB	),
	44	: new ControllerDefinition( "LSB for Control 12 (Effect control 1)",	ControllerPart.LSB	),
	45	: new ControllerDefinition( "LSB for Control 13 (Effect control 2)",	ControllerPart.LSB	),
	46	: new ControllerDefinition( "LSB for Control 14 (Undefined)",	ControllerPart.LSB	),
	47	: new ControllerDefinition( "LSB for Control 15 (Undefined)",	ControllerPart.LSB	),
	48	: new ControllerDefinition( "LSB for Control 16 (General Purpose Controller 1)",	ControllerPart.LSB	),
	49	: new ControllerDefinition( "LSB for Control 17 (General Purpose Controller 2)",	ControllerPart.LSB	),
	50	: new ControllerDefinition( "LSB for Control 18 (General Purpose Controller 3)",	ControllerPart.LSB	),
	51	: new ControllerDefinition( "LSB for Control 19 (General Purpose Controller 4)",	ControllerPart.LSB	),
	52	: new ControllerDefinition( "LSB for Control 20 (Undefined)",	ControllerPart.LSB	),
	53	: new ControllerDefinition( "LSB for Control 21 (Undefined)",	ControllerPart.LSB	),
	54	: new ControllerDefinition( "LSB for Control 22 (Undefined)",	ControllerPart.LSB	),
	55	: new ControllerDefinition( "LSB for Control 23 (Undefined)",	ControllerPart.LSB	),
	56	: new ControllerDefinition( "LSB for Control 24 (Undefined)",	ControllerPart.LSB	),
	57	: new ControllerDefinition( "LSB for Control 25 (Undefined)",	ControllerPart.LSB	),
	58	: new ControllerDefinition( "LSB for Control 26 (Undefined)",	ControllerPart.LSB	),
	59	: new ControllerDefinition( "LSB for Control 27 (Undefined)",	ControllerPart.LSB	),
	60	: new ControllerDefinition( "LSB for Control 28 (Undefined)",	ControllerPart.LSB	),
	61	: new ControllerDefinition( "LSB for Control 29 (Undefined)",	ControllerPart.LSB	),
	62	: new ControllerDefinition( "LSB for Control 30 (Undefined)",	ControllerPart.LSB	),
	63	: new ControllerDefinition( "LSB for Control 31 (Undefined)",	ControllerPart.LSB	),
	64	: new ControllerDefinition( "Damper Pedal on/off (Sustain)",	ControllerPart.Standalone	),
	65	: new ControllerDefinition( "Portamento On/Off",	ControllerPart.Standalone	),
	66	: new ControllerDefinition( "Sostenuto On/Off",	ControllerPart.Standalone	),
	67	: new ControllerDefinition( "Soft Pedal On/Off",	ControllerPart.Standalone	),
	68	: new ControllerDefinition( "Legato Footswitch",	ControllerPart.Standalone	),
	69	: new ControllerDefinition( "Hold 2",	ControllerPart.Standalone	),
	70	: new ControllerDefinition( "Sound Controller 1",	ControllerPart.LSB	),
	71	: new ControllerDefinition( "Sound Controller 2",	ControllerPart.LSB	),
	72	: new ControllerDefinition( "Sound Controller 3",	ControllerPart.LSB	),
	73	: new ControllerDefinition( "Sound Controller 4",	ControllerPart.LSB	),
	74	: new ControllerDefinition( "Sound Controller 5",	ControllerPart.LSB	),
	75	: new ControllerDefinition( "Sound Controller 6",	ControllerPart.LSB	),
	76	: new ControllerDefinition( "Sound Controller 7",	ControllerPart.LSB	),
	77	: new ControllerDefinition( "Sound Controller 8",	ControllerPart.LSB	),
	78	: new ControllerDefinition( "Sound Controller 9",	ControllerPart.LSB	),
	79	: new ControllerDefinition( "Sound Controller 10 (default undefined)",	ControllerPart.LSB	),
	80	: new ControllerDefinition( "General Purpose Controller 5",	ControllerPart.LSB	),
	81	: new ControllerDefinition( "General Purpose Controller 6",	ControllerPart.LSB	),
	82	: new ControllerDefinition( "General Purpose Controller 7",	ControllerPart.LSB	),
	83	: new ControllerDefinition( "General Purpose Controller 8",	ControllerPart.LSB	),
	84	: new ControllerDefinition( "Portamento Control",	ControllerPart.LSB	),
	88	: new ControllerDefinition( "High Resolution Velocity Prefix",	ControllerPart.LSB	),
	91	: new ControllerDefinition( "Effects 1 Depth ",	ControllerPart.Standalone	),
	92	: new ControllerDefinition( "Effects 2 Depth",	ControllerPart.Standalone	),
	93	: new ControllerDefinition( "Effects 3 Depth ",	ControllerPart.Standalone	),
	94	: new ControllerDefinition( "Effects 4 Depth",	ControllerPart.Standalone	),
	95	: new ControllerDefinition( "Effects 5 Depth",	ControllerPart.Standalone	),
	96	: new ControllerDefinition( "Data Increment (Data Entry +1)",	ControllerPart.Standalone	),
	97	: new ControllerDefinition( "Data Decrement (Data Entry -1)",	ControllerPart.Standalone	),
	98	: new ControllerDefinition( "NRPN - LSB",	ControllerPart.LSB	),
	99	: new ControllerDefinition( "NRPN - MSB",	ControllerPart.MSB	),
	100	: new ControllerDefinition( "RPN - LSB",	ControllerPart.LSB	),
	101	: new ControllerDefinition( "RPN - MSB",	ControllerPart.MSB	),
	120	: new ControllerDefinition( "[Channel Mode Message] All Sound Off",	ControllerPart.Standalone	),
	121	: new ControllerDefinition( "[Channel Mode Message] Reset All Controllers ",	ControllerPart.Standalone	),
	122	: new ControllerDefinition( "[Channel Mode Message] Local Control On/Off",	ControllerPart.Standalone	),
	123	: new ControllerDefinition( "[Channel Mode Message] All Notes Off",	ControllerPart.Standalone	),
	124	: new ControllerDefinition( "[Channel Mode Message] Omni Mode Off (+ all notes off)",	ControllerPart.Standalone	),
	125	: new ControllerDefinition( "[Channel Mode Message] Omni Mode On (+ all notes off)",	ControllerPart.Standalone	),
	126	: new ControllerDefinition( "[Channel Mode Message] Mono Mode On (+ poly off, + all notes off)",	ControllerPart.Standalone	),
	127	: new ControllerDefinition( "[Channel Mode Message] Poly Mode On (+ mono off, +all notes off)",	ControllerPart.Standalone	)
}


function setupMidi() {
	navigator.requestMIDIAccess({sysex:true}).then( setupSuccess, setupFailure );
	midiEvents = $('#midiEvents');
}

function midiDataToString(data) {
	var numbers=[];
	for(var i=0;i<data.length;i++)
		numbers.push( hexDigits[ data[i]>>4] + hexDigits[data[i]&15] );

	return numbers.join(' ');
}

function numberToNote(number) {
	return "Note: "+number.toString();
}

function describeControllerData( controller, value ) {
	var rv = [];

	if ( controller in defaultControllerDefinitions ) {
		var cd = defaultControllerDefinitions[controller];

		rv.push( cd.description+" " );
		rv.push( cd.decoder(value) );

	} else
		rv.push( "Undefined :" + toHexAndDecimal(value) );

	return rv;
}

function handleMIDIMessage( ev ) {
	var messageText = "<tr id='midiEvent"+midiEventId+"'><td><span class='label "+(labelOffset[ev.currentTarget.id % 6])+"'>Port "+ev.currentTarget.id+" "+ev.currentTarget.manufacturer+" "+ev.currentTarget.name+"</span></td>";

	var first = ev.data[0];
	var topNibble = first >> 4;
	var bottomNibble = first & 15;
	var sysex = false;
	var description='';
	var channel = toHexAndDecimal(bottomNibble);

	switch(topNibble) {
		case 0x8:
			description = ["Note Off",numberToNote(ev.data[1]),"Velocity:"+toHexAndDecimal(ev.data[2])];
			break;

		case 0x9:
			description = [(ev.data[2] == 0)?"Note Off":"Note On",numberToNote(ev.data[1]),"Velocity:"+toHexAndDecimal(ev.data[2])];
			break;

		case 0xa:
			description = ["Polyphonic Key",numberToNote(ev.data[1]),"Pressure:"+toHexAndDecimal(ev.data[2]) ];
			break;

		case 0xb:
			description = ["Control Change","Controller:"+toHexAndDecimal(ev.data[1])].concat( describeControllerData( ev.data[1],ev.data[2] ) );
			break;

		case 0xc:
			description = ["Program Change: ",toHexAndDecimal(ev.data[1])];
			break;

		case 0xd:
			description = ["Channel Aftertouch","Pressure:"+toHexAndDecimal(ev.data[1])];
			break;

		case 0xe:
			description = ["Pitch Bend","Pressure:"+(ev.data[1]+(ev.data[2]<<7)-8192)];
			break;

		case 0xf:           //
			channel = '&nbsp;';
			switch(bottomNibble) {
				case 0:
					description = "System Exclusive length 0x" + ev.data.length.toString(16) + " | " + ev.data.length;
					sysex = true;
					break;
			}
			break;

		default:

	}

	if (sysex)
		messageText += "<td>&nbsp;</td><td>&nbsp;</td><td>"+description+"</td></tr>";
	else {
		messageText += "<td>" + midiDataToString(ev.data) + "</td><td>"+channel+"</td>";
		if (typeof description == "string")
			messageText+="<td>" + description + "</td>";
		else {
			for(var i=0;i<description.length;i++)
				messageText+="<td>" + description[i] + "</td>";
		}

		messageText+="</tr>";
	}

	midiEvents.append( messageText );
	$('#midiEvent'+midiEventId++)[0].scrollIntoView();
}

function setupSuccess( midiAccess ) {
	midi = midiAccess;

	var inputs = midi.inputs();
	for(var i=0; i<inputs.length;i++ )
		inputs[i].onmidimessage = handleMIDIMessage;

	outputs = midi.outputs();
}

function setupFailure( error ) {
	alert( "Failed to initialize MIDI - " + ((error.code==1) ? "permission denied" : ("error code " + error.code)) );
}