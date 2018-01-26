var app = new Vue({
    el: "#app",
    data: {
        midiFile: null,
        phase2: false,
        phase3: false,
        selectedTrack: -1,
        generatedTone: ''
    },
    computed: {
        currentFileName() {
            return this.midiFile === null ? "You haven't uploaded any!" : this.midiFile.header.name;
        },
        isTrackSelected() {
            return this.selectedTrack >= 0;
        },
    },
    methods: {
        fileUpload(e) {
            $("#file").trigger("click");
        },
        fileUploaded(e) {
            var files = e.target.files || e.dataTransfer.files;
            if (!files.length)
                return;
            this.praseMidi(files[0]);
        },
        bringToLife() {
            var notes = [];
            var durations = [];
            var track = this.midiFile.tracks[this.selectedTrack];
            for (var i = 0; i < track.notes.length; i++) {
                var note = track.notes[i];
                var noteStr = 'NOTE_' + note.name.replace('#', 'S');
                notes.push(noteStr);
                durations.push(note.duration * 1000);
            }

            this.phase3 = true;

            this.generatedTone = `// Genreated with ❤ by The bits of the sound!
// https://al1b.github.com/bit-sounds
// 
// ----------------------------------------------
// ${this.midiFile.header.name} song

#include "pitches.h"

// notes in the melody:
int melody[] = {
    ${JSON.stringify(notes)}
};

// note durations: 4 = quarter note, 8 = eighth note, etc.:
float noteDurations[] = {
    ${JSON.stringify(durations)}
};

void setup() {
    // iterate over the notes of the melody:
    for (int thisNote = 0; thisNote < ${durations.length}; thisNote++) {

    // to calculate the note duration, take one second divided by the note type.
    //e.g. quarter note = 1000 / 4, eighth note = 1000/8, etc.
    tone(8, melody[thisNote], noteDurations[thisNote]);

    // to distinguish the notes, set a minimum time between them.
    // the note's duration + 30% seems to work well:
    int pauseBetweenNotes = noteDurations[thisNote];
    delay(pauseBetweenNotes);
    
    // stop the tone playing:
    noTone(8);
    }
}

void loop() {
    // no need to repeat the melody.
    delay(7.5);
}`;
        },
        praseMidi(file) {

            if (file.name.indexOf(".mid") < 0)
                return;

            var vm = this;
            var reader = new FileReader();

            reader.onload = (e) => {
                var file = MidiConvert.parse(e.target.result);
                this.midiFile = file;

                this.phase2 = true;
            };
            reader.readAsBinaryString(file);
        },
        selectTrack(index) {
            this.selectedTrack = index;
            this.playTrack();
        },
        playTrack() {
            var synth = new Tone.PolySynth(8).toMaster();

            // make sure you set the tempo before you schedule the events
            Tone.Transport.bpm.value = this.midiFile.header.bpm

            // pass in the note events from one of the tracks as the second argument to Tone.Part 
            var midiPart = new Tone.Part(function (time, note) {

                //use the events to play the synth
                synth.triggerAttackRelease(note.name, note.duration, time, note.velocity)

            }, this.midiFile.tracks[this.selectedTrack].notes).start()

            // start the transport to hear the events
            Tone.Transport.start()
        },
        download() {
            var element = document.createElement('a');
            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(this.generatedTone));
            element.setAttribute('download', this.midiFile.header.name + ".ino");

            element.style.display = 'none';
            document.body.appendChild(element);

            element.click();

            document.body.removeChild(element);
        }
    }
});