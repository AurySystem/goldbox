var beepbox = (function (exports) {
    'use strict';

    /*!
    Copyright (C) 2020 John Nesky

    Permission is hereby granted, free of charge, to any person obtaining a copy of
    this software and associated documentation files (the "Software"), to deal in
    the Software without restriction, including without limitation the rights to
    use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
    of the Software, and to permit persons to whom the Software is furnished to do
    so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
    */
    class Config {
    }
    Config.thresholdVal = -10;
    Config.kneeVal = 40;
    Config.ratioVal = 12;
    Config.attackVal = 0;
    Config.releaseVal = 0.25;
    Config.scales = toNameMap([
        { name: "Free", realName: "chromatic", flags: [true, true, true, true, true, true, true, true, true, true, true, true] },
        { name: "Major", realName: "ionian", flags: [true, false, true, false, true, true, false, true, false, true, false, true] },
        { name: "Minor", realName: "aeolian", flags: [true, false, true, true, false, true, false, true, true, false, true, false] },
        { name: "Mixolydian", realName: "mixolydian", flags: [true, false, true, false, true, true, false, true, false, true, true, false] },
        { name: "Lydian", realName: "lydian", flags: [true, false, true, false, true, false, true, true, false, true, false, true] },
        { name: "Dorian", realName: "dorian", flags: [true, false, true, true, false, true, false, true, false, true, true, false] },
        { name: "Phrygian", realName: "phrygian", flags: [true, true, false, true, false, true, false, true, true, false, true, false] },
        { name: "Locrian", realName: "locrian", flags: [true, true, false, true, false, true, true, false, true, false, true, false] },
        { name: "Lydian Dominant", realName: "lydian dominant", flags: [true, false, true, false, true, false, true, true, false, true, true, false] },
        { name: "Phrygian Dominant", realName: "phrygian dominant", flags: [true, true, false, false, true, true, false, true, true, false, true, false] },
        { name: "Harmonic Major", realName: "harmonic major", flags: [true, false, true, false, true, true, false, true, true, false, false, true] },
        { name: "Harmonic Minor", realName: "harmonic minor", flags: [true, false, true, true, false, true, false, true, true, false, false, true] },
        { name: "Melodic Minor", realName: "melodic minor", flags: [true, false, true, true, false, true, false, true, false, true, false, true] },
        { name: "Blues", realName: "blues", flags: [true, false, false, true, false, true, true, true, false, false, true, false] },
        { name: "Altered", realName: "altered", flags: [true, true, false, true, true, false, true, false, true, false, true, false] },
        { name: "Major Pentatonic", realName: "major pentatonic", flags: [true, false, true, false, true, false, false, true, false, true, false, false] },
        { name: "Minor Pentatonic", realName: "minor pentatonic", flags: [true, false, false, true, false, true, false, true, false, false, true, false] },
        { name: "Whole Tone", realName: "whole tone", flags: [true, false, true, false, true, false, true, false, true, false, true, false] },
        { name: "Octatonic", realName: "octatonic", flags: [true, false, true, true, false, true, true, false, true, true, false, true] },
        { name: "Hexatonic", realName: "hexatonic", flags: [true, false, false, true, true, false, false, true, true, false, false, true] },
        { name: "Custom", realName: "custom", flags: [true, false, true, true, false, false, false, true, true, false, true, true] },
    ]);
    Config.keys = toNameMap([
        { name: "C", isWhiteKey: true, basePitch: 12 },
        { name: "C♯", isWhiteKey: false, basePitch: 13 },
        { name: "D", isWhiteKey: true, basePitch: 14 },
        { name: "D♯", isWhiteKey: false, basePitch: 15 },
        { name: "E", isWhiteKey: true, basePitch: 16 },
        { name: "F", isWhiteKey: true, basePitch: 17 },
        { name: "F♯", isWhiteKey: false, basePitch: 18 },
        { name: "G", isWhiteKey: true, basePitch: 19 },
        { name: "G♯", isWhiteKey: false, basePitch: 20 },
        { name: "A", isWhiteKey: true, basePitch: 21 },
        { name: "A♯", isWhiteKey: false, basePitch: 22 },
        { name: "B", isWhiteKey: true, basePitch: 23 },
    ]);
    Config.blackKeyNameParents = [-1, 1, -1, 1, -1, 1, -1, -1, 1, -1, 1, -1];
    Config.tempoMin = 30;
    Config.tempoMax = 320;
    Config.reverbRange = 32;
    Config.beatsPerBarMin = 2;
    Config.beatsPerBarMax = 16;
    Config.barCountMin = 1;
    Config.barCountMax = 256;
    Config.instrumentsPerChannelMin = 1;
    Config.instrumentsPerChannelMax = 10;
    Config.partsPerBeat = 24;
    Config.ticksPerPart = 2;
    Config.ticksPerArpeggio = 3;
    Config.arpeggioPatterns = [[0], [0, 1], [0, 1, 2, 1], [0, 1, 2, 3], [0, 1, 2, 3, 4], [0, 1, 2, 3, 4, 5], [0, 1, 2, 3, 4, 5, 6], [0, 1, 2, 3, 4, 5, 6, 7]];
    Config.rhythms = toNameMap([
        { name: "÷3 (triplets)", stepsPerBeat: 3, roundUpThresholds: [5, 12, 18] },
        { name: "÷4 (standard)", stepsPerBeat: 4, roundUpThresholds: [3, 9, 17, 21] },
        { name: "÷6", stepsPerBeat: 6, roundUpThresholds: null },
        { name: "÷8", stepsPerBeat: 8, roundUpThresholds: null },
        { name: "freehand", stepsPerBeat: 24, roundUpThresholds: null },
    ]);
    Config.instrumentTypeNames = ["chip", "FM", "noise", "spectrum", "drumset", "harmonics", "PWM", "custom chip", "mod"];
    Config.instrumentTypeHasSpecialInterval = [true, true, false, false, false, true, false, true];
    Config.chipWaves = toNameMap([
        { name: "rounded", volume: 0.94, samples: centerWave([0.0, 0.2, 0.4, 0.5, 0.6, 0.7, 0.8, 0.85, 0.9, 0.95, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.95, 0.9, 0.85, 0.8, 0.7, 0.6, 0.5, 0.4, 0.2, 0.0, -0.2, -0.4, -0.5, -0.6, -0.7, -0.8, -0.85, -0.9, -0.95, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -0.95, -0.9, -0.85, -0.8, -0.7, -0.6, -0.5, -0.4, -0.2]) },
        { name: "triangle", volume: 1.0, samples: centerWave([1.0 / 15.0, 3.0 / 15.0, 5.0 / 15.0, 7.0 / 15.0, 9.0 / 15.0, 11.0 / 15.0, 13.0 / 15.0, 15.0 / 15.0, 15.0 / 15.0, 13.0 / 15.0, 11.0 / 15.0, 9.0 / 15.0, 7.0 / 15.0, 5.0 / 15.0, 3.0 / 15.0, 1.0 / 15.0, -1.0 / 15.0, -3.0 / 15.0, -5.0 / 15.0, -7.0 / 15.0, -9.0 / 15.0, -11.0 / 15.0, -13.0 / 15.0, -15.0 / 15.0, -15.0 / 15.0, -13.0 / 15.0, -11.0 / 15.0, -9.0 / 15.0, -7.0 / 15.0, -5.0 / 15.0, -3.0 / 15.0, -1.0 / 15.0]) },
        { name: "square", volume: 0.5, samples: centerWave([1.0, -1.0]) },
        { name: "1/4 pulse", volume: 0.5, samples: centerWave([1.0, -1.0, -1.0, -1.0]) },
        { name: "1/8 pulse", volume: 0.5, samples: centerWave([1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0]) },
        { name: "sawtooth", volume: 0.65, samples: centerWave([1.0 / 31.0, 3.0 / 31.0, 5.0 / 31.0, 7.0 / 31.0, 9.0 / 31.0, 11.0 / 31.0, 13.0 / 31.0, 15.0 / 31.0, 17.0 / 31.0, 19.0 / 31.0, 21.0 / 31.0, 23.0 / 31.0, 25.0 / 31.0, 27.0 / 31.0, 29.0 / 31.0, 31.0 / 31.0, -31.0 / 31.0, -29.0 / 31.0, -27.0 / 31.0, -25.0 / 31.0, -23.0 / 31.0, -21.0 / 31.0, -19.0 / 31.0, -17.0 / 31.0, -15.0 / 31.0, -13.0 / 31.0, -11.0 / 31.0, -9.0 / 31.0, -7.0 / 31.0, -5.0 / 31.0, -3.0 / 31.0, -1.0 / 31.0]) },
        { name: "double saw", volume: 0.5, samples: centerWave([0.0, -0.2, -0.4, -0.6, -0.8, -1.0, 1.0, -0.8, -0.6, -0.4, -0.2, 1.0, 0.8, 0.6, 0.4, 0.2]) },
        { name: "double pulse", volume: 0.4, samples: centerWave([1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, -1.0, -1.0]) },
        { name: "spiky", volume: 0.4, samples: centerWave([1.0, -1.0, 1.0, -1.0, 1.0, 0.0]) },
        { name: "sine", volume: 0.88, samples: centerAndNormalizeWave([8.0, 9.0, 11.0, 12.0, 13.0, 14.0, 15.0, 15.0, 15.0, 15.0, 14.0, 14.0, 13.0, 11.0, 10.0, 9.0, 7.0, 6.0, 4.0, 3.0, 2.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 1.0, 2.0, 4.0, 5.0, 6.0]) },
        { name: "flute", volume: 0.8, samples: centerAndNormalizeWave([3.0, 4.0, 6.0, 8.0, 10.0, 11.0, 13.0, 14.0, 15.0, 15.0, 14.0, 13.0, 11.0, 8.0, 5.0, 3.0]) },
        { name: "harp", volume: 0.8, samples: centerAndNormalizeWave([0.0, 3.0, 3.0, 3.0, 4.0, 5.0, 5.0, 6.0, 7.0, 8.0, 9.0, 11.0, 11.0, 13.0, 13.0, 15.0, 15.0, 14.0, 12.0, 11.0, 10.0, 9.0, 8.0, 7.0, 7.0, 5.0, 4.0, 3.0, 2.0, 1.0, 0.0, 0.0]) },
        { name: "sharp clarinet", volume: 0.38, samples: centerAndNormalizeWave([0.0, 0.0, 0.0, 1.0, 1.0, 8.0, 8.0, 9.0, 9.0, 9.0, 8.0, 8.0, 8.0, 8.0, 8.0, 9.0, 9.0, 7.0, 9.0, 9.0, 10.0, 4.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]) },
        { name: "soft clarinet", volume: 0.45, samples: centerAndNormalizeWave([0.0, 1.0, 5.0, 8.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 11.0, 11.0, 12.0, 13.0, 12.0, 10.0, 9.0, 7.0, 6.0, 4.0, 3.0, 3.0, 3.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0]) },
        { name: "alto sax", volume: 0.3, samples: centerAndNormalizeWave([5.0, 5.0, 6.0, 4.0, 3.0, 6.0, 8.0, 7.0, 2.0, 1.0, 5.0, 6.0, 5.0, 4.0, 5.0, 7.0, 9.0, 11.0, 13.0, 14.0, 14.0, 14.0, 14.0, 13.0, 10.0, 8.0, 7.0, 7.0, 4.0, 3.0, 4.0, 2.0]) },
        { name: "bassoon", volume: 0.35, samples: centerAndNormalizeWave([9.0, 9.0, 7.0, 6.0, 5.0, 4.0, 4.0, 4.0, 4.0, 5.0, 7.0, 8.0, 9.0, 10.0, 11.0, 13.0, 13.0, 11.0, 10.0, 9.0, 7.0, 6.0, 4.0, 2.0, 1.0, 1.0, 1.0, 2.0, 2.0, 5.0, 11.0, 14.0]) },
        { name: "trumpet", volume: 0.22, samples: centerAndNormalizeWave([10.0, 11.0, 8.0, 6.0, 5.0, 5.0, 5.0, 6.0, 7.0, 7.0, 7.0, 7.0, 6.0, 6.0, 7.0, 7.0, 7.0, 7.0, 7.0, 6.0, 6.0, 6.0, 6.0, 6.0, 6.0, 6.0, 6.0, 7.0, 8.0, 9.0, 11.0, 14.0]) },
        { name: "electric guitar", volume: 0.2, samples: centerAndNormalizeWave([11.0, 12.0, 12.0, 10.0, 6.0, 6.0, 8.0, 0.0, 2.0, 4.0, 8.0, 10.0, 9.0, 10.0, 1.0, 7.0, 11.0, 3.0, 6.0, 6.0, 8.0, 13.0, 14.0, 2.0, 0.0, 12.0, 8.0, 4.0, 13.0, 11.0, 10.0, 13.0]) },
        { name: "organ", volume: 0.2, samples: centerAndNormalizeWave([11.0, 10.0, 12.0, 11.0, 14.0, 7.0, 5.0, 5.0, 12.0, 10.0, 10.0, 9.0, 12.0, 6.0, 4.0, 5.0, 13.0, 12.0, 12.0, 10.0, 12.0, 5.0, 2.0, 2.0, 8.0, 6.0, 6.0, 5.0, 8.0, 3.0, 2.0, 1.0]) },
        { name: "pan flute", volume: 0.35, samples: centerAndNormalizeWave([1.0, 4.0, 7.0, 6.0, 7.0, 9.0, 7.0, 7.0, 11.0, 12.0, 13.0, 15.0, 13.0, 11.0, 11.0, 12.0, 13.0, 10.0, 7.0, 5.0, 3.0, 6.0, 10.0, 7.0, 3.0, 3.0, 1.0, 0.0, 1.0, 0.0, 1.0, 0.0]) },
        { name: "glitch", volume: 0.5, samples: centerWave([1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0]) },
    ]);
    Config.chipNoises = toNameMap([
        { name: "retro", volume: 0.25, basePitch: 69, pitchFilterMult: 1024.0, isSoft: false, samples: null },
        { name: "white", volume: 1.0, basePitch: 69, pitchFilterMult: 8.0, isSoft: true, samples: null },
        { name: "clang", volume: 0.4, basePitch: 69, pitchFilterMult: 1024.0, isSoft: false, samples: null },
        { name: "buzz", volume: 0.3, basePitch: 69, pitchFilterMult: 1024.0, isSoft: false, samples: null },
        { name: "hollow", volume: 1.5, basePitch: 96, pitchFilterMult: 1.0, isSoft: true, samples: null },
        { name: "shine", volume: 1.0, basePitch: 69, pitchFilterMult: 1024.0, isSoft: false, samples: null },
        { name: "deep", volume: 1.5, basePitch: 120, pitchFilterMult: 1024.0, isSoft: true, samples: null },
        { name: "cutter", volume: 0.005, basePitch: 96, pitchFilterMult: 1024.0, isSoft: false, samples: null },
        { name: "metallic", volume: 1.0, basePitch: 96, pitchFilterMult: 1024.0, isSoft: false, samples: null },
        { name: "uhhh??", volume: 1.0, basePitch: 96, pitchFilterMult: 1024.0, isSoft: false, samples: null },
    ]);
    Config.filterCutoffMaxHz = 8000;
    Config.filterCutoffMinHz = 1;
    Config.filterMax = 0.95;
    Config.filterMaxResonance = 0.95;
    Config.filterCutoffRange = 11;
    Config.filterResonanceRange = 8;
    Config.transitions = toNameMap([
        { name: "seamless", isSeamless: true, attackSeconds: 0.0, releases: false, releaseTicks: 1, slides: false, slideTicks: 3 },
        { name: "hard", isSeamless: false, attackSeconds: 0.0, releases: false, releaseTicks: 3, slides: false, slideTicks: 3 },
        { name: "soft", isSeamless: false, attackSeconds: 0.025, releases: false, releaseTicks: 3, slides: false, slideTicks: 3 },
        { name: "slide", isSeamless: true, attackSeconds: 0.025, releases: false, releaseTicks: 3, slides: true, slideTicks: 3 },
        { name: "cross fade", isSeamless: false, attackSeconds: 0.04, releases: true, releaseTicks: 6, slides: false, slideTicks: 3 },
        { name: "hard fade", isSeamless: false, attackSeconds: 0.0, releases: true, releaseTicks: 48, slides: false, slideTicks: 3 },
        { name: "medium fade", isSeamless: false, attackSeconds: 0.0125, releases: true, releaseTicks: 72, slides: false, slideTicks: 3 },
        { name: "soft fade", isSeamless: false, attackSeconds: 0.06, releases: true, releaseTicks: 96, slides: false, slideTicks: 6 },
        { name: "sliding fade", isSeamless: false, attackSeconds: 0.08, releases: true, releaseTicks: 96, slides: true, slideTicks: 6 },
    ]);
    Config.vibratos = toNameMap([
        { name: "none", amplitude: 0.0, type: 0, delayParts: 0 },
        { name: "light", amplitude: 0.15, type: 0, delayParts: 0 },
        { name: "delayed", amplitude: 0.3, type: 0, delayParts: 18 },
        { name: "heavy", amplitude: 0.45, type: 0, delayParts: 0 },
        { name: "shaky", amplitude: 0.1, type: 1, delayParts: 0 },
    ]);
    Config.vibratoTypes = toNameMap([
        { name: "normal", periodsSeconds: [0.14], period: 0.14 },
        { name: "shaky", periodsSeconds: [0.11, 1.618 * 0.11, 3 * 0.11], period: 266.97 },
    ]);
    Config.arpSpeedScale = [0, 0.0625, 0.125, 0.2, 0.25, 1 / 3, 0.4, 0.5, 2 / 3, 0.75, 0.8, 0.9, 1, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 3, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 4, 4.15, 4.3, 4.5, 4.8, 5, 5.5, 6, 8];
    Config.intervals = toNameMap([
        { name: "union", spread: 0.0, offset: 0.0, volume: 0.7, sign: 1.0 },
        { name: "shimmer", spread: 0.018, offset: 0.0, volume: 0.8, sign: 1.0 },
        { name: "hum", spread: 0.045, offset: 0.0, volume: 1.0, sign: 1.0 },
        { name: "honky tonk", spread: 0.09, offset: 0.0, volume: 1.0, sign: 1.0 },
        { name: "dissonant", spread: 0.25, offset: 0.0, volume: 0.9, sign: 1.0 },
        { name: "fifth", spread: 3.5, offset: 3.5, volume: 0.9, sign: 1.0 },
        { name: "octave", spread: 6.0, offset: 6.0, volume: 0.8, sign: 1.0 },
        { name: "bowed", spread: 0.02, offset: 0.0, volume: 1.0, sign: -1.0 },
        { name: "piano", spread: 0.01, offset: 0.0, volume: 1.0, sign: 0.7 },
        { name: "warbled", spread: 0.25, offset: 0.05, volume: 0.9, sign: -0.8 },
    ]);
    Config.effectsNames = ["none", "reverb", "chorus", "chorus & reverb"];
    Config.volumeRange = 50;
    Config.volumeLogScale = 0.1428;
    Config.panCenter = 50;
    Config.panMax = Config.panCenter * 2;
    Config.detuneMin = -50;
    Config.detuneMax = 50;
    Config.songDetuneMin = -250;
    Config.songDetuneMax = 250;
    Config.chords = toNameMap([
        { name: "harmony", harmonizes: true, customInterval: false, arpeggiates: false, isCustomInterval: false, strumParts: 0 },
        { name: "strum", harmonizes: true, customInterval: false, arpeggiates: false, isCustomInterval: false, strumParts: 1 },
        { name: "arpeggio", harmonizes: false, customInterval: false, arpeggiates: true, isCustomInterval: false, strumParts: 0 },
        { name: "custom interval", harmonizes: true, customInterval: true, arpeggiates: true, isCustomInterval: true, strumParts: 0 },
    ]);
    Config.maxChordSize = 9;
    Config.operatorCount = 4;
    Config.algorithms = toNameMap([
        { name: "1←(2 3 4)", carrierCount: 1, associatedCarrier: [1, 1, 1, 1], modulatedBy: [[2, 3, 4], [], [], []] },
        { name: "1←(2 3←4)", carrierCount: 1, associatedCarrier: [1, 1, 1, 1], modulatedBy: [[2, 3], [], [4], []] },
        { name: "1←2←(3 4)", carrierCount: 1, associatedCarrier: [1, 1, 1, 1], modulatedBy: [[2], [3, 4], [], []] },
        { name: "1←(2 3)←4", carrierCount: 1, associatedCarrier: [1, 1, 1, 1], modulatedBy: [[2, 3], [4], [4], []] },
        { name: "1←2←3←4", carrierCount: 1, associatedCarrier: [1, 1, 1, 1], modulatedBy: [[2], [3], [4], []] },
        { name: "1←3 2←4", carrierCount: 2, associatedCarrier: [1, 2, 1, 2], modulatedBy: [[3], [4], [], []] },
        { name: "1 2←(3 4)", carrierCount: 2, associatedCarrier: [1, 2, 2, 2], modulatedBy: [[], [3, 4], [], []] },
        { name: "1 2←3←4", carrierCount: 2, associatedCarrier: [1, 2, 2, 2], modulatedBy: [[], [3], [4], []] },
        { name: "(1 2)←3←4", carrierCount: 2, associatedCarrier: [1, 2, 2, 2], modulatedBy: [[3], [3], [4], []] },
        { name: "(1 2)←(3 4)", carrierCount: 2, associatedCarrier: [1, 2, 2, 2], modulatedBy: [[3, 4], [3, 4], [], []] },
        { name: "1 2 3←4", carrierCount: 3, associatedCarrier: [1, 2, 3, 3], modulatedBy: [[], [], [4], []] },
        { name: "(1 2 3)←4", carrierCount: 3, associatedCarrier: [1, 2, 3, 3], modulatedBy: [[4], [4], [4], []] },
        { name: "1 2 3 4", carrierCount: 4, associatedCarrier: [1, 2, 3, 4], modulatedBy: [[], [], [], []] },
        { name: "1←(2 3) 2←4", carrierCount: 2, associatedCarrier: [1, 2, 1, 2], modulatedBy: [[2, 3], [4], [], []] },
    ]);
    Config.operatorCarrierInterval = [0.0, 0.04, -0.073, 0.091];
    Config.operatorAmplitudeMax = 15;
    Config.operatorFrequencies = toNameMap([
        { name: "1×", mult: 1.0, hzOffset: 0.0, amplitudeSign: 1.0 },
        { name: "~1×", mult: 1.0, hzOffset: 1.5, amplitudeSign: -1.0 },
        { name: "2×", mult: 2.0, hzOffset: 0.0, amplitudeSign: 1.0 },
        { name: "~2×", mult: 2.0, hzOffset: -1.3, amplitudeSign: -1.0 },
        { name: "3×", mult: 3.0, hzOffset: 0.0, amplitudeSign: 1.0 },
        { name: "4×", mult: 4.0, hzOffset: 0.0, amplitudeSign: 1.0 },
        { name: "5×", mult: 5.0, hzOffset: 0.0, amplitudeSign: 1.0 },
        { name: "6×", mult: 6.0, hzOffset: 0.0, amplitudeSign: 1.0 },
        { name: "7×", mult: 7.0, hzOffset: 0.0, amplitudeSign: 1.0 },
        { name: "8×", mult: 8.0, hzOffset: 0.0, amplitudeSign: 1.0 },
        { name: "9×", mult: 9.0, hzOffset: 0.0, amplitudeSign: 1.0 },
        { name: "11×", mult: 11.0, hzOffset: 0.0, amplitudeSign: 1.0 },
        { name: "13×", mult: 13.0, hzOffset: 0.0, amplitudeSign: 1.0 },
        { name: "16×", mult: 16.0, hzOffset: 0.0, amplitudeSign: 1.0 },
        { name: "20×", mult: 20.0, hzOffset: 0.0, amplitudeSign: 1.0 },
        { name: "0.5×", mult: 0.5, hzOffset: 0.0, amplitudeSign: 1.0 },
        { name: "0.25×", mult: 0.25, hzOffset: 0.0, amplitudeSign: 1.0 },
        { name: "3.5×", mult: 3.5, hzOffset: -0.05, amplitudeSign: 1.0 },
    ]);
    Config.envelopes = toNameMap([
        { name: "custom", type: 0, speed: 0.0 },
        { name: "steady", type: 1, speed: 0.0 },
        { name: "punch", type: 2, speed: 0.0 },
        { name: "flare 1", type: 3, speed: 32.0 },
        { name: "flare 2", type: 3, speed: 8.0 },
        { name: "flare 3", type: 3, speed: 2.0 },
        { name: "twang 1", type: 4, speed: 32.0 },
        { name: "twang 2", type: 4, speed: 8.0 },
        { name: "twang 3", type: 4, speed: 2.0 },
        { name: "swell 1", type: 5, speed: 32.0 },
        { name: "swell 2", type: 5, speed: 8.0 },
        { name: "swell 3", type: 5, speed: 2.0 },
        { name: "tremolo1", type: 6, speed: 4.0 },
        { name: "tremolo2", type: 6, speed: 2.0 },
        { name: "tremolo3", type: 6, speed: 1.0 },
        { name: "tremolo4", type: 7, speed: 4.0 },
        { name: "tremolo5", type: 7, speed: 2.0 },
        { name: "tremolo6", type: 7, speed: 1.0 },
        { name: "decay 1", type: 8, speed: 10.0 },
        { name: "decay 2", type: 8, speed: 7.0 },
        { name: "decay 3", type: 8, speed: 4.0 },
        { name: "wibble 1", type: 9, speed: 24.0 },
        { name: "wibble 2", type: 9, speed: 12.0 },
        { name: "wibble 3", type: 9, speed: 4.0 },
        { name: "linear 1", type: 11, speed: 12.0 },
        { name: "linear 2", type: 11, speed: 4.0 },
        { name: "linear 3", type: 11, speed: 1.0 },
        { name: "hard", type: 10, speed: 6.0 },
    ]);
    Config.feedbacks = toNameMap([
        { name: "1⟲", indices: [[1], [], [], []] },
        { name: "2⟲", indices: [[], [2], [], []] },
        { name: "3⟲", indices: [[], [], [3], []] },
        { name: "4⟲", indices: [[], [], [], [4]] },
        { name: "1⟲ 2⟲", indices: [[1], [2], [], []] },
        { name: "3⟲ 4⟲", indices: [[], [], [3], [4]] },
        { name: "1⟲ 2⟲ 3⟲", indices: [[1], [2], [3], []] },
        { name: "2⟲ 3⟲ 4⟲", indices: [[], [2], [3], [4]] },
        { name: "1⟲ 2⟲ 3⟲ 4⟲", indices: [[1], [2], [3], [4]] },
        { name: "1→2", indices: [[], [1], [], []] },
        { name: "1→3", indices: [[], [], [1], []] },
        { name: "1→4", indices: [[], [], [], [1]] },
        { name: "2→3", indices: [[], [], [2], []] },
        { name: "2→4", indices: [[], [], [], [2]] },
        { name: "3→4", indices: [[], [], [], [3]] },
        { name: "1→3 2→4", indices: [[], [], [1], [2]] },
        { name: "1→4 2→3", indices: [[], [], [2], [1]] },
        { name: "1→2→3→4", indices: [[], [1], [2], [3]] },
        { name: "1↔2 3↔4", indices: [[2], [1], [4], [3]] },
        { name: "1↔4 2↔3", indices: [[4], [3], [2], [1]] },
        { name: "2→1→4→3→2", indices: [[2], [3], [4], [1]] },
    ]);
    Config.chipNoiseLength = 1 << 15;
    Config.spectrumBasePitch = 24;
    Config.spectrumControlPoints = 30;
    Config.spectrumControlPointsPerOctave = 7;
    Config.spectrumControlPointBits = 3;
    Config.spectrumMax = (1 << Config.spectrumControlPointBits) - 1;
    Config.harmonicsControlPoints = 28;
    Config.harmonicsRendered = 64;
    Config.harmonicsControlPointBits = 3;
    Config.harmonicsMax = (1 << Config.harmonicsControlPointBits) - 1;
    Config.harmonicsWavelength = 1 << 11;
    Config.pulseWidthRange = 50;
    Config.pitchChannelCountMin = 1;
    Config.pitchChannelCountMax = 40;
    Config.noiseChannelCountMin = 0;
    Config.noiseChannelCountMax = 8;
    Config.modChannelCountMin = 0;
    Config.modChannelCountMax = 8;
    Config.noiseInterval = 6;
    Config.pitchesPerOctave = 12;
    Config.drumCount = 12;
    Config.modCount = 6;
    Config.pitchOctaves = 8;
    Config.maxScrollableOctaves = 5;
    Config.maxPitch = Config.pitchOctaves * Config.pitchesPerOctave;
    Config.maximumTonesPerChannel = Config.maxChordSize * 2;
    Config.sineWaveLength = 1 << 8;
    Config.sineWaveMask = Config.sineWaveLength - 1;
    Config.sineWave = generateSineWave();
    Config.triWave = generateTriWave();
    Config.squareWave = generateSquareWave();
    Config.sawWave = generateSawWave();
    Config.barEditorHeight = 10;
    function centerWave(wave) {
        let sum = 0.0;
        for (let i = 0; i < wave.length; i++) {
            sum += wave[i];
        }
        const average = sum / wave.length;
        let cumulative = 0;
        let wavePrev = 0;
        for (let i = 0; i < wave.length; i++) {
            cumulative += wavePrev;
            wavePrev = wave[i] - average;
            wave[i] = cumulative;
        }
        wave.push(0);
        return new Float64Array(wave);
    }
    function centerAndNormalizeWave(wave) {
        let sum = 0.0;
        let magn = 0.0;
        for (let i = 0; i < wave.length; i++) {
            sum += wave[i];
            magn += Math.abs(wave[i]);
        }
        const average = sum / wave.length;
        const magnAvg = magn / wave.length;
        let cumulative = 0;
        let wavePrev = 0;
        for (let i = 0; i < wave.length; i++) {
            cumulative += wavePrev;
            wavePrev = (wave[i] - average) / (magnAvg);
            wave[i] = cumulative;
        }
        wave.push(0);
        return new Float64Array(wave);
    }
    function getDrumWave(index, inverseRealFourierTransform = null, scaleElementsByFactor = null) {
        let wave = Config.chipNoises[index].samples;
        if (wave == null) {
            wave = new Float32Array(Config.chipNoiseLength + 1);
            Config.chipNoises[index].samples = wave;
            if (index == 0) {
                let drumBuffer = 1;
                for (let i = 0; i < Config.chipNoiseLength; i++) {
                    wave[i] = (drumBuffer & 1) * 2.0 - 1.0;
                    let newBuffer = drumBuffer >> 1;
                    if (((drumBuffer + newBuffer) & 1) == 1) {
                        newBuffer += 1 << 14;
                    }
                    drumBuffer = newBuffer;
                }
            }
            else if (index == 1) {
                for (let i = 0; i < Config.chipNoiseLength; i++) {
                    wave[i] = Math.random() * 2.0 - 1.0;
                }
            }
            else if (index == 2) {
                let drumBuffer = 1;
                for (let i = 0; i < Config.chipNoiseLength; i++) {
                    wave[i] = (drumBuffer & 1) * 2.0 - 1.0;
                    let newBuffer = drumBuffer >> 1;
                    if (((drumBuffer + newBuffer) & 1) == 1) {
                        newBuffer += 2 << 14;
                    }
                    drumBuffer = newBuffer;
                }
            }
            else if (index == 3) {
                let drumBuffer = 1;
                for (let i = 0; i < Config.chipNoiseLength; i++) {
                    wave[i] = (drumBuffer & 1) * 2.0 - 1.0;
                    let newBuffer = drumBuffer >> 1;
                    if (((drumBuffer + newBuffer) & 1) == 1) {
                        newBuffer += 10 << 2;
                    }
                    drumBuffer = newBuffer;
                }
            }
            else if (index == 4) {
                drawNoiseSpectrum(wave, 10, 11, 1, 1, 0);
                drawNoiseSpectrum(wave, 11, 14, .6578, .6578, 0);
                inverseRealFourierTransform(wave, Config.chipNoiseLength);
                scaleElementsByFactor(wave, 1.0 / Math.sqrt(Config.chipNoiseLength));
            }
            else if (index == 5) {
                var drumBuffer = 1;
                for (var i = 0; i < Config.chipNoiseLength; i++) {
                    wave[i] = (drumBuffer & 1) * 2.0 - 1.0;
                    var newBuffer = drumBuffer >> 1;
                    if (((drumBuffer + newBuffer) & 1) == 1) {
                        newBuffer += 10 << 2;
                    }
                    drumBuffer = newBuffer;
                }
            }
            else if (index == 6) {
                drawNoiseSpectrum(wave, 1, 10, 1, 1, 0);
                drawNoiseSpectrum(wave, 20, 14, -2, -2, 0);
                inverseRealFourierTransform(wave, Config.chipNoiseLength);
                scaleElementsByFactor(wave, 1.0 / Math.sqrt(Config.chipNoiseLength));
            }
            else if (index == 7) {
                var drumBuffer = 1;
                for (var i = 0; i < Config.chipNoiseLength; i++) {
                    wave[i] = (drumBuffer & 1) * 4.0 * (Math.random() * 14 + 1);
                    var newBuffer = drumBuffer >> 1;
                    if (((drumBuffer + newBuffer) & 1) == 1) {
                        newBuffer += 15 << 2;
                    }
                    drumBuffer = newBuffer;
                }
            }
            else if (index == 8) {
                var drumBuffer = 1;
                for (var i = 0; i < 32768; i++) {
                    wave[i] = (drumBuffer & 1) / 2.0 + 0.5;
                    var newBuffer = drumBuffer >> 1;
                    if (((drumBuffer + newBuffer) & 1) == 1) {
                        newBuffer -= 10 << 2;
                    }
                    drumBuffer = newBuffer;
                }
            }
            else if (index == 9) {
                let drumBuffer = 1;
                for (let i = 0; i < Config.chipNoiseLength; i++) {
                    wave[i] = (drumBuffer & 1) * 2.0 - 1.1;
                    let newBuffer = drumBuffer >> 1;
                    if (((drumBuffer + newBuffer) & 1) == 1) {
                        newBuffer += 16 ^ 4 << 2;
                    }
                    drumBuffer = newBuffer;
                }
            }
            else {
                throw new Error("Unrecognized drum index: " + index);
            }
            wave[Config.chipNoiseLength] = wave[0];
        }
        return wave;
    }
    function drawNoiseSpectrum(wave, lowOctave, highOctave, lowPower, highPower, overallSlope) {
        const referenceOctave = 11;
        const referenceIndex = 1 << referenceOctave;
        const lowIndex = Math.pow(2, lowOctave) | 0;
        const highIndex = Math.min(Config.chipNoiseLength >> 1, Math.pow(2, highOctave) | 0);
        const retroWave = getDrumWave(0);
        let combinedAmplitude = 0.0;
        for (let i = lowIndex; i < highIndex; i++) {
            let lerped = lowPower + (highPower - lowPower) * (Math.log(i) / Math.LN2 - lowOctave) / (highOctave - lowOctave);
            let amplitude = Math.pow(2, (lerped - 1) * Config.spectrumMax + 1) * lerped;
            amplitude *= Math.pow(i / referenceIndex, overallSlope);
            combinedAmplitude += amplitude;
            amplitude *= retroWave[i];
            const radians = 0.61803398875 * i * i * Math.PI * 2.0;
            wave[i] = Math.cos(radians) * amplitude;
            wave[Config.chipNoiseLength - i] = Math.sin(radians) * amplitude;
        }
        return combinedAmplitude;
    }
    function generateSineWave() {
        const wave = new Float64Array(Config.sineWaveLength + 1);
        for (let i = 0; i < Config.sineWaveLength + 1; i++) {
            wave[i] = Math.sin(i * Math.PI * 2.0 / Config.sineWaveLength);
        }
        return wave;
    }
    function generateTriWave() {
        const wave = new Float64Array(Config.sineWaveLength + 1);
        for (let i = 0; i < Config.sineWaveLength + 1; i++) {
            wave[i] = Math.asin(Math.sin(i * Math.PI * 2.0 / Config.sineWaveLength)) / (Math.PI / 2);
        }
        return wave;
    }
    function generateSquareWave() {
        const wave = new Float64Array(Config.sineWaveLength + 1);
        for (let i = 0; i < Config.sineWaveLength + 1; i++) {
            wave[i] = Math.sin(i * Math.PI * 2.0 / Config.sineWaveLength);
            wave[i] = wave[i] > 0 ? 1.0 : -1.0;
        }
        return wave;
    }
    function generateSawWave() {
        const wave = new Float64Array(Config.sineWaveLength + 1);
        for (let i = 0; i < Config.sineWaveLength + 1; i++) {
            wave[i] = ((i - (Config.sineWaveLength * 0.75) + Config.sineWaveLength) * 2.0 / Config.sineWaveLength) % 2 - 1;
        }
        return wave;
    }
    function getArpeggioPitchIndex(pitchCount, useFastTwoNoteArp, arpeggio) {
        let arpeggioPattern = Config.arpeggioPatterns[pitchCount - 1];
        if (arpeggioPattern != null) {
            if (pitchCount == 2 && useFastTwoNoteArp == false) {
                arpeggioPattern = [0, 0, 1, 1];
            }
            return arpeggioPattern[arpeggio % arpeggioPattern.length];
        }
        else {
            return arpeggio % pitchCount;
        }
    }
    function toNameMap(array) {
        const dictionary = {};
        for (let i = 0; i < array.length; i++) {
            const value = array[i];
            value.index = i;
            dictionary[value.name] = value;
        }
        const result = array;
        result.dictionary = dictionary;
        return result;
    }

    var __values = (exports && exports.__values) || function(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m) return m.call(o);
        if (o && typeof o.length === "number") return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    };
    var __read = (exports && exports.__read) || function (o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    };
    var __spread = (exports && exports.__spread) || function () {
        for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
        return ar;
    };
    function applyElementArgs(element, args) {
        var e_1, _a, e_2, _b, e_3, _c;
        try {
            for (var args_1 = __values(args), args_1_1 = args_1.next(); !args_1_1.done; args_1_1 = args_1.next()) {
                var arg = args_1_1.value;
                if (arg instanceof Node) {
                    element.appendChild(arg);
                }
                else if (typeof arg === "string") {
                    element.appendChild(document.createTextNode(arg));
                }
                else if (typeof arg === "function") {
                    applyElementArgs(element, [arg()]);
                }
                else if (Array.isArray(arg)) {
                    applyElementArgs(element, arg);
                }
                else if (arg && typeof Symbol !== "undefined" && typeof arg[Symbol.iterator] === "function") {
                    applyElementArgs(element, __spread(arg));
                }
                else if (arg && arg.constructor === Object && element instanceof Element) {
                    try {
                        for (var _d = (e_2 = void 0, __values(Object.keys(arg))), _e = _d.next(); !_e.done; _e = _d.next()) {
                            var key = _e.value;
                            var value = arg[key];
                            if (key === "class") {
                                if (typeof value === "string") {
                                    element.setAttribute("class", value);
                                }
                                else if (Array.isArray(arg) || (value && typeof Symbol !== "undefined" && typeof value[Symbol.iterator] === "function")) {
                                    element.setAttribute("class", __spread(value).join(" "));
                                }
                                else {
                                    console.warn("Invalid " + key + " value \"" + value + "\" on " + element.tagName + " element.");
                                }
                            }
                            else if (key === "style") {
                                if (value && value.constructor === Object) {
                                    try {
                                        for (var _f = (e_3 = void 0, __values(Object.keys(value))), _g = _f.next(); !_g.done; _g = _f.next()) {
                                            var styleKey = _g.value;
                                            if (styleKey in element.style) {
                                                element.style[styleKey] = value[styleKey];
                                            }
                                            else {
                                                element.style.setProperty(styleKey, value[styleKey]);
                                            }
                                        }
                                    }
                                    catch (e_3_1) { e_3 = { error: e_3_1 }; }
                                    finally {
                                        try {
                                            if (_g && !_g.done && (_c = _f.return)) _c.call(_f);
                                        }
                                        finally { if (e_3) throw e_3.error; }
                                    }
                                }
                                else {
                                    element.setAttribute(key, value);
                                }
                            }
                            else if (typeof (value) === "function") {
                                element[key] = value;
                            }
                            else if (typeof (value) === "boolean") {
                                if (value)
                                    element.setAttribute(key, "");
                                else
                                    element.removeAttribute(key);
                            }
                            else {
                                element.setAttribute(key, value);
                            }
                        }
                    }
                    catch (e_2_1) { e_2 = { error: e_2_1 }; }
                    finally {
                        try {
                            if (_e && !_e.done && (_b = _d.return)) _b.call(_d);
                        }
                        finally { if (e_2) throw e_2.error; }
                    }
                }
                else {
                    element.appendChild(document.createTextNode(arg));
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (args_1_1 && !args_1_1.done && (_a = args_1.return)) _a.call(args_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return element;
    }
    var svgNS = "http://www.w3.org/2000/svg";
    function parseHTML() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return document.createRange().createContextualFragment(args.join());
    }
    function parseSVG() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var fragment = document.createDocumentFragment();
        var svgParser = new DOMParser().parseFromString("<svg xmlns=\"http://www.w3.org/2000/svg\">" + args.join() + "</svg>", "image/svg+xml").documentElement;
        while (svgParser.firstChild !== null) {
            document.importNode(svgParser.firstChild, true);
            fragment.appendChild(svgParser.firstChild);
        }
        return fragment;
    }

    var __values$1 = (exports && exports.__values) || function(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m) return m.call(o);
        if (o && typeof o.length === "number") return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    };
    var e_1, _a, e_2, _b;
    var HTML = parseHTML;
    var SVG = parseSVG;
    var _loop_1 = function (name_1) {
        HTML[name_1] = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return applyElementArgs(document.createElement(name_1), args);
        };
    };
    try {
        for (var _c = __values$1("a abbr address area article aside audio b base bdi bdo blockquote br button canvas caption cite code col colgroup datalist dd del details dfn dialog div dl dt em embed fieldset figcaption figure footer form h1 h2 h3 h4 h5 h6 header hr i iframe img input ins kbd label legend li link main map mark menu menuitem meta meter nav noscript object ol optgroup option output p param picture pre progress q rp rt ruby s samp script section select small source span strong style sub summary sup table tbody td template textarea tfoot th thead time title tr track u ul var video wbr".split(" ")), _d = _c.next(); !_d.done; _d = _c.next()) {
            var name_1 = _d.value;
            _loop_1(name_1);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
        }
        finally { if (e_1) throw e_1.error; }
    }
    var _loop_2 = function (name_2) {
        SVG[name_2] = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return applyElementArgs(document.createElementNS(svgNS, name_2), args);
        };
        if (/-/.test(name_2)) {
            var snakeCaseName = name_2.replace(/-/g, "_");
            SVG[snakeCaseName] = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return applyElementArgs(document.createElementNS(svgNS, name_2), args);
            };
        }
    };
    try {
        for (var _e = __values$1("a altGlyph altGlyphDef altGlyphItem animate animateMotion animateTransform circle clipPath color-profile cursor defs desc discard ellipse feBlend feColorMatrix feComponentTransfer feComposite feConvolveMatrix feDiffuseLighting feDisplacementMap feDistantLight feDropShadow feFlood feFuncA feFuncB feFuncG feFuncR feGaussianBlur feImage feMerge feMergeNode feMorphology feOffset fePointLight feSpecularLighting feSpotLight feTile feTurbulence filter font font-face font-face-format font-face-name font-face-src font-face-uri foreignObject g glyph glyphRef hkern image line linearGradient marker mask metadata missing-glyph mpath path pattern polygon polyline radialGradient rect script set stop style svg switch symbol text textPath title tref tspan use view vkern".split(" ")), _f = _e.next(); !_f.done; _f = _e.next()) {
            var name_2 = _f.value;
            _loop_2(name_2);
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
        }
        finally { if (e_2) throw e_2.error; }
    }

    class ColorConfig {
        static resetColors() {
            this.colorLookup.clear();
        }
        static getComputedChannelColor(song, channel) {
            if (getComputedStyle(this._styleElement).getPropertyValue("--use-color-formula").trim() == "false") {
                let base = ColorConfig.getChannelColor(song, channel);
                var regex = /\(([^)]+)\)/;
                let newChannelSecondary = ColorConfig.getComputed(regex.exec(base.secondaryChannel)[1]);
                let newChannelPrimary = ColorConfig.getComputed(regex.exec(base.primaryChannel)[1]);
                let newNoteSecondary = ColorConfig.getComputed(regex.exec(base.secondaryNote)[1]);
                let newNotePrimary = ColorConfig.getComputed(regex.exec(base.primaryNote)[1]);
                return { secondaryChannel: newChannelSecondary, primaryChannel: newChannelPrimary, secondaryNote: newNoteSecondary, primaryNote: newNotePrimary };
            }
            else {
                return ColorConfig.getChannelColor(song, channel);
            }
        }
        ;
        static getChannelColor(song, channel) {
            if (getComputedStyle(this._styleElement).getPropertyValue("--use-color-formula").trim() == "false") {
                if (channel < song.pitchChannelCount) {
                    return ColorConfig.pitchChannels[channel % ColorConfig.pitchChannels.length];
                }
                else if (channel < song.pitchChannelCount + song.noiseChannelCount) {
                    return ColorConfig.noiseChannels[(channel - song.pitchChannelCount) % ColorConfig.noiseChannels.length];
                }
                else {
                    return ColorConfig.modChannels[(channel - song.pitchChannelCount - song.noiseChannelCount) % ColorConfig.modChannels.length];
                }
            }
            else {
                if (ColorConfig.colorLookup.has(channel)) {
                    return ColorConfig.colorLookup.get(channel);
                }
                else {
                    if (channel < song.pitchChannelCount) {
                        const pitchSecondaryChannelHue = +getComputedStyle(this._styleElement).getPropertyValue("--pitch-secondary-channel-hue");
                        const pitchSecondaryChannelHueScale = +getComputedStyle(this._styleElement).getPropertyValue("--pitch-secondary-channel-hue-scale");
                        const pitchSecondaryChannelSat = +getComputedStyle(this._styleElement).getPropertyValue("--pitch-secondary-channel-sat");
                        const pitchSecondaryChannelSatScale = +getComputedStyle(this._styleElement).getPropertyValue("--pitch-secondary-channel-sat-scale");
                        const pitchSecondaryChannelLum = +getComputedStyle(this._styleElement).getPropertyValue("--pitch-secondary-channel-lum");
                        const pitchSecondaryChannelLumScale = +getComputedStyle(this._styleElement).getPropertyValue("--pitch-secondary-channel-lum-scale");
                        const pitchPrimaryChannelHue = +getComputedStyle(this._styleElement).getPropertyValue("--pitch-primary-channel-hue");
                        const pitchPrimaryChannelHueScale = +getComputedStyle(this._styleElement).getPropertyValue("--pitch-primary-channel-hue-scale");
                        const pitchPrimaryChannelSat = +getComputedStyle(this._styleElement).getPropertyValue("--pitch-primary-channel-sat");
                        const pitchPrimaryChannelSatScale = +getComputedStyle(this._styleElement).getPropertyValue("--pitch-primary-channel-sat-scale");
                        const pitchPrimaryChannelLum = +getComputedStyle(this._styleElement).getPropertyValue("--pitch-primary-channel-lum");
                        const pitchPrimaryChannelLumScale = +getComputedStyle(this._styleElement).getPropertyValue("--pitch-primary-channel-lum-scale");
                        const pitchSecondaryNoteHue = +getComputedStyle(this._styleElement).getPropertyValue("--pitch-secondary-note-hue");
                        const pitchSecondaryNoteHueScale = +getComputedStyle(this._styleElement).getPropertyValue("--pitch-secondary-note-hue-scale");
                        const pitchSecondaryNoteSat = +getComputedStyle(this._styleElement).getPropertyValue("--pitch-secondary-note-sat");
                        const pitchSecondaryNoteSatScale = +getComputedStyle(this._styleElement).getPropertyValue("--pitch-secondary-note-sat-scale");
                        const pitchSecondaryNoteLum = +getComputedStyle(this._styleElement).getPropertyValue("--pitch-secondary-note-lum");
                        const pitchSecondaryNoteLumScale = +getComputedStyle(this._styleElement).getPropertyValue("--pitch-secondary-note-lum-scale");
                        const pitchPrimaryNoteHue = +getComputedStyle(this._styleElement).getPropertyValue("--pitch-primary-note-hue");
                        const pitchPrimaryNoteHueScale = +getComputedStyle(this._styleElement).getPropertyValue("--pitch-primary-note-hue-scale");
                        const pitchPrimaryNoteSat = +getComputedStyle(this._styleElement).getPropertyValue("--pitch-primary-note-sat");
                        const pitchPrimaryNoteSatScale = +getComputedStyle(this._styleElement).getPropertyValue("--pitch-primary-note-sat-scale");
                        const pitchPrimaryNoteLum = +getComputedStyle(this._styleElement).getPropertyValue("--pitch-primary-note-lum");
                        const pitchPrimaryNoteLumScale = +getComputedStyle(this._styleElement).getPropertyValue("--pitch-primary-note-lum-scale");
                        let newChannelSecondary = "hsl(" + ((+pitchSecondaryChannelHue + (channel * +pitchSecondaryChannelHueScale / Config.pitchChannelCountMax) * 256) % 256) + ","
                            + (+pitchSecondaryChannelSat * (1 - (+pitchSecondaryChannelSatScale * Math.floor(channel / 7)))) + "%,"
                            + (+pitchSecondaryChannelLum * (1 - (+pitchSecondaryChannelLumScale * Math.floor(channel / 7)))) + "%)";
                        let newChannelPrimary = "hsl(" + ((+pitchPrimaryChannelHue + (channel * +pitchPrimaryChannelHueScale / Config.pitchChannelCountMax) * 256) % 256) + ","
                            + (+pitchPrimaryChannelSat * (1 - (+pitchPrimaryChannelSatScale * Math.floor(channel / 7)))) + "%,"
                            + (+pitchPrimaryChannelLum * (1 - (+pitchPrimaryChannelLumScale * Math.floor(channel / 7)))) + "%)";
                        let newNoteSecondary = "hsl(" + ((+pitchSecondaryNoteHue + (channel * +pitchSecondaryNoteHueScale / Config.pitchChannelCountMax) * 256) % 256) + ","
                            + (+pitchSecondaryNoteSat * (1 - (+pitchSecondaryNoteSatScale * Math.floor(channel / 7)))) + "%,"
                            + (+pitchSecondaryNoteLum * (1 - (+pitchSecondaryNoteLumScale * Math.floor(channel / 7)))) + "%)";
                        let newNotePrimary = "hsl(" + ((+pitchPrimaryNoteHue + (channel * +pitchPrimaryNoteHueScale / Config.pitchChannelCountMax) * 256) % 256) + ","
                            + (+pitchPrimaryNoteSat * (1 - (+pitchPrimaryNoteSatScale * Math.floor(channel / 7)))) + "%,"
                            + (+pitchPrimaryNoteLum * (1 - (+pitchPrimaryNoteLumScale * Math.floor(channel / 7)))) + "%)";
                        let newChannelColors = { secondaryChannel: newChannelSecondary, primaryChannel: newChannelPrimary, secondaryNote: newNoteSecondary, primaryNote: newNotePrimary };
                        ColorConfig.colorLookup.set(channel, newChannelColors);
                        return newChannelColors;
                    }
                    else if (channel < song.pitchChannelCount + song.noiseChannelCount) {
                        const noiseSecondaryChannelHue = +getComputedStyle(this._styleElement).getPropertyValue("--noise-secondary-channel-hue");
                        const noiseSecondaryChannelHueScale = +getComputedStyle(this._styleElement).getPropertyValue("--noise-secondary-channel-hue-scale");
                        const noiseSecondaryChannelSat = +getComputedStyle(this._styleElement).getPropertyValue("--noise-secondary-channel-sat");
                        const noiseSecondaryChannelSatScale = +getComputedStyle(this._styleElement).getPropertyValue("--noise-secondary-channel-sat-scale");
                        const noiseSecondaryChannelLum = +getComputedStyle(this._styleElement).getPropertyValue("--noise-secondary-channel-lum");
                        const noiseSecondaryChannelLumScale = +getComputedStyle(this._styleElement).getPropertyValue("--noise-secondary-channel-lum-scale");
                        const noisePrimaryChannelHue = +getComputedStyle(this._styleElement).getPropertyValue("--noise-primary-channel-hue");
                        const noisePrimaryChannelHueScale = +getComputedStyle(this._styleElement).getPropertyValue("--noise-primary-channel-hue-scale");
                        const noisePrimaryChannelSat = +getComputedStyle(this._styleElement).getPropertyValue("--noise-primary-channel-sat");
                        const noisePrimaryChannelSatScale = +getComputedStyle(this._styleElement).getPropertyValue("--noise-primary-channel-sat-scale");
                        const noisePrimaryChannelLum = +getComputedStyle(this._styleElement).getPropertyValue("--noise-primary-channel-lum");
                        const noisePrimaryChannelLumScale = +getComputedStyle(this._styleElement).getPropertyValue("--noise-primary-channel-lum-scale");
                        const noiseSecondaryNoteHue = +getComputedStyle(this._styleElement).getPropertyValue("--noise-secondary-note-hue");
                        const noiseSecondaryNoteHueScale = +getComputedStyle(this._styleElement).getPropertyValue("--noise-secondary-note-hue-scale");
                        const noiseSecondaryNoteSat = +getComputedStyle(this._styleElement).getPropertyValue("--noise-secondary-note-sat");
                        const noiseSecondaryNoteSatScale = +getComputedStyle(this._styleElement).getPropertyValue("--noise-secondary-note-sat-scale");
                        const noiseSecondaryNoteLum = +getComputedStyle(this._styleElement).getPropertyValue("--noise-secondary-note-lum");
                        const noiseSecondaryNoteLumScale = +getComputedStyle(this._styleElement).getPropertyValue("--noise-secondary-note-lum-scale");
                        const noisePrimaryNoteHue = +getComputedStyle(this._styleElement).getPropertyValue("--noise-primary-note-hue");
                        const noisePrimaryNoteHueScale = +getComputedStyle(this._styleElement).getPropertyValue("--noise-primary-note-hue-scale");
                        const noisePrimaryNoteSat = +getComputedStyle(this._styleElement).getPropertyValue("--noise-primary-note-sat");
                        const noisePrimaryNoteSatScale = +getComputedStyle(this._styleElement).getPropertyValue("--noise-primary-note-sat-scale");
                        const noisePrimaryNoteLum = +getComputedStyle(this._styleElement).getPropertyValue("--noise-primary-note-lum");
                        const noisePrimaryNoteLumScale = +getComputedStyle(this._styleElement).getPropertyValue("--noise-primary-note-lum-scale");
                        let newChannelSecondary = "hsl(" + ((+noiseSecondaryChannelHue + (((channel - song.pitchChannelCount) * +noiseSecondaryChannelHueScale) / Config.noiseChannelCountMax) * 256) % 256) + ","
                            + (+noiseSecondaryChannelSat + channel * +noiseSecondaryChannelSatScale) + "%,"
                            + (+noiseSecondaryChannelLum + channel * +noiseSecondaryChannelLumScale) + "%)";
                        let newChannelPrimary = "hsl(" + ((+noisePrimaryChannelHue + (((channel - song.pitchChannelCount) * +noisePrimaryChannelHueScale) / Config.noiseChannelCountMax) * 256) % 256) + ","
                            + (+noisePrimaryChannelSat + channel * +noisePrimaryChannelSatScale) + "%,"
                            + (+noisePrimaryChannelLum + channel * +noisePrimaryChannelLumScale) + "%)";
                        let newNoteSecondary = "hsl(" + ((+noiseSecondaryNoteHue + (((channel - song.pitchChannelCount) * +noiseSecondaryNoteHueScale) / Config.noiseChannelCountMax) * 256) % 256) + ","
                            + (+noiseSecondaryNoteSat + channel * +noiseSecondaryNoteSatScale) + "%,"
                            + (+noiseSecondaryNoteLum + channel * +noiseSecondaryNoteLumScale) + "%)";
                        let newNotePrimary = "hsl(" + ((+noisePrimaryNoteHue + (((channel - song.pitchChannelCount) * +noisePrimaryNoteHueScale) / Config.noiseChannelCountMax) * 256) % 256) + ","
                            + (+noisePrimaryNoteSat + channel * +noisePrimaryNoteSatScale) + "%,"
                            + (+noisePrimaryNoteLum + channel * +noisePrimaryNoteLumScale) + "%)";
                        let newChannelColors = { secondaryChannel: newChannelSecondary, primaryChannel: newChannelPrimary, secondaryNote: newNoteSecondary, primaryNote: newNotePrimary };
                        ColorConfig.colorLookup.set(channel, newChannelColors);
                        return newChannelColors;
                    }
                    else {
                        const modSecondaryChannelHue = +getComputedStyle(this._styleElement).getPropertyValue("--mod-secondary-channel-hue");
                        const modSecondaryChannelHueScale = +getComputedStyle(this._styleElement).getPropertyValue("--mod-secondary-channel-hue-scale");
                        const modSecondaryChannelSat = +getComputedStyle(this._styleElement).getPropertyValue("--mod-secondary-channel-sat");
                        const modSecondaryChannelSatScale = +getComputedStyle(this._styleElement).getPropertyValue("--mod-secondary-channel-sat-scale");
                        const modSecondaryChannelLum = +getComputedStyle(this._styleElement).getPropertyValue("--mod-secondary-channel-lum");
                        const modSecondaryChannelLumScale = +getComputedStyle(this._styleElement).getPropertyValue("--mod-secondary-channel-lum-scale");
                        const modPrimaryChannelHue = +getComputedStyle(this._styleElement).getPropertyValue("--mod-primary-channel-hue");
                        const modPrimaryChannelHueScale = +getComputedStyle(this._styleElement).getPropertyValue("--mod-primary-channel-hue-scale");
                        const modPrimaryChannelSat = +getComputedStyle(this._styleElement).getPropertyValue("--mod-primary-channel-sat");
                        const modPrimaryChannelSatScale = +getComputedStyle(this._styleElement).getPropertyValue("--mod-primary-channel-sat-scale");
                        const modPrimaryChannelLum = +getComputedStyle(this._styleElement).getPropertyValue("--mod-primary-channel-lum");
                        const modPrimaryChannelLumScale = +getComputedStyle(this._styleElement).getPropertyValue("--mod-primary-channel-lum-scale");
                        const modSecondaryNoteHue = +getComputedStyle(this._styleElement).getPropertyValue("--mod-secondary-note-hue");
                        const modSecondaryNoteHueScale = +getComputedStyle(this._styleElement).getPropertyValue("--mod-secondary-note-hue-scale");
                        const modSecondaryNoteSat = +getComputedStyle(this._styleElement).getPropertyValue("--mod-secondary-note-sat");
                        const modSecondaryNoteSatScale = +getComputedStyle(this._styleElement).getPropertyValue("--mod-secondary-note-sat-scale");
                        const modSecondaryNoteLum = +getComputedStyle(this._styleElement).getPropertyValue("--mod-secondary-note-lum");
                        const modSecondaryNoteLumScale = +getComputedStyle(this._styleElement).getPropertyValue("--mod-secondary-note-lum-scale");
                        const modPrimaryNoteHue = +getComputedStyle(this._styleElement).getPropertyValue("--mod-primary-note-hue");
                        const modPrimaryNoteHueScale = +getComputedStyle(this._styleElement).getPropertyValue("--mod-primary-note-hue-scale");
                        const modPrimaryNoteSat = +getComputedStyle(this._styleElement).getPropertyValue("--mod-primary-note-sat");
                        const modPrimaryNoteSatScale = +getComputedStyle(this._styleElement).getPropertyValue("--mod-primary-note-sat-scale");
                        const modPrimaryNoteLum = +getComputedStyle(this._styleElement).getPropertyValue("--mod-primary-note-lum");
                        const modPrimaryNoteLumScale = +getComputedStyle(this._styleElement).getPropertyValue("--mod-primary-note-lum-scale");
                        let newChannelSecondary = "hsl(" + ((+modSecondaryChannelHue + (((channel - song.pitchChannelCount - song.noiseChannelCount) * +modSecondaryChannelHueScale) / Config.modChannelCountMax) * 256) % 256) + ","
                            + (+modSecondaryChannelSat + channel * +modSecondaryChannelSatScale) + "%,"
                            + (+modSecondaryChannelLum + channel * +modSecondaryChannelLumScale) + "%)";
                        let newChannelPrimary = "hsl(" + ((+modPrimaryChannelHue + (((channel - song.pitchChannelCount - song.noiseChannelCount) * +modPrimaryChannelHueScale) / Config.modChannelCountMax) * 256) % 256) + ","
                            + (+modPrimaryChannelSat + channel * +modPrimaryChannelSatScale) + "%,"
                            + (+modPrimaryChannelLum + channel * +modPrimaryChannelLumScale) + "%)";
                        let newNoteSecondary = "hsl(" + ((+modSecondaryNoteHue + (((channel - song.pitchChannelCount - song.noiseChannelCount) * +modSecondaryNoteHueScale) / Config.modChannelCountMax) * 256) % 256) + ","
                            + (+modSecondaryNoteSat + channel * +modSecondaryNoteSatScale) + "%,"
                            + (+modSecondaryNoteLum + channel * +modSecondaryNoteLumScale) + "%)";
                        let newNotePrimary = "hsl(" + ((+modPrimaryNoteHue + (((channel - song.pitchChannelCount - song.noiseChannelCount) * +modPrimaryNoteHueScale) / Config.modChannelCountMax) * 256) % 256) + ","
                            + (+modPrimaryNoteSat + channel * +modPrimaryNoteSatScale) + "%,"
                            + (+modPrimaryNoteLum + channel * +modPrimaryNoteLumScale) + "%)";
                        let newChannelColors = { secondaryChannel: newChannelSecondary, primaryChannel: newChannelPrimary, secondaryNote: newNoteSecondary, primaryNote: newNotePrimary };
                        ColorConfig.colorLookup.set(channel, newChannelColors);
                        return newChannelColors;
                    }
                }
            }
        }
        static setTheme(name) {
            this._styleElement.textContent = this.themes[name];
            const themeColor = document.querySelector("meta[name='theme-color']");
            if (themeColor != null) {
                themeColor.setAttribute("content", getComputedStyle(document.documentElement).getPropertyValue('--ui-widget-background'));
            }
            this.resetColors();
        }
        static getComputed(name) {
            return getComputedStyle(this._styleElement).getPropertyValue(name);
        }
    }
    ColorConfig.colorLookup = new Map();
    ColorConfig.themes = {
        "dark classic": `
				:root {
					--page-margin: black;
					--editor-background: black;
					--hover-preview: white;
					--playhead: white;
					--primary-text: white;
					--secondary-text: #999;
					--inverted-text: black;
					--text-selection: rgba(119,68,255,0.99);
					--box-selection-fill: rgba(255,255,255,0.2);
					--loop-accent: #74f;
					--link-accent: #98f;
					--ui-widget-background: #444;
					--ui-widget-focus: #777;
					--pitch-background: #444;
					--tonic: #864;
					--fifth-note: #468;
					--white-piano-key: #bbb;
					--black-piano-key: #444;
					--use-color-formula: false;
					--track-editor-bg-pitch: #444;
					--track-editor-bg-pitch-dim: #333;
					--track-editor-bg-noise: #444;
					--track-editor-bg-noise-dim: #333;
					--track-editor-bg-mod: #234;
					--track-editor-bg-mod-dim: #123;
					--multiplicative-mod-slider: #456;
					--overwriting-mod-slider: #654;
					--indicator-primary: #74f;
					--indicator-secondary: #444;
					--select2-opt-group: #585858;
					--input-box-outline: #333;
					--mute-button-normal: #ffa033;
					--mute-button-mod: #9a6bff;
					--pitch1-secondary-channel: #0099a1;
					--pitch1-primary-channel:   #25f3ff;
					--pitch1-secondary-note:    #00bdc7;
					--pitch1-primary-note:      #92f9ff;
					--pitch2-secondary-channel: #a1a100;
					--pitch2-primary-channel:   #ffff25;
					--pitch2-secondary-note:    #c7c700;
					--pitch2-primary-note:      #ffff92;
					--pitch3-secondary-channel: #c75000;
					--pitch3-primary-channel:   #ff9752;
					--pitch3-secondary-note:    #ff771c;
					--pitch3-primary-note:      #ffcdab;
					--pitch4-secondary-channel: #00a100;
					--pitch4-primary-channel:   #50ff50;
					--pitch4-secondary-note:    #00c700;
					--pitch4-primary-note:      #a0ffa0;
					--pitch5-secondary-channel: #d020d0;
					--pitch5-primary-channel:   #ff90ff;
					--pitch5-secondary-note:    #e040e0;
					--pitch5-primary-note:      #ffc0ff;
					--pitch6-secondary-channel: #7777b0;
					--pitch6-primary-channel:   #a0a0ff;
					--pitch6-secondary-note:    #8888d0;
					--pitch6-primary-note:      #d0d0ff;
					--pitch7-secondary-channel: #8AA100;
					--pitch7-primary-channel:   #DEFF25;
					--pitch7-secondary-note:	  #AAC700;
					--pitch7-primary-note:			#E6FF92;
					--pitch8-secondary-channel: #DF0019;
					--pitch8-primary-channel:   #FF98A4;
					--pitch8-secondary-note:    #FF4E63;
					--pitch8-primary-note:      #FFB2BB;
					--pitch9-secondary-channel: #00A170;
					--pitch9-primary-channel:   #50FFC9;
					--pitch9-secondary-note:    #00C78A;
					--pitch9-primary-note:			#83FFD9;
					--pitch10-secondary-channel:#A11FFF;
					--pitch10-primary-channel:  #CE8BFF;
					--pitch10-secondary-note:   #B757FF;
					--pitch10-primary-note:     #DFACFF;
					--noise1-secondary-channel: #6f6f6f;
					--noise1-primary-channel:   #aaaaaa;
					--noise1-secondary-note:    #a7a7a7;
					--noise1-primary-note:      #e0e0e0;
					--noise2-secondary-channel: #996633;
					--noise2-primary-channel:   #ddaa77;
					--noise2-secondary-note:    #cc9966;
					--noise2-primary-note:      #f0d0bb;
					--noise3-secondary-channel: #4a6d8f;
					--noise3-primary-channel:   #77aadd;
					--noise3-secondary-note:    #6f9fcf;
					--noise3-primary-note:      #bbd7ff;
					--noise4-secondary-channel: #6B3E8E;
					--noise4-primary-channel:   #AF82D2;
					--noise4-secondary-note:    #9E71C1;
					--noise4-primary-note:      #D4C1EA;
          --mod1-secondary-channel:   #339955;
					--mod1-primary-channel:     #77fc55;
					--mod1-secondary-note:      #77ff8a;
					--mod1-primary-note:        #cdffee;
					--mod2-secondary-channel:   #993355;
					--mod2-primary-channel:     #f04960;
					--mod2-secondary-note:      #f057a0;
					--mod2-primary-note:        #ffb8de;
					--mod3-secondary-channel:   #553399;
					--mod3-primary-channel:     #8855fc;
					--mod3-secondary-note:      #aa64ff;
					--mod3-primary-note:			  #f8ddff;
					--mod4-secondary-channel:   #a86436;
					--mod4-primary-channel:     #c8a825;
					--mod4-secondary-note:      #e8ba46;
					--mod4-primary-note:        #fff6d3;
					--mod-label-primary:        #999;
					--mod-label-secondary-text: #333;
					--mod-label-primary-text:   black;

				}
			`,
        "dark competition": `
				:root {
					--page-margin: black;
					--editor-background: black;
					--hover-preview: #ddd;
					--playhead: #ddd;
					--primary-text: #ddd;
					--secondary-text: #8e695b;
					--inverted-text: black;
					--text-selection: rgba(169,0,255,0.99);
					--box-selection-fill: rgba(221,221,221,0.2);
					--loop-accent: #bf15ba;
					--link-accent: #f888ff;
					--ui-widget-background: #443a3a;
					--ui-widget-focus: #777;
					--pitch-background: #353333;
					--tonic: #884a44;
					--fifth-note: #415498;
					--white-piano-key: #bbb;
					--black-piano-key: #444;
					--use-color-formula: false;
					--track-editor-bg-pitch: #444;
					--track-editor-bg-pitch-dim: #333;
					--track-editor-bg-noise: #444;
					--track-editor-bg-noise-dim: #333;
					--track-editor-bg-mod: #234;
					--track-editor-bg-mod-dim: #123;
					--multiplicative-mod-slider: #456;
					--overwriting-mod-slider: #654;
					--indicator-primary: #74f;
					--indicator-secondary: #444;
					--select2-opt-group: #585858;
					--input-box-outline: #333;
					--mute-button-normal: #ffa033;
					--mute-button-mod: #9a6bff;
					--pitch1-secondary-channel: #0099a1;
					--pitch1-primary-channel:   #25f3ff;
					--pitch1-secondary-note:    #00bdc7;
					--pitch1-primary-note:      #92f9ff;
					--pitch2-secondary-channel: #a1a100;
					--pitch2-primary-channel:   #ffff25;
					--pitch2-secondary-note:    #c7c700;
					--pitch2-primary-note:      #ffff92;
					--pitch3-secondary-channel: #c75000;
					--pitch3-primary-channel:   #ff9752;
					--pitch3-secondary-note:    #ff771c;
					--pitch3-primary-note:      #ffcdab;
					--pitch4-secondary-channel: #00a100;
					--pitch4-primary-channel:   #50ff50;
					--pitch4-secondary-note:    #00c700;
					--pitch4-primary-note:      #a0ffa0;
					--pitch5-secondary-channel: #d020d0;
					--pitch5-primary-channel:   #ff90ff;
					--pitch5-secondary-note:    #e040e0;
					--pitch5-primary-note:      #ffc0ff;
					--pitch6-secondary-channel: #7777b0;
					--pitch6-primary-channel:   #a0a0ff;
					--pitch6-secondary-note:    #8888d0;
					--pitch6-primary-note:      #d0d0ff;
					--pitch7-secondary-channel: #8AA100;
					--pitch7-primary-channel:   #DEFF25;
					--pitch7-secondary-note:	  #AAC700;
					--pitch7-primary-note:			#E6FF92;
					--pitch8-secondary-channel: #DF0019;
					--pitch8-primary-channel:   #FF98A4;
					--pitch8-secondary-note:    #FF4E63;
					--pitch8-primary-note:      #FFB2BB;
					--pitch9-secondary-channel: #00A170;
					--pitch9-primary-channel:   #50FFC9;
					--pitch9-secondary-note:    #00C78A;
					--pitch9-primary-note:			#83FFD9;
					--pitch10-secondary-channel:#A11FFF;
					--pitch10-primary-channel:  #CE8BFF;
					--pitch10-secondary-note:   #B757FF;
					--pitch10-primary-note:     #DFACFF;
					--noise1-secondary-channel: #6f6f6f;
					--noise1-primary-channel:   #aaaaaa;
					--noise1-secondary-note:    #a7a7a7;
					--noise1-primary-note:      #e0e0e0;
					--noise2-secondary-channel: #996633;
					--noise2-primary-channel:   #ddaa77;
					--noise2-secondary-note:    #cc9966;
					--noise2-primary-note:      #f0d0bb;
					--noise3-secondary-channel: #4a6d8f;
					--noise3-primary-channel:   #77aadd;
					--noise3-secondary-note:    #6f9fcf;
					--noise3-primary-note:      #bbd7ff;
					--noise4-secondary-channel: #6B3E8E;
					--noise4-primary-channel:   #AF82D2;
					--noise4-secondary-note:    #9E71C1;
					--noise4-primary-note:      #D4C1EA;
          --mod1-secondary-channel:   #339955;
					--mod1-primary-channel:     #77fc55;
					--mod1-secondary-note:      #77ff8a;
					--mod1-primary-note:        #cdffee;
					--mod2-secondary-channel:   #993355;
					--mod2-primary-channel:     #f04960;
					--mod2-secondary-note:      #f057a0;
					--mod2-primary-note:        #ffb8de;
					--mod3-secondary-channel:   #553399;
					--mod3-primary-channel:     #8855fc;
					--mod3-secondary-note:      #aa64ff;
					--mod3-primary-note:			  #f8ddff;
					--mod4-secondary-channel:   #a86436;
					--mod4-primary-channel:     #c8a825;
					--mod4-secondary-note:      #e8ba46;
					--mod4-primary-note:        #fff6d3;
					--mod-label-primary:        #999;
					--mod-label-secondary-text: #333;
					--mod-label-primary-text:   black;

				}
			`,
        "light classic": `
				:root {
					-webkit-text-stroke-width: 0.5px;
					--page-margin: #685d88;
					--editor-background: white;
					--hover-preview: black;
					--playhead: rgba(0,0,0,0.5);
					--primary-text: black;
					--secondary-text: #777;
					--inverted-text: white;
					--text-selection: rgba(200,170,255,0.99);
					--box-selection-fill: rgba(0,0,0,0.1);
					--loop-accent: #98f;
					--link-accent: #74f;
					--ui-widget-background: #ececec;
					--ui-widget-focus: #eee;
					--pitch-background: #ececec;
					--tonic: #f0d6b6;
					--fifth-note: #bbddf0;
					--white-piano-key: #eee;
					--black-piano-key: #666;
					--use-color-formula: false;
					--track-editor-bg-pitch: #ececec;
					--track-editor-bg-pitch-dim: #fdfdfd;
					--track-editor-bg-noise: #ececec;
					--track-editor-bg-noise-dim: #fdfdfd;
					--track-editor-bg-mod: #dbecfd;
					--track-editor-bg-mod-dim: #ecfdff;
					--multiplicative-mod-slider: #789;
					--overwriting-mod-slider: #987;
					--indicator-primary: #98f;
					--indicator-secondary: #cde;
					--select2-opt-group: #cecece;
					--input-box-outline: #ddd;
					--mute-button-normal: #c0b47f;
					--mute-button-mod: #bd7fc0;
					--pitch1-secondary-channel: #6CD9ED;
					--pitch1-primary-channel:   #00A0BD;
					--pitch1-secondary-note:    #34C2DC;
					--pitch1-primary-note:      #00758A;
					--pitch2-secondary-channel: #E3C941;
					--pitch2-primary-channel:   #B49700;
					--pitch2-secondary-note:    #D1B628;
					--pitch2-primary-note:      #836E00;
					--pitch3-secondary-channel: #FF9D61;
					--pitch3-primary-channel:   #E14E00;
					--pitch3-secondary-note:    #F67D3C;
					--pitch3-primary-note:      #B64000;
					--pitch4-secondary-channel: #4BE24B;
					--pitch4-primary-channel:   #00A800;
					--pitch4-secondary-note:    #2DC82D;
					--pitch4-primary-note:      #008000;
					--pitch5-secondary-channel: #FF90FF;
					--pitch5-primary-channel:   #E12EDF;
					--pitch5-secondary-note:    #EC6EEC;
					--pitch5-primary-note:      #A600A5;
					--pitch6-secondary-channel: #B5B5FE;
					--pitch6-primary-channel:   #6969FD;
					--pitch6-secondary-note:    #9393FE;
					--pitch6-primary-note:      #4A4AD7;
					--pitch7-secondary-channel: #CBE24B;
					--pitch7-primary-channel:   #8EA800;
					--pitch7-secondary-note:    #B0C82D;
					--pitch7-primary-note:      #6C8000;
					--pitch8-secondary-channel: #FF90A4;
					--pitch8-primary-channel:   #E12E4D;
					--pitch8-secondary-note:    #EC6E85;
					--pitch8-primary-note:      #A6001D;
					--pitch9-secondary-channel: #41E3B5;
					--pitch9-primary-channel:   #00B481;
					--pitch9-secondary-note:    #28D1A1;
					--pitch9-primary-note:      #00835E;
					--pitch10-secondary-channel:#CA77FF;
					--pitch10-primary-channel:  #9609FF;
					--pitch10-secondary-note:   #B54FFF;
					--pitch10-primary-note:     #8400E3;
					--noise1-secondary-channel: #C1C1C1;
					--noise1-primary-channel:   #898989;
					--noise1-secondary-note:    #ADADAD;
					--noise1-primary-note:      #6C6C6C;
					--noise2-secondary-channel: #E8BB8C;
					--noise2-primary-channel:   #BD7D3A;
					--noise2-secondary-note:    #D1A374;
					--noise2-primary-note:      #836342;
					--noise3-secondary-channel: #9BC4EB;
					--noise3-primary-channel:   #4481BE;
					--noise3-secondary-note:    #7CA7D3;
					--noise3-primary-note:      #476685;
					--noise4-secondary-channel: #C5A5E0;
					--noise4-primary-channel:   #8553AE;
					--noise4-secondary-note:    #AB87C8;
					--noise4-primary-note:      #684F7D;
					--mod1-secondary-channel:   #339955;
					--mod1-primary-channel:     #77dd55;
					--mod1-secondary-note:      #77ff8a;
					--mod1-primary-note:        #2ad84a;
					--mod2-secondary-channel:   #993355;
					--mod2-primary-channel:     #f04960;
					--mod2-secondary-note:      #f057a0;
					--mod2-primary-note:        #ba124a;
					--mod3-secondary-channel:   #553399;
					--mod3-primary-channel:     #8855fc;
					--mod3-secondary-note:      #aa64ff;
					--mod3-primary-note:        #7a1caa;
					--mod4-secondary-channel:   #a86436;
					--mod4-primary-channel:     #c8a825;
					--mod4-secondary-note:      #e8ba46;
					--mod4-primary-note:        #a86810;
					--mod-label-primary:        #dddddd;
					--mod-label-secondary-text: #777;
					--mod-label-primary-text:   black;
				}
				
				.beepboxEditor button, .beepboxEditor select {
					box-shadow: inset 0 0 0 1px var(--secondary-text);
				}

				.select2-selection__rendered {
					box-shadow: inset 0 0 0 1px var(--secondary-text);
				}
			`,
        "jummbox classic": `
				:root {
					--page-margin: #040410;
					--editor-background: #040410;
					--hover-preview: white;
					--playhead: rgba(255, 255, 255, 0.9);
					--primary-text: white;
					--secondary-text: #84859a;
					--inverted-text: black;
					--text-selection: rgba(119,68,255,0.99);
					--box-selection-fill: #044b94;
					--loop-accent: #74f;
					--link-accent: #98f;
					--ui-widget-background: #393e4f;
					--ui-widget-focus: #6d6886;
					--pitch-background: #393e4f;
					--tonic: #725491;
					--fifth-note: #54547a;
					--white-piano-key: #eee;
					--black-piano-key: #666;
					--use-color-formula: true;
					--track-editor-bg-pitch: #393e4f;
					--track-editor-bg-pitch-dim: #1c1d28;
					--track-editor-bg-noise: #3d3535;
					--track-editor-bg-noise-dim: #161313;
					--track-editor-bg-mod: #283560;
					--track-editor-bg-mod-dim: #0a101f;
					--multiplicative-mod-slider: #606c9f;
					--overwriting-mod-slider: #6850b5;
					--indicator-primary: #9c64f7;
					--indicator-secondary: #393e4f;
					--select2-opt-group: #5d576f;
					--input-box-outline: #222;
					--mute-button-normal: #dda85d;
					--mute-button-mod: #886eae;
					--mod-label-primary: #282840;
					--mod-label-secondary-text: rgb(87, 86, 120);
					--mod-label-primary-text: white;
					--pitch-secondary-channel-hue: 0;
					--pitch-secondary-channel-hue-scale: 6.1;
					--pitch-secondary-channel-sat: 83.3;
					--pitch-secondary-channel-sat-scale: 0.1;
					--pitch-secondary-channel-lum: 40;
					--pitch-secondary-channel-lum-scale: 0.05;
					--pitch-primary-channel-hue: 0;
					--pitch-primary-channel-hue-scale: 6.1;
					--pitch-primary-channel-sat: 100;
					--pitch-primary-channel-sat-scale: 0.1;
					--pitch-primary-channel-lum: 67.5;
					--pitch-primary-channel-lum-scale: 0.05;
					--pitch-secondary-note-hue: 0;
					--pitch-secondary-note-hue-scale: 6.1;
					--pitch-secondary-note-sat: 93.9;
					--pitch-secondary-note-sat-scale: 0.1;
					--pitch-secondary-note-lum: 25;
					--pitch-secondary-note-lum-scale: 0.05;
					--pitch-primary-note-hue: 0;
					--pitch-primary-note-hue-scale: 6.1;
					--pitch-primary-note-sat: 100;
					--pitch-primary-note-sat-scale: 0.05;
					--pitch-primary-note-lum: 85.6;
					--pitch-primary-note-lum-scale: 0.025;
					--noise-secondary-channel-hue: 0;
					--noise-secondary-channel-hue-scale: 2;
					--noise-secondary-channel-sat: 25;
					--noise-secondary-channel-sat-scale: 0;
					--noise-secondary-channel-lum: 42;
					--noise-secondary-channel-lum-scale: 0;
					--noise-primary-channel-hue: 0;
					--noise-primary-channel-hue-scale: 2;
					--noise-primary-channel-sat: 33;
					--noise-primary-channel-sat-scale: 0;
					--noise-primary-channel-lum: 63.5;
					--noise-primary-channel-lum-scale: 0;
					--noise-secondary-note-hue: 0;
					--noise-secondary-note-hue-scale: 2;
					--noise-secondary-note-sat: 33.5;
					--noise-secondary-note-sat-scale: 0;
					--noise-secondary-note-lum: 55;
					--noise-secondary-note-lum-scale: 0;
					--noise-primary-note-hue: 0;
					--noise-primary-note-hue-scale: 2;
					--noise-primary-note-sat: 46.5;
					--noise-primary-note-sat-scale: 0;
					--noise-primary-note-lum: 74;
					--noise-primary-note-lum-scale: 0;
					--mod-secondary-channel-hue: 192;
					--mod-secondary-channel-hue-scale: 1.5;
					--mod-secondary-channel-sat: 88;
					--mod-secondary-channel-sat-scale: 0;
					--mod-secondary-channel-lum: 50;
					--mod-secondary-channel-lum-scale: 0;
					--mod-primary-channel-hue: 192;
					--mod-primary-channel-hue-scale: 1.5;
					--mod-primary-channel-sat: 96;
					--mod-primary-channel-sat-scale: 0;
					--mod-primary-channel-lum: 80;
					--mod-primary-channel-lum-scale: 0;
					--mod-secondary-note-hue: 192;
					--mod-secondary-note-hue-scale: 1.5;
					--mod-secondary-note-sat: 92;
					--mod-secondary-note-sat-scale: 0;
					--mod-secondary-note-lum: 45;
					--mod-secondary-note-lum-scale: 0;
					--mod-primary-note-hue: 192;
					--mod-primary-note-hue-scale: 1.5;
					--mod-primary-note-sat: 96;
					--mod-primary-note-sat-scale: 0;
					--mod-primary-note-lum: 85;
					--mod-primary-note-lum-scale: 0;
				}
			`,
        "forest": `
				:root {
					--page-margin: #010c03;
					--editor-background: #010c03;
					--hover-preview: #efe;
					--playhead: rgba(232, 255, 232, 0.9);
					--primary-text: #efe;
					--secondary-text: #70A070;
					--inverted-text: #280228;
					--text-selection: rgba(255,68,199,0.99);
					--box-selection-fill: #267aa3;
					--loop-accent: #ffe845;
					--link-accent: #9f8;
					--ui-widget-background: #203829;
					--ui-widget-focus: #487860;
					--pitch-background: #203829;
					--tonic: #2b8d20;
					--fifth-note: #385840;
					--white-piano-key: #bda;
					--black-piano-key: #573;
					--use-color-formula: true;
					--track-editor-bg-pitch: #254820;
					--track-editor-bg-pitch-dim: #102819;
					--track-editor-bg-noise: #304050;
					--track-editor-bg-noise-dim: #102030;
					--track-editor-bg-mod: #506030;
					--track-editor-bg-mod-dim: #2a300a;
					--multiplicative-mod-slider: #205c8f;
					--overwriting-mod-slider: #20ac6f;
					--indicator-primary: #dcd866;
					--indicator-secondary: #203829;
					--select2-opt-group: #1a6f5a;
					--input-box-outline: #242;
					--mute-button-normal: #49e980;
					--mute-button-mod: #c2e502;
					--mod-label-primary: #133613;
					--mod-label-secondary-text: rgb(27, 126, 40);
					--mod-label-primary-text: #efe;
					--pitch-secondary-channel-hue: 120;
					--pitch-secondary-channel-hue-scale: 8.1;
					--pitch-secondary-channel-sat: 59;
					--pitch-secondary-channel-sat-scale: 0.1;
					--pitch-secondary-channel-lum: 50;
					--pitch-secondary-channel-lum-scale: 0.04;
					--pitch-primary-channel-hue: 120;
					--pitch-primary-channel-hue-scale: 8.1;
					--pitch-primary-channel-sat: 86;
					--pitch-primary-channel-sat-scale: 0.1;
					--pitch-primary-channel-lum: 70;
					--pitch-primary-channel-lum-scale: 0.04;
					--pitch-secondary-note-hue: 120;
					--pitch-secondary-note-hue-scale: 8.1;
					--pitch-secondary-note-sat: 85;
					--pitch-secondary-note-sat-scale: 0.1;
					--pitch-secondary-note-lum: 30;
					--pitch-secondary-note-lum-scale: 0.04;
					--pitch-primary-note-hue: 120;
					--pitch-primary-note-hue-scale: 8.1;
					--pitch-primary-note-sat: 90;
					--pitch-primary-note-sat-scale: 0.05;
					--pitch-primary-note-lum: 80;
					--pitch-primary-note-lum-scale: 0.025;
					--noise-secondary-channel-hue: 200;
					--noise-secondary-channel-hue-scale: 1.1;
					--noise-secondary-channel-sat: 25;
					--noise-secondary-channel-sat-scale: 0;
					--noise-secondary-channel-lum: 22;
					--noise-secondary-channel-lum-scale: 0;
					--noise-primary-channel-hue: 200;
					--noise-primary-channel-hue-scale: 1.1;
					--noise-primary-channel-sat: 48;
					--noise-primary-channel-sat-scale: 0;
					--noise-primary-channel-lum: 65;
					--noise-primary-channel-lum-scale: 0;
					--noise-secondary-note-hue: 200;
					--noise-secondary-note-hue-scale: 1.1;
					--noise-secondary-note-sat: 33.5;
					--noise-secondary-note-sat-scale: 0;
					--noise-secondary-note-lum: 33;
					--noise-secondary-note-lum-scale: 0;
					--noise-primary-note-hue: 200;
					--noise-primary-note-hue-scale: 1.1;
					--noise-primary-note-sat: 46.5;
					--noise-primary-note-sat-scale: 0;
					--noise-primary-note-lum: 64;
					--noise-primary-note-lum-scale: 0;
					--mod-secondary-channel-hue: 40;
					--mod-secondary-channel-hue-scale: 1.8;
					--mod-secondary-channel-sat: 44;
					--mod-secondary-channel-sat-scale: 0;
					--mod-secondary-channel-lum: 50;
					--mod-secondary-channel-lum-scale: 0;
					--mod-primary-channel-hue: 40;
					--mod-primary-channel-hue-scale: 1.8;
					--mod-primary-channel-sat: 60;
					--mod-primary-channel-sat-scale: 0;
					--mod-primary-channel-lum: 80;
					--mod-primary-channel-lum-scale: 0;
					--mod-secondary-note-hue: 40;
					--mod-secondary-note-hue-scale: 1.8;
					--mod-secondary-note-sat: 62;
					--mod-secondary-note-sat-scale: 0;
					--mod-secondary-note-lum: 55;
					--mod-secondary-note-lum-scale: 0;
					--mod-primary-note-hue: 40;
					--mod-primary-note-hue-scale: 1.8;
					--mod-primary-note-sat: 66;
					--mod-primary-note-sat-scale: 0;
					--mod-primary-note-lum: 85;
					--mod-primary-note-lum-scale: 0;
				}
			`,
        "canyon": `
				:root {
					--page-margin: #0a0000;
					--editor-background: #0a0000;
					--hover-preview: white;
					--playhead: rgba(247, 172, 196, 0.9);
					--primary-text: #f5d6bf;
					--secondary-text: #934050;
					--inverted-text: #290505;
					--text-selection: rgba(255, 208, 68, 0.99);
					--box-selection-fill: #94044870;
					--loop-accent: #ff1e1e;
					--link-accent: #da7b76;
					--ui-widget-background: #533137;
					--ui-widget-focus: #743e4b;
					--pitch-background: #4f3939;
					--tonic: #9e4145;
					--fifth-note: #5b3e6b;
					--white-piano-key: #d89898;
					--black-piano-key: #572b29;
					--use-color-formula: true;
					--track-editor-bg-pitch: #5e3a41;
					--track-editor-bg-pitch-dim: #281d1c;
					--track-editor-bg-noise: #3a3551;
					--track-editor-bg-noise-dim: #272732;
					--track-editor-bg-mod: #552045;
					--track-editor-bg-mod-dim: #3e1442;
					--multiplicative-mod-slider: #9f6095;
					--overwriting-mod-slider: #b55050;
					--indicator-primary: #f2f764;
					--indicator-secondary: #4f3939;
					--select2-opt-group: #673030;
					--input-box-outline: #443131;
					--mute-button-normal: #d81833;
					--mute-button-mod: #9e2691;
					--mod-label-primary: #5f2b39;
					--mod-label-secondary-text: rgb(158, 66, 122);
					--mod-label-primary-text: #e6caed;
					--pitch-secondary-channel-hue: 0;
					--pitch-secondary-channel-hue-scale: 11.8;
					--pitch-secondary-channel-sat: 73.3;
					--pitch-secondary-channel-sat-scale: 0.1;
					--pitch-secondary-channel-lum: 40;
					--pitch-secondary-channel-lum-scale: 0.05;
					--pitch-primary-channel-hue: 0;
					--pitch-primary-channel-hue-scale: 11.8;
					--pitch-primary-channel-sat: 90;
					--pitch-primary-channel-sat-scale: 0.1;
					--pitch-primary-channel-lum: 67.5;
					--pitch-primary-channel-lum-scale: 0.05;
					--pitch-secondary-note-hue: 0;
					--pitch-secondary-note-hue-scale: 11.8;
					--pitch-secondary-note-sat: 83.9;
					--pitch-secondary-note-sat-scale: 0.1;
					--pitch-secondary-note-lum: 35;
					--pitch-secondary-note-lum-scale: 0.05;
					--pitch-primary-note-hue: 0;
					--pitch-primary-note-hue-scale: 11.8;
					--pitch-primary-note-sat: 100;
					--pitch-primary-note-sat-scale: 0.05;
					--pitch-primary-note-lum: 85.6;
					--pitch-primary-note-lum-scale: 0.025;
					--noise-secondary-channel-hue: 60;
					--noise-secondary-channel-hue-scale: 2;
					--noise-secondary-channel-sat: 25;
					--noise-secondary-channel-sat-scale: 0;
					--noise-secondary-channel-lum: 42;
					--noise-secondary-channel-lum-scale: 0;
					--noise-primary-channel-hue: 60;
					--noise-primary-channel-hue-scale: 2;
					--noise-primary-channel-sat: 33;
					--noise-primary-channel-sat-scale: 0;
					--noise-primary-channel-lum: 63.5;
					--noise-primary-channel-lum-scale: 0;
					--noise-secondary-note-hue: 60;
					--noise-secondary-note-hue-scale: 2;
					--noise-secondary-note-sat: 33.5;
					--noise-secondary-note-sat-scale: 0;
					--noise-secondary-note-lum: 55;
					--noise-secondary-note-lum-scale: 0;
					--noise-primary-note-hue: 60;
					--noise-primary-note-hue-scale: 2;
					--noise-primary-note-sat: 46.5;
					--noise-primary-note-sat-scale: 0;
					--noise-primary-note-lum: 74;
					--noise-primary-note-lum-scale: 0;
					--mod-secondary-channel-hue: 222;
					--mod-secondary-channel-hue-scale: 1.5;
					--mod-secondary-channel-sat: 88;
					--mod-secondary-channel-sat-scale: 0;
					--mod-secondary-channel-lum: 50;
					--mod-secondary-channel-lum-scale: 0;
					--mod-primary-channel-hue: 222;
					--mod-primary-channel-hue-scale: 1.5;
					--mod-primary-channel-sat: 96;
					--mod-primary-channel-sat-scale: 0;
					--mod-primary-channel-lum: 80;
					--mod-primary-channel-lum-scale: 0;
					--mod-secondary-note-hue: 222;
					--mod-secondary-note-hue-scale: 1.5;
					--mod-secondary-note-sat: 92;
					--mod-secondary-note-sat-scale: 0;
					--mod-secondary-note-lum: 54;
					--mod-secondary-note-lum-scale: 0;
					--mod-primary-note-hue: 222;
					--mod-primary-note-hue-scale: 1.5;
					--mod-primary-note-sat: 96;
					--mod-primary-note-sat-scale: 0;
					--mod-primary-note-lum: 75;
					--mod-primary-note-lum-scale: 0;
				}
			`,
        "midnight": `
		:root {
			--page-margin: #000;
			--editor-background: #000;
			--hover-preview: #757575;
			--playhead: #fff;
			--primary-text: #fff;
			--secondary-text: #acacac;
			--inverted-text: #290505;
			--text-selection: rgba(155, 155, 155, 0.99);
			--box-selection-fill: #79797970;
			--loop-accent: #646464;
			--link-accent: #707070;
			--ui-widget-background: #353535;
			--ui-widget-focus: #464646;
			--pitch-background: #222121;
			--tonic: #1a1818;
			--fifth-note: #555955;
			--white-piano-key: #a89e9e;
			--black-piano-key: #2d2424;
			--use-color-formula: true;
			--track-editor-bg-pitch: #373737;
			--track-editor-bg-pitch-dim: #131313;
			--track-editor-bg-noise: #484848;
			--track-editor-bg-noise-dim: #131313;
			--track-editor-bg-mod: #373737;
			--track-editor-bg-mod-dim: #131313;
			--multiplicative-mod-slider: #555;
			--overwriting-mod-slider: #464545;
			--indicator-primary: #e0e0e0;
			--indicator-secondary: #404040;
			--select2-opt-group: #3c3b3b;
			--input-box-outline: #757575;
			--mute-button-normal: #8e8d8d;
			--mute-button-mod: #ddd;
			--mod-label-primary: #262526;
			--mod-label-secondary-text: rgb(227, 222, 225);
			--mod-label-primary-text: #b9b9b9;
			--pitch-secondary-channel-hue: 240;
			--pitch-secondary-channel-hue-scale: 228;
			--pitch-secondary-channel-sat: 73.3;
			--pitch-secondary-channel-sat-scale: 0.1;
			--pitch-secondary-channel-lum: 25;
			--pitch-secondary-channel-lum-scale: 0.05;
			--pitch-primary-channel-hue: 240;
			--pitch-primary-channel-hue-scale: 228;
			--pitch-primary-channel-sat: 80;
			--pitch-primary-channel-sat-scale: 0.1;
			--pitch-primary-channel-lum: 60.5;
			--pitch-primary-channel-lum-scale: 0.05;
			--pitch-secondary-note-hue: 240;
			--pitch-secondary-note-hue-scale: 228;
			--pitch-secondary-note-sat: 73.9;
			--pitch-secondary-note-sat-scale: 0.1;
			--pitch-secondary-note-lum: 32;
			--pitch-secondary-note-lum-scale: 0.05;
			--pitch-primary-note-hue: 240;
			--pitch-primary-note-hue-scale: 228;
			--pitch-primary-note-sat: 90;
			--pitch-primary-note-sat-scale: 0.05;
			--pitch-primary-note-lum: 80.6;
			--pitch-primary-note-lum-scale: 0.025;
			--noise-secondary-channel-hue: 160;
			--noise-secondary-channel-hue-scale: 2;
			--noise-secondary-channel-sat: 25;
			--noise-secondary-channel-sat-scale: 0;
			--noise-secondary-channel-lum: 42;
			--noise-secondary-channel-lum-scale: 0;
			--noise-primary-channel-hue: 160;
			--noise-primary-channel-hue-scale: 2;
			--noise-primary-channel-sat: 33;
			--noise-primary-channel-sat-scale: 0;
			--noise-primary-channel-lum: 63.5;
			--noise-primary-channel-lum-scale: 0;
			--noise-secondary-note-hue: 160;
			--noise-secondary-note-hue-scale: 2;
			--noise-secondary-note-sat: 33.5;
			--noise-secondary-note-sat-scale: 0;
			--noise-secondary-note-lum: 55;
			--noise-secondary-note-lum-scale: 0;
			--noise-primary-note-hue: 160;
			--noise-primary-note-hue-scale: 2;
			--noise-primary-note-sat: 46.5;
			--noise-primary-note-sat-scale: 0;
			--noise-primary-note-lum: 74;
			--noise-primary-note-lum-scale: 0;
			--mod-secondary-channel-hue: 62;
			--mod-secondary-channel-hue-scale: 1.5;
			--mod-secondary-channel-sat: 88;
			--mod-secondary-channel-sat-scale: 0;
			--mod-secondary-channel-lum: 30;
			--mod-secondary-channel-lum-scale: 0;
			--mod-primary-channel-hue: 62;
			--mod-primary-channel-hue-scale: 1.5;
			--mod-primary-channel-sat: 96;
			--mod-primary-channel-sat-scale: 0;
			--mod-primary-channel-lum: 80;
			--mod-primary-channel-lum-scale: 0;
			--mod-secondary-note-hue: 62;
			--mod-secondary-note-hue-scale: 1.5;
			--mod-secondary-note-sat: 92;
			--mod-secondary-note-sat-scale: 0;
			--mod-secondary-note-lum: 34;
			--mod-secondary-note-lum-scale: 0;
			--mod-primary-note-hue: 62;
			--mod-primary-note-hue-scale: 1.5;
			--mod-primary-note-sat: 96;
			--mod-primary-note-sat-scale: 0;
			--mod-primary-note-lum: 75;
			--mod-primary-note-lum-scale: 0;
		}
	`,
        "jummbox light": `
				:root {
					-webkit-text-stroke-width: 0.5px;
					--page-margin: #fefdff;
					--editor-background: #fefdff;
					--hover-preview: #302880;
					--playhead: rgba(62, 32, 120, 0.9);
					--primary-text: #401890;
					--secondary-text: #8769af;
					--inverted-text: #fefdff;
					--text-selection: rgba(255,160,235,0.99);
					--box-selection-fill: rgba(30,62,220,0.5);
					--loop-accent: #4c35d4;
					--link-accent: #7af;
					--ui-widget-background: #bf9cec;
					--ui-widget-focus: #e9c4ff;
					--pitch-background: #e2d9f9;
					--tonic: #c288cc;
					--fifth-note: #d8c9fd;
					--white-piano-key: #e2e2ff;
					--black-piano-key: #66667a;
					--use-color-formula: true;
					--track-editor-bg-pitch: #d9e5ec;
					--track-editor-bg-pitch-dim: #eaeef5;
					--track-editor-bg-noise: #ffc3ae;
					--track-editor-bg-noise-dim: #ffe0cf;
					--track-editor-bg-mod: #c9accc;
					--track-editor-bg-mod-dim: #ebe3ef;
					--multiplicative-mod-slider: #807caf;
					--overwriting-mod-slider: #909cdf;
					--indicator-primary: #ae38ff;
					--indicator-secondary: #bbd4ec;
					--select2-opt-group: #c1b7f1;
					--input-box-outline: #bbb;
					--mute-button-normal: #e9b752;
					--mute-button-mod: #9558ee;
					--mod-label-primary: #ececff;
					--mod-label-secondary-text: rgb(197, 145, 247);
					--mod-label-primary-text: #302880;
					--pitch-secondary-channel-hue: 0;
					--pitch-secondary-channel-hue-scale: 8.1;
					--pitch-secondary-channel-sat: 53.3;
					--pitch-secondary-channel-sat-scale: -0.1;
					--pitch-secondary-channel-lum: 72;
					--pitch-secondary-channel-lum-scale: -0.05;
					--pitch-primary-channel-hue: 0;
					--pitch-primary-channel-hue-scale: 8.1;
					--pitch-primary-channel-sat: 97;
					--pitch-primary-channel-sat-scale: -0.1;
					--pitch-primary-channel-lum: 45.5;
					--pitch-primary-channel-lum-scale: -0.05;
					--pitch-secondary-note-hue: 0;
					--pitch-secondary-note-hue-scale: 8.1;
					--pitch-secondary-note-sat: 93.9;
					--pitch-secondary-note-sat-scale: -0.1;
					--pitch-secondary-note-lum: 95;
					--pitch-secondary-note-lum-scale: -0.05;
					--pitch-primary-note-hue: 0;
					--pitch-primary-note-hue-scale: 8.1;
					--pitch-primary-note-sat: 100;
					--pitch-primary-note-sat-scale: 0.05;
					--pitch-primary-note-lum: 43.6;
					--pitch-primary-note-lum-scale: -0.025;
					--noise-secondary-channel-hue: 220;
					--noise-secondary-channel-hue-scale: 2;
					--noise-secondary-channel-sat: 25;
					--noise-secondary-channel-sat-scale: 0;
					--noise-secondary-channel-lum: 62;
					--noise-secondary-channel-lum-scale: -0.1;
					--noise-primary-channel-hue: 220;
					--noise-primary-channel-hue-scale: 2;
					--noise-primary-channel-sat: 53;
					--noise-primary-channel-sat-scale: 0;
					--noise-primary-channel-lum: 53.5;
					--noise-primary-channel-lum-scale: -0.1;
					--noise-secondary-note-hue: 220;
					--noise-secondary-note-hue-scale: 2;
					--noise-secondary-note-sat: 58.5;
					--noise-secondary-note-sat-scale: 0;
					--noise-secondary-note-lum: 85;
					--noise-secondary-note-lum-scale: -1;
					--noise-primary-note-hue: 220;
					--noise-primary-note-hue-scale: 2;
					--noise-primary-note-sat: 56.5;
					--noise-primary-note-sat-scale: 0;
					--noise-primary-note-lum: 54;
					--noise-primary-note-lum-scale: -1;
					--mod-secondary-channel-hue: 90;
					--mod-secondary-channel-hue-scale: 1.5;
					--mod-secondary-channel-sat: 88;
					--mod-secondary-channel-sat-scale: 0;
					--mod-secondary-channel-lum: 60;
					--mod-secondary-channel-lum-scale: 0;
					--mod-primary-channel-hue: 90;
					--mod-primary-channel-hue-scale: 1.5;
					--mod-primary-channel-sat: 100;
					--mod-primary-channel-sat-scale: 0;
					--mod-primary-channel-lum: 65;
					--mod-primary-channel-lum-scale: 0;
					--mod-secondary-note-hue: 90;
					--mod-secondary-note-hue-scale: 1.5;
					--mod-secondary-note-sat: 92;
					--mod-secondary-note-sat-scale: 0;
					--mod-secondary-note-lum: 95;
					--mod-secondary-note-lum-scale: 0;
					--mod-primary-note-hue: 90;
					--mod-primary-note-hue-scale: 1.5;
					--mod-primary-note-sat: 96;
					--mod-primary-note-sat-scale: 0;
					--mod-primary-note-lum: 55;
					--mod-primary-note-lum-scale: 0;
				}

				.beepboxEditor button, .beepboxEditor select {
					box-shadow: inset 0 0 0 1px var(--secondary-text);
				}

				.select2-selection__rendered {
					box-shadow: inset 0 0 0 1px var(--secondary-text);
				}
			`,
    };
    ColorConfig.pageMargin = "var(--page-margin)";
    ColorConfig.editorBackground = "var(--editor-background)";
    ColorConfig.hoverPreview = "var(--hover-preview)";
    ColorConfig.playhead = "var(--playhead)";
    ColorConfig.primaryText = "var(--primary-text)";
    ColorConfig.secondaryText = "var(--secondary-text)";
    ColorConfig.invertedText = "var(--inverted-text)";
    ColorConfig.textSelection = "var(--text-selection)";
    ColorConfig.boxSelectionFill = "var(--box-selection-fill)";
    ColorConfig.loopAccent = "var(--loop-accent)";
    ColorConfig.linkAccent = "var(--link-accent)";
    ColorConfig.uiWidgetBackground = "var(--ui-widget-background)";
    ColorConfig.uiWidgetFocus = "var(--ui-widget-focus)";
    ColorConfig.pitchBackground = "var(--pitch-background)";
    ColorConfig.tonic = "var(--tonic)";
    ColorConfig.fifthNote = "var(--fifth-note)";
    ColorConfig.whitePianoKey = "var(--white-piano-key)";
    ColorConfig.blackPianoKey = "var(--black-piano-key)";
    ColorConfig.useColorFormula = "var(--use-color-formula)";
    ColorConfig.pitchSecondaryChannelHue = "var(--pitch-secondary-channel-hue)";
    ColorConfig.pitchSecondaryChannelHueScale = "var(--pitch-secondary-channel-hue-scale)";
    ColorConfig.pitchSecondaryChannelSat = "var(--pitch-secondary-channel-sat)";
    ColorConfig.pitchSecondaryChannelSatScale = "var(--pitch-secondary-channel-sat-scale)";
    ColorConfig.pitchSecondaryChannelLum = "var(--pitch-secondary-channel-lum)";
    ColorConfig.pitchSecondaryChannelLumScale = "var(--pitch-secondary-channel-lum-scale)";
    ColorConfig.pitchPrimaryChannelHue = "var(--pitch-primary-channel-hue)";
    ColorConfig.pitchPrimaryChannelHueScale = "var(--pitch-primary-channel-hue-scale)";
    ColorConfig.pitchPrimaryChannelSat = "var(--pitch-primary-channel-sat)";
    ColorConfig.pitchPrimaryChannelSatScale = "var(--pitch-primary-channel-sat-scale)";
    ColorConfig.pitchPrimaryChannelLum = "var(--pitch-primary-channel-lum)";
    ColorConfig.pitchPrimaryChannelLumScale = "var(--pitch-primary-channel-lum-scale)";
    ColorConfig.pitchSecondaryNoteHue = "var(--pitch-secondary-note-hue)";
    ColorConfig.pitchSecondaryNoteHueScale = "var(--pitch-secondary-note-hue-scale)";
    ColorConfig.pitchSecondaryNoteSat = "var(--pitch-secondary-note-sat)";
    ColorConfig.pitchSecondaryNoteSatScale = "var(--pitch-secondary-note-sat-scale)";
    ColorConfig.pitchSecondaryNoteLum = "var(--pitch-secondary-note-lum)";
    ColorConfig.pitchSecondaryNoteLumScale = "var(--pitch-secondary-note-lum-scale)";
    ColorConfig.pitchPrimaryNoteHue = "var(--pitch-primary-note-hue)";
    ColorConfig.pitchPrimaryNoteHueScale = "var(--pitch-primary-note-hue-scale)";
    ColorConfig.pitchPrimaryNoteSat = "var(--pitch-primary-note-sat)";
    ColorConfig.pitchPrimaryNoteSatScale = "var(--pitch-primary-note-sat-scale)";
    ColorConfig.pitchPrimaryNoteLum = "var(--pitch-primary-note-lum)";
    ColorConfig.pitchPrimaryNoteLumScale = "var(--pitch-primary-note-lum-scale)";
    ColorConfig.modSecondaryChannelHue = "var(--mod-secondary-channel-hue)";
    ColorConfig.modSecondaryChannelHueScale = "var(--mod-secondary-channel-hue-scale)";
    ColorConfig.modSecondaryChannelSat = "var(--mod-secondary-channel-sat)";
    ColorConfig.modSecondaryChannelSatScale = "var(--mod-secondary-channel-sat-scale)";
    ColorConfig.modSecondaryChannelLum = "var(--mod-secondary-channel-lum)";
    ColorConfig.modSecondaryChannelLumScale = "var(--mod-secondary-channel-lum-scale)";
    ColorConfig.modPrimaryChannelHue = "var(--mod-primary-channel-hue)";
    ColorConfig.modPrimaryChannelHueScale = "var(--mod-primary-channel-hue-scale)";
    ColorConfig.modPrimaryChannelSat = "var(--mod-primary-channel-sat)";
    ColorConfig.modPrimaryChannelSatScale = "var(--mod-primary-channel-sat-scale)";
    ColorConfig.modPrimaryChannelLum = "var(--mod-primary-channel-lum)";
    ColorConfig.modPrimaryChannelLumScale = "var(--mod-primary-channel-lum-scale)";
    ColorConfig.modSecondaryNoteHue = "var(--mod-secondary-note-hue)";
    ColorConfig.modSecondaryNoteHueScale = "var(--mod-secondary-note-hue-scale)";
    ColorConfig.modSecondaryNoteSat = "var(--mod-secondary-note-sat)";
    ColorConfig.modSecondaryNoteSatScale = "var(--mod-secondary-note-sat-scale)";
    ColorConfig.modSecondaryNoteLum = "var(--mod-secondary-note-lum)";
    ColorConfig.modSecondaryNoteLumScale = "var(--mod-secondary-note-lum-scale)";
    ColorConfig.modPrimaryNoteHue = "var(--mod-primary-note-hue)";
    ColorConfig.modPrimaryNoteHueScale = "var(--mod-primary-note-hue-scale)";
    ColorConfig.modPrimaryNoteSat = "var(--mod-primary-note-sat)";
    ColorConfig.modPrimaryNoteSatScale = "var(--mod-primary-note-sat-scale)";
    ColorConfig.modPrimaryNoteLum = "var(--mod-primary-note-lum)";
    ColorConfig.modPrimaryNoteLumScale = "var(--mod-primary-note-lum-scale)";
    ColorConfig.noiseSecondaryChannelHue = "var(--noise-secondary-channel-hue)";
    ColorConfig.noiseSecondaryChannelHueScale = "var(--noise-secondary-channel-hue-scale)";
    ColorConfig.noiseSecondaryChannelSat = "var(--noise-secondary-channel-sat)";
    ColorConfig.noiseSecondaryChannelSatScale = "var(--noise-secondary-channel-sat-scale)";
    ColorConfig.noiseSecondaryChannelLum = "var(--noise-secondary-channel-lum)";
    ColorConfig.noiseSecondaryChannelLumScale = "var(--noise-secondary-channel-lum-scale)";
    ColorConfig.noisePrimaryChannelHue = "var(--noise-primary-channel-hue)";
    ColorConfig.noisePrimaryChannelHueScale = "var(--noise-primary-channel-hue-scale)";
    ColorConfig.noisePrimaryChannelSat = "var(--noise-primary-channel-sat)";
    ColorConfig.noisePrimaryChannelSatScale = "var(--noise-primary-channel-sat-scale)";
    ColorConfig.noisePrimaryChannelLum = "var(--noise-primary-channel-lum)";
    ColorConfig.noisePrimaryChannelLumScale = "var(--noise-primary-channel-lum-scale)";
    ColorConfig.noiseSecondaryNoteHue = "var(--noise-secondary-note-hue)";
    ColorConfig.noiseSecondaryNoteHueScale = "var(--noise-secondary-note-hue-scale)";
    ColorConfig.noiseSecondaryNoteSat = "var(--noise-secondary-note-sat)";
    ColorConfig.noiseSecondaryNoteSatScale = "var(--noise-secondary-note-sat-scale)";
    ColorConfig.noiseSecondaryNoteLum = "var(--noise-secondary-note-lum)";
    ColorConfig.noiseSecondaryNoteLumScale = "var(--noise-secondary-note-lum-scale)";
    ColorConfig.noisePrimaryNoteHue = "var(--noise-primary-note-hue)";
    ColorConfig.noisePrimaryNoteHueScale = "var(--noise-primary-note-hue-scale)";
    ColorConfig.noisePrimaryNoteSat = "var(--noise-primary-note-sat)";
    ColorConfig.noisePrimaryNoteSatScale = "var(--noise-primary-note-sat-scale)";
    ColorConfig.noisePrimaryNoteLum = "var(--noise-primary-note-lum)";
    ColorConfig.noisePrimaryNoteLumScale = "var(--noise-primary-note-lum-scale)";
    ColorConfig.trackEditorBgPitch = "var(--track-editor-bg-pitch)";
    ColorConfig.trackEditorBgPitchDim = "var(--track-editor-bg-pitch-dim)";
    ColorConfig.trackEditorBgNoise = "var(--track-editor-bg-noise)";
    ColorConfig.trackEditorBgNoiseDim = "var(--track-editor-bg-noise-dim)";
    ColorConfig.trackEditorBgMod = "var(--track-editor-bg-mod)";
    ColorConfig.trackEditorBgModDim = "var(--track-editor-bg-mod-dim)";
    ColorConfig.multiplicativeModSlider = "var(--multiplicative-mod-slider)";
    ColorConfig.overwritingModSlider = "var(--overwriting-mod-slider)";
    ColorConfig.indicatorPrimary = "var(--indicator-primary)";
    ColorConfig.indicatorSecondary = "var(--indicator-secondary)";
    ColorConfig.select2OptGroup = "var(--select2-opt-group)";
    ColorConfig.inputBoxOutline = "var(--input-box-outline)";
    ColorConfig.muteButtonNormal = "var(--mute-button-normal)";
    ColorConfig.muteButtonMod = "var(--mute-button-mod)";
    ColorConfig.modLabelPrimary = "var(--mod-label-primary)";
    ColorConfig.modLabelSecondaryText = "var(--mod-label-secondary-text)";
    ColorConfig.modLabelPrimaryText = "var(--mod-label-primary-text)";
    ColorConfig.pitchChannels = toNameMap([
        {
            name: "pitch1",
            secondaryChannel: "var(--pitch1-secondary-channel)",
            primaryChannel: "var(--pitch1-primary-channel)",
            secondaryNote: "var(--pitch1-secondary-note)",
            primaryNote: "var(--pitch1-primary-note)",
        }, {
            name: "pitch2",
            secondaryChannel: "var(--pitch2-secondary-channel)",
            primaryChannel: "var(--pitch2-primary-channel)",
            secondaryNote: "var(--pitch2-secondary-note)",
            primaryNote: "var(--pitch2-primary-note)",
        }, {
            name: "pitch3",
            secondaryChannel: "var(--pitch3-secondary-channel)",
            primaryChannel: "var(--pitch3-primary-channel)",
            secondaryNote: "var(--pitch3-secondary-note)",
            primaryNote: "var(--pitch3-primary-note)",
        }, {
            name: "pitch4",
            secondaryChannel: "var(--pitch4-secondary-channel)",
            primaryChannel: "var(--pitch4-primary-channel)",
            secondaryNote: "var(--pitch4-secondary-note)",
            primaryNote: "var(--pitch4-primary-note)",
        }, {
            name: "pitch5",
            secondaryChannel: "var(--pitch5-secondary-channel)",
            primaryChannel: "var(--pitch5-primary-channel)",
            secondaryNote: "var(--pitch5-secondary-note)",
            primaryNote: "var(--pitch5-primary-note)",
        }, {
            name: "pitch6",
            secondaryChannel: "var(--pitch6-secondary-channel)",
            primaryChannel: "var(--pitch6-primary-channel)",
            secondaryNote: "var(--pitch6-secondary-note)",
            primaryNote: "var(--pitch6-primary-note)",
        }, {
            name: "pitch7",
            secondaryChannel: "var(--pitch7-secondary-channel)",
            primaryChannel: "var(--pitch7-primary-channel)",
            secondaryNote: "var(--pitch7-secondary-note)",
            primaryNote: "var(--pitch7-primary-note)",
        }, {
            name: "pitch8",
            secondaryChannel: "var(--pitch8-secondary-channel)",
            primaryChannel: "var(--pitch8-primary-channel)",
            secondaryNote: "var(--pitch8-secondary-note)",
            primaryNote: "var(--pitch8-primary-note)",
        }, {
            name: "pitch9",
            secondaryChannel: "var(--pitch9-secondary-channel)",
            primaryChannel: "var(--pitch9-primary-channel)",
            secondaryNote: "var(--pitch9-secondary-note)",
            primaryNote: "var(--pitch9-primary-note)",
        }, {
            name: "pitch10",
            secondaryChannel: "var(--pitch10-secondary-channel)",
            primaryChannel: "var(--pitch10-primary-channel)",
            secondaryNote: "var(--pitch10-secondary-note)",
            primaryNote: "var(--pitch10-primary-note)",
        },
    ]);
    ColorConfig.noiseChannels = toNameMap([
        {
            name: "noise1",
            secondaryChannel: "var(--noise1-secondary-channel)",
            primaryChannel: "var(--noise1-primary-channel)",
            secondaryNote: "var(--noise1-secondary-note)",
            primaryNote: "var(--noise1-primary-note)",
        }, {
            name: "noise2",
            secondaryChannel: "var(--noise2-secondary-channel)",
            primaryChannel: "var(--noise2-primary-channel)",
            secondaryNote: "var(--noise2-secondary-note)",
            primaryNote: "var(--noise2-primary-note)",
        }, {
            name: "noise3",
            secondaryChannel: "var(--noise3-secondary-channel)",
            primaryChannel: "var(--noise3-primary-channel)",
            secondaryNote: "var(--noise3-secondary-note)",
            primaryNote: "var(--noise3-primary-note)",
        }, {
            name: "noise4",
            secondaryChannel: "var(--noise4-secondary-channel)",
            primaryChannel: "var(--noise4-primary-channel)",
            secondaryNote: "var(--noise4-secondary-note)",
            primaryNote: "var(--noise4-primary-note)",
        },
    ]);
    ColorConfig.modChannels = toNameMap([
        {
            name: "mod1",
            secondaryChannel: "var(--mod1-secondary-channel)",
            primaryChannel: "var(--mod1-primary-channel)",
            secondaryNote: "var(--mod1-secondary-note)",
            primaryNote: "var(--mod1-primary-note)",
        }, {
            name: "mod2",
            secondaryChannel: "var(--mod2-secondary-channel)",
            primaryChannel: "var(--mod2-primary-channel)",
            secondaryNote: "var(--mod2-secondary-note)",
            primaryNote: "var(--mod2-primary-note)",
        }, {
            name: "mod3",
            secondaryChannel: "var(--mod3-secondary-channel)",
            primaryChannel: "var(--mod3-primary-channel)",
            secondaryNote: "var(--mod3-secondary-note)",
            primaryNote: "var(--mod3-primary-note)",
        }, {
            name: "mod4",
            secondaryChannel: "var(--mod4-secondary-channel)",
            primaryChannel: "var(--mod4-primary-channel)",
            secondaryNote: "var(--mod4-secondary-note)",
            primaryNote: "var(--mod4-primary-note)",
        },
    ]);
    ColorConfig._styleElement = document.head.appendChild(HTML.style({ type: "text/css" }));

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|android|ipad|playbook|silk/i.test(navigator.userAgent);
    class EditorConfig {
        static valueToPreset(presetValue) {
            const categoryIndex = presetValue >> 6;
            const presetIndex = presetValue & 0x3F;
            return EditorConfig.presetCategories[categoryIndex].presets[presetIndex];
        }
        static midiProgramToPresetValue(program) {
            for (let categoryIndex = 0; categoryIndex < EditorConfig.presetCategories.length; categoryIndex++) {
                const category = EditorConfig.presetCategories[categoryIndex];
                for (let presetIndex = 0; presetIndex < category.presets.length; presetIndex++) {
                    const preset = category.presets[presetIndex];
                    if (preset.generalMidi && preset.midiProgram == program)
                        return (categoryIndex << 6) + presetIndex;
                }
            }
            return null;
        }
        static nameToPresetValue(presetName) {
            for (let categoryIndex = 0; categoryIndex < EditorConfig.presetCategories.length; categoryIndex++) {
                const category = EditorConfig.presetCategories[categoryIndex];
                for (let presetIndex = 0; presetIndex < category.presets.length; presetIndex++) {
                    const preset = category.presets[presetIndex];
                    if (preset.name == presetName)
                        return (categoryIndex << 6) + presetIndex;
                }
            }
            return null;
        }
    }
    EditorConfig.version = "2.3";
    EditorConfig.versionDisplayName = "JummBox " + EditorConfig.version;
    EditorConfig.presetCategories = toNameMap([
        {
            name: "Custom Instruments",
            presets: toNameMap([
                { name: "chip wave", customType: 0 },
                { name: "FM (expert)", customType: 1 },
                { name: "basic noise", customType: 2 },
                { name: "spectrum", customType: 3 },
                { name: "drumset", customType: 4 },
                { name: "harmonics", customType: 5 },
                { name: "pulse width", customType: 6 },
                { name: "custom chip", customType: 7 },
            ])
        },
        {
            name: "Retro Presets",
            presets: toNameMap([
                { name: "square wave", midiProgram: 80, settings: { "type": "chip", "transition": "seamless", "effects": "none", "chord": "arpeggio", "filterCutoffHz": 4000, "filterResonance": 0, "filterEnvelope": "steady", "wave": "square", "interval": "union", "vibrato": "none" } },
                { name: "triangle wave", midiProgram: 71, settings: { "type": "chip", "transition": "seamless", "effects": "none", "chord": "arpeggio", "filterCutoffHz": 4000, "filterResonance": 0, "filterEnvelope": "steady", "wave": "triangle", "interval": "union", "vibrato": "none" } },
                { name: "square lead", midiProgram: 80, generalMidi: true, settings: { "type": "chip", "transition": "hard", "effects": "reverb", "chord": "harmony", "filterCutoffHz": 2828, "filterResonance": 14, "filterEnvelope": "steady", "wave": "square", "interval": "hum", "vibrato": "none" } },
                { name: "sawtooth lead 1", midiProgram: 81, generalMidi: true, settings: { "type": "chip", "transition": "hard", "effects": "reverb", "chord": "harmony", "filterCutoffHz": 2828, "filterResonance": 14, "filterEnvelope": "steady", "wave": "sawtooth", "interval": "shimmer", "vibrato": "none" } },
                { name: "sawtooth lead 2", midiProgram: 81, settings: { "type": "chip", "effects": "reverb", "transition": "medium fade", "chord": "harmony", "filterCutoffHz": 5657, "filterResonance": 29, "filterEnvelope": "steady", "wave": "sawtooth", "interval": "hum", "vibrato": "light" } },
                { name: "chip noise", midiProgram: 116, isNoise: true, settings: { "type": "noise", "transition": "hard", "effects": "none", "chord": "arpeggio", "filterCutoffHz": 4000, "filterResonance": 0, "filterEnvelope": "steady", "wave": "retro" } },
                { name: "FM twang", midiProgram: 32, settings: { "type": "FM", "transition": "hard", "effects": "none", "chord": "harmony", "filterCutoffHz": 8000, "filterResonance": 0, "filterEnvelope": "steady", "vibrato": "none", "algorithm": "1←(2 3 4)", "feedbackType": "1⟲", "feedbackAmplitude": 0, "feedbackEnvelope": "steady", "operators": [{ "frequency": "1×", "amplitude": 15, "envelope": "custom" }, { "frequency": "1×", "amplitude": 15, "envelope": "twang 2" }, { "frequency": "1×", "amplitude": 0, "envelope": "steady" }, { "frequency": "1×", "amplitude": 0, "envelope": "steady" }] } },
                { name: "FM bass", midiProgram: 36, settings: { "type": "FM", "effects": "reverb", "transition": "hard", "chord": "custom interval", "filterCutoffHz": 8000, "filterResonance": 0, "filterEnvelope": "steady", "vibrato": "none", "algorithm": "1←(2 3←4)", "feedbackType": "1⟲", "feedbackAmplitude": 0, "feedbackEnvelope": "steady", "operators": [{ "frequency": "2×", "amplitude": 11, "envelope": "custom" }, { "frequency": "1×", "amplitude": 7, "envelope": "twang 2" }, { "frequency": "1×", "amplitude": 9, "envelope": "twang 3" }, { "frequency": "20×", "amplitude": 3, "envelope": "twang 2" }] } },
                { name: "FM flute", midiProgram: 73, settings: { "type": "FM", "effects": "reverb", "transition": "soft", "chord": "harmony", "filterCutoffHz": 8000, "filterResonance": 0, "filterEnvelope": "steady", "vibrato": "none", "algorithm": "1←(2 3 4)", "feedbackType": "1⟲", "feedbackAmplitude": 0, "feedbackEnvelope": "steady", "operators": [{ "frequency": "1×", "amplitude": 15, "envelope": "custom" }, { "frequency": "1×", "amplitude": 6, "envelope": "twang 2" }, { "frequency": "1×", "amplitude": 0, "envelope": "steady" }, { "frequency": "1×", "amplitude": 0, "envelope": "steady" }] } },
                { name: "FM organ", midiProgram: 16, settings: { "type": "FM", "effects": "reverb", "transition": "soft", "chord": "custom interval", "filterCutoffHz": 8000, "filterResonance": 0, "filterEnvelope": "steady", "vibrato": "delayed", "algorithm": "1←3 2←4", "feedbackType": "1⟲ 2⟲", "feedbackAmplitude": 0, "feedbackEnvelope": "steady", "operators": [{ "frequency": "1×", "amplitude": 7, "envelope": "custom" }, { "frequency": "2×", "amplitude": 7, "envelope": "custom" }, { "frequency": "1×", "amplitude": 11, "envelope": "steady" }, { "frequency": "2×", "amplitude": 11, "envelope": "steady" }] } },
                { name: "NES Pulse", midiProgram: 80, settings: { "type": "custom chip", "transition": "hard", "effects": "none", "chord": "arpeggio", "filterCutoffHz": 4000, "filterResonance": 0, "filterEnvelope": "steady", "interval": "union", "vibrato": "none", "customChipWave": [-24, -24, -24, -24, -23, -23, -23, -23, -22, -22, -22, -22, -21, -21, -21, -21, -20, -20, -20, -20, -19, -19, -19, -19, -18, -18, -18, -18, -17, -17, -17, -17, 24, 24, 24, 24, 23, 23, 23, 23, 22, 22, 22, 22, 21, 21, 21, 21, 20, 20, 20, 20, 19, 19, 19, 19, 18, 18, 18, 18, 17, 17, 17, 17] } },
                { name: "Gameboy Pulse", midiProgram: 80, settings: { "type": "custom chip", "transition": "hard", "effects": "none", "chord": "arpeggio", "filterCutoffHz": 4000, "filterResonance": 0, "filterEnvelope": "steady", "interval": "union", "vibrato": "none", "customChipWave": [-24, -20, -17, -15, -13, -13, -11, -11, -11, -9, -9, -9, -9, -7, -7, -7, -7, -7, -5, -5, -5, -5, -5, -5, -3, -3, -3, -3, -3, -3, -3, -3, 24, 20, 17, 15, 13, 13, 11, 11, 11, 9, 9, 9, 9, 7, 7, 7, 7, 7, 5, 5, 5, 5, 5, 5, 3, 3, 3, 3, 3, 3, 3, 3] } },
                { name: "VRC6 Sawtooth", midiProgram: 81, settings: { "type": "custom chip", "transition": "hard", "effects": "none", "chord": "arpeggio", "filterCutoffHz": 4000, "filterResonance": 0, "filterEnvelope": "steady", "interval": "union", "vibrato": "none", "customChipWave": [-24, -20, -16, -13, -10, -8, -6, -5, -4, -4, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 8, 8, 8, 8, 8, 8, 8, 8, 12, 12, 12, 12, 12, 12, 12, 12, 16, 16, 16, 16, 16, 16, 16, 16, 20, 20, 20, 20, 20, 20, 20, 20, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24] } },
                { name: "Atari Square", midiProgram: 80, settings: { "type": "custom chip", "effects": "none", "transition": "seamless", "chord": "arpeggio", "filterCutoffHz": 8000, "filterResonance": 0, "filterEnvelope": "steady", "interval": "union", "vibrato": "none", "customChipWave": [-24, -24, -24, -23, -23, -23, -22, -22, -22, -21, -21, -21, -20, -20, -20, -19, -19, -19, -18, -18, -18, -17, -17, -17, -16, -16, -16, -15, -15, -15, -14, -14, -14, -13, -13, -13, 24, 24, 24, 23, 23, 23, 22, 22, 22, 21, 21, 21, 20, 20, 20, 19, 19, 19, 18, 18, 18, 17, 17, 17, 16, 16, 15, 15] } },
                { name: "Atari Bass", midiProgram: 36, settings: { "type": "custom chip", "effects": "none", "transition": "seamless", "chord": "arpeggio", "filterCutoffHz": 8000, "filterResonance": 0, "filterEnvelope": "steady", "interval": "union", "vibrato": "none", "customChipWave": [-24, -24, -24, -24, -24, -24, -24, -24, -24, 24, 24, 24, 24, 24, 24, -24, -24, -24, 24, 24, 24, -24, -24, -24, 24, 24, 24, -24, -24, -24, 24, 24, -24, -24, -24, -24, -24, -24, -24, -24, -24, 24, 24, 24, 24, 24, 24, -24, -24, 24, 24, 24, 24, 24, -24, -24, -24, -24, 24, 24, -24, -24, 24, 24] } },
            ])
        },
        {
            name: "Keyboard Presets",
            presets: toNameMap([
                { name: "grand piano 1", midiProgram: 0, generalMidi: true, settings: { "type": "harmonics", "effects": "reverb", "transition": "hard fade", "chord": "harmony", "filterCutoffHz": 1414, "filterResonance": 14, "filterEnvelope": "twang 3", "interval": "piano", "vibrato": "none", "harmonics": [100, 100, 86, 86, 86, 71, 71, 71, 0, 86, 71, 71, 71, 57, 57, 71, 57, 14, 57, 57, 57, 57, 57, 57, 57, 57, 29, 57] } },
                { name: "bright piano", midiProgram: 1, generalMidi: true, settings: { "type": "harmonics", "effects": "reverb", "transition": "hard fade", "chord": "harmony", "filterCutoffHz": 2000, "filterResonance": 14, "filterEnvelope": "twang 3", "interval": "piano", "vibrato": "none", "harmonics": [100, 100, 86, 86, 71, 71, 0, 71, 86, 86, 71, 71, 71, 14, 57, 57, 57, 57, 57, 57, 29, 57, 57, 57, 57, 57, 57, 57] } },
                { name: "electric grand", midiProgram: 2, generalMidi: true, settings: { "type": "chip", "effects": "reverb", "transition": "hard fade", "chord": "harmony", "filterCutoffHz": 2000, "filterResonance": 14, "filterEnvelope": "twang 3", "wave": "1/8 pulse", "interval": "shimmer", "vibrato": "none" } },
                { name: "honky-tonk piano", midiProgram: 3, generalMidi: true, settings: { "type": "harmonics", "effects": "reverb", "transition": "hard fade", "chord": "harmony", "filterCutoffHz": 5657, "filterResonance": 29, "filterEnvelope": "twang 2", "interval": "honky tonk", "vibrato": "none", "harmonics": [100, 100, 86, 71, 86, 71, 43, 71, 43, 43, 57, 57, 57, 29, 57, 43, 43, 43, 43, 43, 29, 43, 43, 43, 29, 29, 29, 29] } },
                { name: "electric piano 1", midiProgram: 4, generalMidi: true, settings: { "type": "harmonics", "effects": "reverb", "transition": "hard", "chord": "harmony", "filterCutoffHz": 2828, "filterResonance": 14, "filterEnvelope": "twang 2", "interval": "union", "vibrato": "none", "harmonics": [86, 100, 100, 71, 71, 57, 57, 43, 43, 43, 29, 29, 29, 14, 14, 14, 0, 0, 0, 0, 0, 57, 0, 0, 0, 0, 0, 0] } },
                { name: "electric piano 2", midiProgram: 5, generalMidi: true, settings: { "type": "FM", "effects": "reverb", "transition": "hard fade", "chord": "harmony", "filterCutoffHz": 2828, "filterResonance": 0, "filterEnvelope": "twang 3", "vibrato": "none", "algorithm": "1←3 2←4", "feedbackType": "1⟲ 2⟲", "feedbackAmplitude": 0, "feedbackEnvelope": "steady", "operators": [{ "frequency": "1×", "amplitude": 12, "envelope": "custom" }, { "frequency": "1×", "amplitude": 6, "envelope": "custom" }, { "frequency": "1×", "amplitude": 9, "envelope": "steady" }, { "frequency": "16×", "amplitude": 6, "envelope": "twang 3" }] } },
                { name: "harpsichord", midiProgram: 6, generalMidi: true, settings: { "type": "FM", "effects": "reverb", "transition": "hard fade", "chord": "harmony", "filterCutoffHz": 8000, "filterResonance": 0, "filterEnvelope": "twang 2", "vibrato": "none", "algorithm": "1←(2 3←4)", "feedbackType": "4⟲", "feedbackAmplitude": 9, "feedbackEnvelope": "twang 2", "operators": [{ "frequency": "1×", "amplitude": 15, "envelope": "custom" }, { "frequency": "4×", "amplitude": 8, "envelope": "steady" }, { "frequency": "3×", "amplitude": 6, "envelope": "steady" }, { "frequency": "5×", "amplitude": 7, "envelope": "steady" }] } },
                { name: "clavinet", midiProgram: 7, generalMidi: true, settings: { "type": "FM", "transition": "hard", "effects": "reverb", "chord": "harmony", "filterCutoffHz": 5657, "filterResonance": 0, "filterEnvelope": "twang 2", "vibrato": "none", "algorithm": "1←(2 3 4)", "feedbackType": "3⟲", "feedbackAmplitude": 6, "feedbackEnvelope": "twang 2", "operators": [{ "frequency": "3×", "amplitude": 15, "envelope": "custom" }, { "frequency": "~1×", "amplitude": 6, "envelope": "steady" }, { "frequency": "8×", "amplitude": 4, "envelope": "steady" }, { "frequency": "1×", "amplitude": 0, "envelope": "steady" }] } },
                { name: "dulcimer", midiProgram: 15, generalMidi: true, settings: { "type": "harmonics", "effects": "reverb", "transition": "hard fade", "chord": "strum", "filterCutoffHz": 5657, "filterResonance": 14, "filterEnvelope": "twang 2", "interval": "piano", "vibrato": "none", "harmonics": [100, 100, 100, 86, 100, 86, 57, 100, 100, 86, 100, 86, 100, 86, 100, 71, 57, 71, 71, 100, 86, 71, 86, 86, 100, 86, 86, 86] } },
                { name: "grand piano 2", midiProgram: 0, generalMidi: true, settings: { "type": "harmonics", "effects": "reverb", "transition": "hard fade", "chord": "harmony", "filterCutoffHz": 1414, "filterResonance": 43, "filterEnvelope": "twang 3", "interval": "shimmer", "vibrato": "none", "harmonics": [100, 86, 86, 86, 86, 71, 71, 57, 0, 57, 29, 43, 57, 57, 57, 43, 43, 0, 29, 43, 43, 43, 43, 43, 43, 29, 0, 29] } },
            ])
        },
        {
            name: "Idiophone Presets",
            presets: toNameMap([
                { name: "celesta", midiProgram: 8, generalMidi: true, settings: { "type": "FM", "effects": "reverb", "transition": "hard fade", "chord": "strum", "filterCutoffHz": 5657, "filterResonance": 14, "filterEnvelope": "twang 2", "vibrato": "none", "algorithm": "(1 2)←(3 4)", "feedbackType": "1⟲ 2⟲", "feedbackAmplitude": 0, "feedbackEnvelope": "steady", "operators": [{ "frequency": "~1×", "amplitude": 11, "envelope": "custom" }, { "frequency": "8×", "amplitude": 6, "envelope": "custom" }, { "frequency": "20×", "amplitude": 3, "envelope": "twang 1" }, { "frequency": "3×", "amplitude": 1, "envelope": "twang 2" }] } },
                { name: "glockenspiel", midiProgram: 9, generalMidi: true, settings: { "type": "FM", "effects": "reverb", "transition": "hard fade", "chord": "strum", "filterCutoffHz": 5657, "filterResonance": 14, "filterEnvelope": "twang 2", "vibrato": "none", "algorithm": "(1 2 3)←4", "feedbackType": "1⟲ 2⟲ 3⟲", "feedbackAmplitude": 2, "feedbackEnvelope": "decay 1", "operators": [{ "frequency": "1×", "amplitude": 7, "envelope": "custom" }, { "frequency": "5×", "amplitude": 11, "envelope": "custom" }, { "frequency": "8×", "amplitude": 7, "envelope": "custom" }, { "frequency": "20×", "amplitude": 2, "envelope": "twang 1" }] } },
                { name: "music box 1", midiProgram: 10, generalMidi: true, settings: { "type": "harmonics", "effects": "reverb", "transition": "hard fade", "chord": "strum", "filterCutoffHz": 4000, "filterResonance": 14, "filterEnvelope": "twang 2", "interval": "union", "vibrato": "none", "harmonics": [100, 0, 0, 100, 0, 0, 0, 0, 0, 0, 100, 0, 0, 0, 0, 0, 0, 0, 0, 86, 0, 0, 0, 0, 0, 0, 71, 0] } },
                { name: "music box 2", midiProgram: 10, settings: { "type": "harmonics", "effects": "reverb", "transition": "hard fade", "chord": "strum", "filterCutoffHz": 2828, "filterResonance": 14, "filterEnvelope": "twang 1", "interval": "union", "vibrato": "none", "harmonics": [100, 57, 57, 0, 0, 0, 0, 0, 0, 57, 0, 0, 0, 14, 14, 14, 14, 14, 14, 43, 14, 14, 14, 14, 14, 14, 14, 14] } },
                { name: "vibraphone", midiProgram: 11, generalMidi: true, settings: { "type": "FM", "effects": "reverb", "transition": "hard fade", "chord": "harmony", "filterCutoffHz": 2828, "filterResonance": 14, "filterEnvelope": "twang 2", "vibrato": "none", "algorithm": "1 2 3 4", "feedbackType": "1→2→3→4", "feedbackAmplitude": 3, "feedbackEnvelope": "twang 1", "operators": [{ "frequency": "1×", "amplitude": 9, "envelope": "custom" }, { "frequency": "~1×", "amplitude": 9, "envelope": "custom" }, { "frequency": "9×", "amplitude": 3, "envelope": "custom" }, { "frequency": "4×", "amplitude": 9, "envelope": "custom" }] } },
                { name: "marimba", midiProgram: 12, generalMidi: true, settings: { "type": "FM", "effects": "reverb", "transition": "hard fade", "chord": "strum", "filterCutoffHz": 2000, "filterResonance": 29, "filterEnvelope": "decay 1", "vibrato": "none", "algorithm": "1 2←(3 4)", "feedbackType": "1⟲", "feedbackAmplitude": 0, "feedbackEnvelope": "steady", "operators": [{ "frequency": "1×", "amplitude": 10, "envelope": "custom" }, { "frequency": "4×", "amplitude": 6, "envelope": "custom" }, { "frequency": "13×", "amplitude": 6, "envelope": "twang 1" }, { "frequency": "1×", "amplitude": 0, "envelope": "steady" }] } },
                { name: "kalimba", midiProgram: 108, generalMidi: true, settings: { "type": "FM", "effects": "reverb", "transition": "hard fade", "chord": "strum", "filterCutoffHz": 2828, "filterResonance": 14, "filterEnvelope": "decay 1", "vibrato": "none", "algorithm": "1←(2 3 4)", "feedbackType": "1⟲", "feedbackAmplitude": 0, "feedbackEnvelope": "steady", "operators": [{ "frequency": "1×", "amplitude": 11, "envelope": "custom" }, { "frequency": "5×", "amplitude": 3, "envelope": "twang 2" }, { "frequency": "20×", "amplitude": 3, "envelope": "twang 1" }, { "frequency": "1×", "amplitude": 0, "envelope": "steady" }] } },
                { name: "xylophone", midiProgram: 13, generalMidi: true, settings: { "type": "FM", "effects": "reverb", "transition": "hard", "chord": "strum", "filterCutoffHz": 2000, "filterResonance": 14, "filterEnvelope": "twang 1", "vibrato": "none", "algorithm": "(1 2 3)←4", "feedbackType": "1⟲ 2⟲ 3⟲", "feedbackAmplitude": 0, "feedbackEnvelope": "steady", "operators": [{ "frequency": "1×", "amplitude": 9, "envelope": "custom" }, { "frequency": "6×", "amplitude": 9, "envelope": "custom" }, { "frequency": "11×", "amplitude": 9, "envelope": "custom" }, { "frequency": "20×", "amplitude": 6, "envelope": "twang 1" }] } },
                { name: "tubular bell", midiProgram: 14, generalMidi: true, midiSubharmonicOctaves: 1, settings: { "type": "harmonics", "effects": "reverb", "transition": "hard fade", "chord": "strum", "filterCutoffHz": 4000, "filterResonance": 14, "filterEnvelope": "twang 3", "interval": "hum", "vibrato": "none", "harmonics": [43, 71, 0, 100, 0, 100, 0, 86, 0, 0, 86, 0, 14, 71, 14, 14, 57, 14, 14, 43, 14, 14, 43, 14, 14, 43, 14, 14] } },
                { name: "bell synth", midiProgram: 14, settings: { "type": "FM", "effects": "reverb", "transition": "hard fade", "chord": "strum", "filterCutoffHz": 2000, "filterResonance": 29, "filterEnvelope": "twang 3", "vibrato": "none", "algorithm": "1←(2 3 4)", "feedbackType": "1⟲", "feedbackAmplitude": 0, "feedbackEnvelope": "steady", "operators": [{ "frequency": "~2×", "amplitude": 10, "envelope": "custom" }, { "frequency": "7×", "amplitude": 6, "envelope": "twang 3" }, { "frequency": "20×", "amplitude": 1, "envelope": "twang 1" }, { "frequency": "1×", "amplitude": 0, "envelope": "steady" }] } },
                { name: "rain drop", midiProgram: 96, generalMidi: true, settings: { "type": "FM", "effects": "reverb", "transition": "hard fade", "chord": "strum", "filterCutoffHz": 4000, "filterResonance": 14, "filterEnvelope": "twang 1", "vibrato": "none", "algorithm": "(1 2)←(3 4)", "feedbackType": "1⟲ 2⟲", "feedbackAmplitude": 0, "feedbackEnvelope": "steady", "operators": [{ "frequency": "1×", "amplitude": 12, "envelope": "custom" }, { "frequency": "6×", "amplitude": 4, "envelope": "custom" }, { "frequency": "20×", "amplitude": 3, "envelope": "twang 1" }, { "frequency": "1×", "amplitude": 6, "envelope": "tremolo1" }] } },
                { name: "crystal", midiProgram: 98, generalMidi: true, settings: { "type": "FM", "effects": "reverb", "transition": "hard fade", "chord": "harmony", "filterCutoffHz": 2828, "filterResonance": 14, "filterEnvelope": "twang 2", "vibrato": "delayed", "algorithm": "1 2 3 4", "feedbackType": "1⟲ 2⟲ 3⟲ 4⟲", "feedbackAmplitude": 4, "feedbackEnvelope": "twang 1", "operators": [{ "frequency": "1×", "amplitude": 10, "envelope": "custom" }, { "frequency": "3×", "amplitude": 7, "envelope": "custom" }, { "frequency": "6×", "amplitude": 4, "envelope": "custom" }, { "frequency": "13×", "amplitude": 4, "envelope": "custom" }] } },
                { name: "tinkle bell", midiProgram: 112, generalMidi: true, settings: { "type": "FM", "effects": "reverb", "transition": "hard", "chord": "strum", "filterCutoffHz": 2828, "filterResonance": 14, "filterEnvelope": "twang 2", "vibrato": "none", "algorithm": "1 2 3 4", "feedbackType": "1→2→3→4", "feedbackAmplitude": 5, "feedbackEnvelope": "twang 3", "operators": [{ "frequency": "~2×", "amplitude": 7, "envelope": "custom" }, { "frequency": "5×", "amplitude": 7, "envelope": "custom" }, { "frequency": "7×", "amplitude": 7, "envelope": "custom" }, { "frequency": "16×", "amplitude": 7, "envelope": "custom" }] } },
                { name: "agogo", midiProgram: 113, generalMidi: true, settings: { "type": "FM", "effects": "reverb", "transition": "hard fade", "chord": "strum", "filterCutoffHz": 4000, "filterResonance": 14, "filterEnvelope": "decay 1", "vibrato": "none", "algorithm": "1 2 3 4", "feedbackType": "1→4", "feedbackAmplitude": 15, "feedbackEnvelope": "decay 1", "operators": [{ "frequency": "2×", "amplitude": 9, "envelope": "custom" }, { "frequency": "5×", "amplitude": 6, "envelope": "custom" }, { "frequency": "8×", "amplitude": 9, "envelope": "custom" }, { "frequency": "13×", "amplitude": 11, "envelope": "custom" }] } },
            ])
        },
        {
            name: "Guitar Presets",
            presets: toNameMap([
                { name: "nylon guitar", midiProgram: 24, generalMidi: true, settings: { "type": "FM", "effects": "reverb", "transition": "hard fade", "chord": "strum", "filterCutoffHz": 5657, "filterResonance": 14, "filterEnvelope": "twang 1", "vibrato": "none", "algorithm": "1←2←3←4", "feedbackType": "3⟲", "feedbackAmplitude": 6, "feedbackEnvelope": "twang 1", "operators": [{ "frequency": "1×", "amplitude": 15, "envelope": "custom" }, { "frequency": "1×", "amplitude": 6, "envelope": "steady" }, { "frequency": "5×", "amplitude": 2, "envelope": "steady" }, { "frequency": "7×", "amplitude": 4, "envelope": "steady" }] } },
                { name: "steel guitar", midiProgram: 25, generalMidi: true, settings: { "type": "harmonics", "effects": "reverb", "transition": "hard fade", "chord": "strum", "filterCutoffHz": 5657, "filterResonance": 14, "filterEnvelope": "twang 2", "interval": "union", "vibrato": "none", "harmonics": [100, 100, 86, 71, 71, 71, 86, 86, 71, 57, 43, 43, 43, 57, 57, 57, 57, 57, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43] } },
                { name: "jazz guitar", midiProgram: 26, generalMidi: true, settings: { "type": "harmonics", "effects": "reverb", "transition": "hard", "chord": "strum", "filterCutoffHz": 2000, "filterResonance": 14, "filterEnvelope": "twang 2", "interval": "union", "vibrato": "none", "harmonics": [100, 100, 86, 71, 57, 71, 71, 43, 57, 71, 57, 43, 29, 29, 29, 29, 29, 29, 29, 29, 14, 14, 14, 14, 14, 14, 14, 0] } },
                { name: "clean guitar", midiProgram: 27, generalMidi: true, settings: { "type": "harmonics", "effects": "reverb", "transition": "hard", "chord": "strum", "filterCutoffHz": 2828, "filterResonance": 14, "filterEnvelope": "twang 2", "interval": "union", "vibrato": "none", "harmonics": [86, 100, 100, 100, 86, 57, 86, 100, 100, 100, 71, 57, 43, 71, 86, 71, 57, 57, 71, 71, 71, 71, 57, 57, 57, 57, 57, 43] } },
                { name: "muted guitar", midiProgram: 28, generalMidi: true, settings: { "type": "FM", "effects": "reverb", "transition": "hard", "chord": "strum", "filterCutoffHz": 2000, "filterResonance": 14, "filterEnvelope": "twang 1", "vibrato": "none", "algorithm": "1←(2 3←4)", "feedbackType": "1⟲", "feedbackAmplitude": 7, "feedbackEnvelope": "twang 2", "operators": [{ "frequency": "1×", "amplitude": 13, "envelope": "custom" }, { "frequency": "1×", "amplitude": 4, "envelope": "twang 3" }, { "frequency": "4×", "amplitude": 4, "envelope": "twang 2" }, { "frequency": "16×", "amplitude": 4, "envelope": "twang 1" }] } },
            ])
        },
        {
            name: "Picked Bass Presets",
            presets: toNameMap([
                { name: "acoustic bass", midiProgram: 32, generalMidi: true, settings: { "type": "harmonics", "effects": "reverb", "transition": "hard fade", "chord": "strum", "filterCutoffHz": 4000, "filterResonance": 14, "filterEnvelope": "twang 1", "interval": "union", "vibrato": "none", "harmonics": [100, 86, 71, 71, 71, 71, 57, 57, 57, 57, 43, 43, 43, 43, 43, 29, 29, 29, 29, 29, 29, 14, 14, 14, 14, 14, 14, 14] } },
                { name: "fingered bass", midiProgram: 33, generalMidi: true, settings: { "type": "harmonics", "effects": "reverb", "transition": "hard fade", "chord": "strum", "filterCutoffHz": 2828, "filterResonance": 14, "filterEnvelope": "twang 1", "interval": "union", "vibrato": "none", "harmonics": [100, 86, 71, 57, 71, 43, 57, 29, 29, 29, 29, 29, 29, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 0] } },
                { name: "picked bass", midiProgram: 34, generalMidi: true, settings: { "type": "FM", "effects": "reverb", "transition": "hard fade", "chord": "strum", "filterCutoffHz": 2828, "filterResonance": 0, "filterEnvelope": "twang 1", "vibrato": "none", "algorithm": "1←(2 3←4)", "feedbackType": "3⟲", "feedbackAmplitude": 4, "feedbackEnvelope": "twang 1", "operators": [{ "frequency": "1×", "amplitude": 15, "envelope": "custom" }, { "frequency": "1×", "amplitude": 5, "envelope": "steady" }, { "frequency": "11×", "amplitude": 1, "envelope": "twang 3" }, { "frequency": "1×", "amplitude": 9, "envelope": "steady" }] } },
                { name: "fretless bass", midiProgram: 35, generalMidi: true, settings: { "type": "harmonics", "effects": "reverb", "transition": "hard", "chord": "strum", "filterCutoffHz": 1000, "filterResonance": 14, "filterEnvelope": "flare 2", "interval": "union", "vibrato": "none", "harmonics": [100, 100, 86, 71, 71, 57, 57, 71, 71, 71, 57, 57, 57, 57, 57, 57, 57, 43, 43, 43, 43, 43, 43, 43, 43, 29, 29, 14] } },
                { name: "slap bass 1", midiProgram: 36, generalMidi: true, settings: { "type": "harmonics", "effects": "reverb", "transition": "hard", "chord": "strum", "filterCutoffHz": 4000, "filterResonance": 0, "filterEnvelope": "twang 1", "interval": "union", "vibrato": "none", "harmonics": [100, 100, 100, 100, 86, 71, 57, 29, 29, 43, 43, 57, 71, 57, 29, 29, 43, 57, 57, 57, 43, 43, 43, 57, 71, 71, 71, 71] } },
                { name: "slap bass 2", midiProgram: 37, generalMidi: true, settings: { "type": "FM", "effects": "reverb", "transition": "hard", "chord": "strum", "filterCutoffHz": 5657, "filterResonance": 0, "filterEnvelope": "twang 1", "vibrato": "none", "algorithm": "1←2←3←4", "feedbackType": "3⟲", "feedbackAmplitude": 4, "feedbackEnvelope": "steady", "operators": [{ "frequency": "3×", "amplitude": 13, "envelope": "custom" }, { "frequency": "1×", "amplitude": 7, "envelope": "steady" }, { "frequency": "13×", "amplitude": 3, "envelope": "steady" }, { "frequency": "1×", "amplitude": 11, "envelope": "steady" }] } },
                { name: "bass synth 1", midiProgram: 38, generalMidi: true, settings: { "type": "FM", "effects": "reverb", "transition": "hard", "chord": "strum", "filterCutoffHz": 4000, "filterResonance": 43, "filterEnvelope": "twang 2", "vibrato": "none", "algorithm": "1←3 2←4", "feedbackType": "3⟲ 4⟲", "feedbackAmplitude": 9, "feedbackEnvelope": "twang 2", "operators": [{ "frequency": "1×", "amplitude": 15, "envelope": "custom" }, { "frequency": "1×", "amplitude": 10, "envelope": "custom" }, { "frequency": "1×", "amplitude": 14, "envelope": "twang 1" }, { "frequency": "~1×", "amplitude": 13, "envelope": "twang 2" }] } },
                { name: "bass synth 2", midiProgram: 39, generalMidi: true, settings: { "type": "FM", "effects": "reverb", "transition": "hard fade", "chord": "strum", "filterCutoffHz": 1000, "filterResonance": 57, "filterEnvelope": "punch", "vibrato": "none", "algorithm": "1←(2 3 4)", "feedbackType": "1→2", "feedbackAmplitude": 4, "feedbackEnvelope": "twang 3", "operators": [{ "frequency": "1×", "amplitude": 9, "envelope": "custom" }, { "frequency": "1×", "amplitude": 9, "envelope": "steady" }, { "frequency": "3×", "amplitude": 0, "envelope": "steady" }, { "frequency": "1×", "amplitude": 0, "envelope": "steady" }] } },
                { name: "bass & lead", midiProgram: 87, generalMidi: true, settings: { "type": "chip", "transition": "hard", "effects": "reverb", "chord": "harmony", "filterCutoffHz": 4000, "filterResonance": 86, "filterEnvelope": "twang 2", "wave": "sawtooth", "interval": "shimmer", "vibrato": "none" } },
            ])
        },
        {
            name: "Picked String Presets",
            presets: toNameMap([
                { name: "pizzicato strings", midiProgram: 45, generalMidi: true, settings: { "type": "FM", "effects": "reverb", "transition": "medium fade", "chord": "harmony", "filterCutoffHz": 1000, "filterResonance": 14, "filterEnvelope": "twang 1", "vibrato": "none", "algorithm": "(1 2 3)←4", "feedbackType": "1⟲ 2⟲ 3⟲ 4⟲", "feedbackAmplitude": 7, "feedbackEnvelope": "twang 1", "operators": [{ "frequency": "1×", "amplitude": 14, "envelope": "custom" }, { "frequency": "3×", "amplitude": 11, "envelope": "custom" }, { "frequency": "6×", "amplitude": 9, "envelope": "custom" }, { "frequency": "~1×", "amplitude": 10, "envelope": "steady" }] } },
                { name: "harp", midiProgram: 46, generalMidi: true, settings: { "type": "FM", "transition": "hard fade", "effects": "reverb", "chord": "strum", "filterCutoffHz": 2828, "filterResonance": 0, "filterEnvelope": "twang 1", "vibrato": "none", "algorithm": "1←3 2←4", "feedbackType": "3⟲", "feedbackAmplitude": 6, "feedbackEnvelope": "twang 2", "operators": [{ "frequency": "1×", "amplitude": 15, "envelope": "custom" }, { "frequency": "4×", "amplitude": 6, "envelope": "custom" }, { "frequency": "~2×", "amplitude": 3, "envelope": "steady" }, { "frequency": "1×", "amplitude": 6, "envelope": "steady" }] } },
                { name: "sitar", midiProgram: 104, generalMidi: true, settings: { "type": "FM", "transition": "hard fade", "effects": "reverb", "chord": "strum", "filterCutoffHz": 8000, "filterResonance": 57, "filterEnvelope": "twang 2", "vibrato": "none", "algorithm": "1←(2 3 4)", "feedbackType": "1⟲", "feedbackAmplitude": 0, "feedbackEnvelope": "steady", "operators": [{ "frequency": "1×", "amplitude": 15, "envelope": "custom" }, { "frequency": "1×", "amplitude": 14, "envelope": "twang 3" }, { "frequency": "9×", "amplitude": 3, "envelope": "twang 3" }, { "frequency": "16×", "amplitude": 9, "envelope": "swell 3" }] } },
                { name: "banjo", midiProgram: 105, generalMidi: true, settings: { "type": "FM", "effects": "reverb", "transition": "hard fade", "chord": "strum", "filterCutoffHz": 2828, "filterResonance": 14, "filterEnvelope": "twang 2", "vibrato": "none", "algorithm": "1←(2 3←4)", "feedbackType": "2⟲", "feedbackAmplitude": 4, "feedbackEnvelope": "steady", "operators": [{ "frequency": "4×", "amplitude": 14, "envelope": "custom" }, { "frequency": "1×", "amplitude": 10, "envelope": "steady" }, { "frequency": "11×", "amplitude": 3, "envelope": "twang 3" }, { "frequency": "1×", "amplitude": 11, "envelope": "steady" }] } },
                { name: "ukulele", midiProgram: 105, settings: { "type": "FM", "effects": "reverb", "transition": "hard fade", "chord": "strum", "filterCutoffHz": 2000, "filterResonance": 0, "filterEnvelope": "twang 1", "vibrato": "none", "algorithm": "1←(2 3←4)", "feedbackType": "3⟲", "feedbackAmplitude": 5, "feedbackEnvelope": "twang 1", "operators": [{ "frequency": "2×", "amplitude": 14, "envelope": "custom" }, { "frequency": "1×", "amplitude": 6, "envelope": "steady" }, { "frequency": "9×", "amplitude": 4, "envelope": "twang 2" }, { "frequency": "1×", "amplitude": 11, "envelope": "steady" }] } },
                { name: "shamisen", midiProgram: 106, generalMidi: true, settings: { "type": "FM", "effects": "reverb", "transition": "hard fade", "chord": "harmony", "filterCutoffHz": 8000, "filterResonance": 14, "filterEnvelope": "twang 1", "vibrato": "none", "algorithm": "1←(2 3←4)", "feedbackType": "3⟲", "feedbackAmplitude": 9, "feedbackEnvelope": "twang 3", "operators": [{ "frequency": "1×", "amplitude": 15, "envelope": "custom" }, { "frequency": "1×", "amplitude": 12, "envelope": "steady" }, { "frequency": "16×", "amplitude": 4, "envelope": "twang 3" }, { "frequency": "1×", "amplitude": 7, "envelope": "steady" }] } },
                { name: "koto", midiProgram: 107, generalMidi: true, settings: { "type": "FM", "effects": "reverb", "transition": "hard fade", "chord": "harmony", "filterCutoffHz": 4000, "filterResonance": 14, "filterEnvelope": "twang 2", "vibrato": "none", "algorithm": "1←3 2←4", "feedbackType": "1⟲ 2⟲", "feedbackAmplitude": 5, "feedbackEnvelope": "twang 2", "operators": [{ "frequency": "~1×", "amplitude": 12, "envelope": "custom" }, { "frequency": "6×", "amplitude": 10, "envelope": "custom" }, { "frequency": "4×", "amplitude": 8, "envelope": "twang 3" }, { "frequency": "~2×", "amplitude": 8, "envelope": "twang 3" }] } },
            ])
        },
        {
            name: "Distortion Presets",
            presets: toNameMap([
                { name: "overdrive guitar", midiProgram: 29, generalMidi: true, settings: { "type": "FM", "effects": "reverb", "transition": "hard", "chord": "strum", "filterCutoffHz": 2828, "filterResonance": 14, "filterEnvelope": "steady", "vibrato": "none", "algorithm": "1←(2 3←4)", "feedbackType": "1→2", "feedbackAmplitude": 2, "feedbackEnvelope": "steady", "operators": [{ "frequency": "~1×", "amplitude": 13, "envelope": "custom" }, { "frequency": "1×", "amplitude": 12, "envelope": "steady" }, { "frequency": "1×", "amplitude": 7, "envelope": "twang 3" }, { "frequency": "1×", "amplitude": 4, "envelope": "swell 3" }] } },
                { name: "distortion guitar", midiProgram: 30, generalMidi: true, settings: { "type": "FM", "effects": "reverb", "transition": "hard", "chord": "strum", "filterCutoffHz": 2828, "filterResonance": 57, "filterEnvelope": "steady", "vibrato": "none", "algorithm": "1←(2 3←4)", "feedbackType": "1→2", "feedbackAmplitude": 4, "feedbackEnvelope": "steady", "operators": [{ "frequency": "~1×", "amplitude": 13, "envelope": "custom" }, { "frequency": "1×", "amplitude": 11, "envelope": "steady" }, { "frequency": "1×", "amplitude": 9, "envelope": "swell 1" }, { "frequency": "~2×", "amplitude": 5, "envelope": "swell 3" }] } },
                { name: "charango synth", midiProgram: 84, generalMidi: true, settings: { "type": "FM", "effects": "reverb", "transition": "hard", "chord": "strum", "filterCutoffHz": 5657, "filterResonance": 0, "filterEnvelope": "twang 3", "vibrato": "none", "algorithm": "1←(2 3←4)", "feedbackType": "1→2→3→4", "feedbackAmplitude": 8, "feedbackEnvelope": "twang 3", "operators": [{ "frequency": "3×", "amplitude": 13, "envelope": "custom" }, { "frequency": "~1×", "amplitude": 5, "envelope": "steady" }, { "frequency": "4×", "amplitude": 6, "envelope": "steady" }, { "frequency": "3×", "amplitude": 7, "envelope": "steady" }] } },
                { name: "guitar harmonics", midiProgram: 31, generalMidi: true, settings: { "type": "FM", "effects": "reverb", "transition": "hard", "chord": "strum", "filterCutoffHz": 2000, "filterResonance": 29, "filterEnvelope": "steady", "vibrato": "none", "algorithm": "1←(2 3)←4", "feedbackType": "1⟲", "feedbackAmplitude": 2, "feedbackEnvelope": "steady", "operators": [{ "frequency": "4×", "amplitude": 12, "envelope": "custom" }, { "frequency": "16×", "amplitude": 5, "envelope": "swell 1" }, { "frequency": "1×", "amplitude": 2, "envelope": "punch" }, { "frequency": "~1×", "amplitude": 12, "envelope": "twang 1" }] } },
                { name: "distorted synth 1", midiProgram: 30, settings: { "type": "PWM", "effects": "reverb", "transition": "hard", "chord": "strum", "filterCutoffHz": 4000, "filterResonance": 29, "filterEnvelope": "steady", "pulseWidth": 18, "pulseEnvelope": "punch", "vibrato": "none" } },
                { name: "distorted synth 2", midiProgram: 30, settings: { "type": "FM", "effects": "reverb", "transition": "seamless", "chord": "strum", "filterCutoffHz": 8000, "filterResonance": 0, "filterEnvelope": "steady", "vibrato": "none", "algorithm": "1←(2 3 4)", "feedbackType": "1⟲", "feedbackAmplitude": 7, "feedbackEnvelope": "steady", "operators": [{ "frequency": "1×", "amplitude": 15, "envelope": "custom" }, { "frequency": "1×", "amplitude": 13, "envelope": "steady" }, { "frequency": "1×", "amplitude": 11, "envelope": "swell 1" }, { "frequency": "1×", "amplitude": 0, "envelope": "flare 1" }] } },
                { name: "distorted synth 3", midiProgram: 30, settings: { "type": "FM", "effects": "reverb", "transition": "hard", "chord": "strum", "filterCutoffHz": 8000, "filterResonance": 0, "filterEnvelope": "steady", "vibrato": "delayed", "algorithm": "1←(2 3 4)", "feedbackType": "1→2", "feedbackAmplitude": 3, "feedbackEnvelope": "steady", "operators": [{ "frequency": "~1×", "amplitude": 13, "envelope": "custom" }, { "frequency": "1×", "amplitude": 11, "envelope": "steady" }, { "frequency": "1×", "amplitude": 12, "envelope": "swell 1" }, { "frequency": "1×", "amplitude": 0, "envelope": "steady" }] } },
                { name: "distorted synth 4", midiProgram: 30, settings: { "type": "PWM", "effects": "reverb", "transition": "hard", "chord": "strum", "filterCutoffHz": 2828, "filterResonance": 57, "filterEnvelope": "steady", "pulseWidth": 50, "pulseEnvelope": "swell 1", "vibrato": "delayed" } },
            ])
        },
        {
            name: "Bellows Presets",
            presets: toNameMap([
                { name: "drawbar organ 1", midiProgram: 16, generalMidi: true, midiSubharmonicOctaves: 1, settings: { "type": "harmonics", "effects": "reverb", "transition": "hard", "chord": "harmony", "filterCutoffHz": 2828, "filterResonance": 14, "filterEnvelope": "steady", "interval": "union", "vibrato": "none", "harmonics": [86, 86, 0, 86, 0, 0, 0, 86, 0, 0, 0, 0, 0, 0, 0, 86, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] } },
                { name: "drawbar organ 2", midiProgram: 16, midiSubharmonicOctaves: 1, settings: { "type": "harmonics", "effects": "reverb", "transition": "hard", "chord": "harmony", "filterCutoffHz": 2828, "filterResonance": 14, "filterEnvelope": "steady", "interval": "union", "vibrato": "none", "harmonics": [86, 29, 71, 86, 71, 14, 0, 100, 0, 0, 0, 86, 0, 0, 0, 71, 0, 0, 0, 57, 0, 0, 0, 29, 0, 0, 0, 0] } },
                { name: "percussive organ", midiProgram: 17, generalMidi: true, midiSubharmonicOctaves: 1, settings: { "type": "FM", "transition": "hard", "effects": "reverb", "chord": "harmony", "filterCutoffHz": 2000, "filterResonance": 14, "filterEnvelope": "punch", "vibrato": "light", "algorithm": "1 2 3 4", "feedbackType": "1→3 2→4", "feedbackAmplitude": 7, "feedbackEnvelope": "decay 1", "operators": [{ "frequency": "1×", "amplitude": 7, "envelope": "custom" }, { "frequency": "2×", "amplitude": 7, "envelope": "custom" }, { "frequency": "3×", "amplitude": 8, "envelope": "custom" }, { "frequency": "4×", "amplitude": 8, "envelope": "custom" }] } },
                { name: "rock organ", midiProgram: 18, generalMidi: true, midiSubharmonicOctaves: 1, settings: { "type": "FM", "effects": "chorus & reverb", "transition": "hard", "chord": "harmony", "filterCutoffHz": 4000, "filterResonance": 14, "filterEnvelope": "punch", "vibrato": "delayed", "algorithm": "(1 2 3)←4", "feedbackType": "1⟲ 2⟲ 3⟲", "feedbackAmplitude": 2, "feedbackEnvelope": "flare 1", "operators": [{ "frequency": "1×", "amplitude": 9, "envelope": "custom" }, { "frequency": "4×", "amplitude": 9, "envelope": "custom" }, { "frequency": "6×", "amplitude": 9, "envelope": "custom" }, { "frequency": "2×", "amplitude": 5, "envelope": "steady" }] } },
                { name: "pipe organ", midiProgram: 19, generalMidi: true, midiSubharmonicOctaves: 1, settings: { "type": "FM", "transition": "cross fade", "effects": "reverb", "chord": "harmony", "filterCutoffHz": 5657, "filterResonance": 43, "filterEnvelope": "steady", "vibrato": "none", "algorithm": "1 2 3 4", "feedbackType": "1⟲ 2⟲ 3⟲ 4⟲", "feedbackAmplitude": 5, "feedbackEnvelope": "steady", "operators": [{ "frequency": "1×", "amplitude": 8, "envelope": "custom" }, { "frequency": "2×", "amplitude": 9, "envelope": "custom" }, { "frequency": "4×", "amplitude": 9, "envelope": "custom" }, { "frequency": "8×", "amplitude": 8, "envelope": "custom" }] } },
                { name: "reed organ", midiProgram: 20, generalMidi: true, settings: { "type": "harmonics", "effects": "reverb", "transition": "soft", "chord": "harmony", "filterCutoffHz": 2000, "filterResonance": 29, "filterEnvelope": "steady", "interval": "union", "vibrato": "none", "harmonics": [71, 86, 100, 86, 71, 100, 57, 71, 71, 71, 43, 43, 43, 71, 43, 71, 57, 57, 57, 57, 57, 57, 57, 29, 43, 29, 29, 14] } },
                { name: "accordion", midiProgram: 21, generalMidi: true, settings: { "type": "chip", "effects": "reverb", "transition": "cross fade", "chord": "harmony", "filterCutoffHz": 5657, "filterResonance": 0, "filterEnvelope": "swell 1", "wave": "double saw", "interval": "honky tonk", "vibrato": "none" } },
                { name: "bandoneon", midiProgram: 23, generalMidi: true, settings: { "type": "harmonics", "effects": "reverb", "transition": "soft", "chord": "harmony", "filterCutoffHz": 4000, "filterResonance": 29, "filterEnvelope": "swell 1", "interval": "hum", "vibrato": "none", "harmonics": [86, 86, 86, 57, 71, 86, 57, 71, 71, 71, 57, 43, 57, 43, 71, 43, 71, 57, 57, 43, 43, 43, 57, 43, 43, 29, 29, 29] } },
                { name: "bagpipe", midiProgram: 109, generalMidi: true, settings: { "type": "harmonics", "effects": "reverb", "transition": "cross fade", "chord": "harmony", "filterCutoffHz": 5657, "filterResonance": 43, "filterEnvelope": "punch", "interval": "hum", "vibrato": "none", "harmonics": [71, 86, 86, 100, 100, 86, 57, 100, 86, 71, 71, 71, 57, 57, 57, 71, 57, 71, 57, 71, 43, 57, 57, 43, 43, 43, 43, 43] } },
            ])
        },
        {
            name: "String Presets",
            presets: toNameMap([
                { name: "violin 1", midiProgram: 40, generalMidi: true, settings: { "type": "FM", "effects": "reverb", "transition": "cross fade", "chord": "harmony", "filterCutoffHz": 2828, "filterResonance": 43, "filterEnvelope": "steady", "vibrato": "delayed", "algorithm": "(1 2)←(3 4)", "feedbackType": "4⟲", "feedbackAmplitude": 5, "feedbackEnvelope": "twang 3", "operators": [{ "frequency": "4×", "amplitude": 9, "envelope": "custom" }, { "frequency": "3×", "amplitude": 9, "envelope": "custom" }, { "frequency": "2×", "amplitude": 7, "envelope": "steady" }, { "frequency": "7×", "amplitude": 5, "envelope": "swell 1" }] } },
                { name: "viola", midiProgram: 41, generalMidi: true, settings: { "type": "FM", "effects": "reverb", "transition": "cross fade", "chord": "harmony", "filterCutoffHz": 2000, "filterResonance": 29, "filterEnvelope": "steady", "vibrato": "delayed", "algorithm": "(1 2 3)←4", "feedbackType": "1⟲ 2⟲ 3⟲", "feedbackAmplitude": 8, "feedbackEnvelope": "swell 1", "operators": [{ "frequency": "2×", "amplitude": 11, "envelope": "custom" }, { "frequency": "7×", "amplitude": 7, "envelope": "custom" }, { "frequency": "13×", "amplitude": 4, "envelope": "custom" }, { "frequency": "1×", "amplitude": 5, "envelope": "steady" }] } },
                { name: "cello", midiProgram: 42, generalMidi: true, settings: { "type": "FM", "effects": "reverb", "transition": "cross fade", "chord": "harmony", "filterCutoffHz": 2828, "filterResonance": 29, "filterEnvelope": "steady", "vibrato": "delayed", "algorithm": "(1 2 3)←4", "feedbackType": "1⟲ 2⟲ 3⟲", "feedbackAmplitude": 6, "feedbackEnvelope": "swell 1", "operators": [{ "frequency": "1×", "amplitude": 11, "envelope": "custom" }, { "frequency": "3×", "amplitude": 9, "envelope": "custom" }, { "frequency": "8×", "amplitude": 7, "envelope": "custom" }, { "frequency": "1×", "amplitude": 6, "envelope": "steady" }] } },
                { name: "contrabass", midiProgram: 43, generalMidi: true, settings: { "type": "FM", "effects": "reverb", "transition": "cross fade", "chord": "harmony", "filterCutoffHz": 2000, "filterResonance": 29, "filterEnvelope": "steady", "vibrato": "delayed", "algorithm": "(1 2)←3←4", "feedbackType": "1⟲ 2⟲", "feedbackAmplitude": 0, "feedbackEnvelope": "steady", "operators": [{ "frequency": "16×", "amplitude": 5, "envelope": "custom" }, { "frequency": "1×", "amplitude": 10, "envelope": "custom" }, { "frequency": "1×", "amplitude": 10, "envelope": "steady" }, { "frequency": "6×", "amplitude": 3, "envelope": "swell 1" }] } },
                { name: "fiddle", midiProgram: 110, generalMidi: true, settings: { "type": "FM", "effects": "reverb", "transition": "soft", "chord": "harmony", "filterCutoffHz": 2828, "filterResonance": 29, "filterEnvelope": "steady", "vibrato": "delayed", "algorithm": "(1 2)←(3 4)", "feedbackType": "3⟲ 4⟲", "feedbackAmplitude": 5, "feedbackEnvelope": "twang 1", "operators": [{ "frequency": "2×", "amplitude": 10, "envelope": "custom" }, { "frequency": "8×", "amplitude": 8, "envelope": "custom" }, { "frequency": "1×", "amplitude": 8, "envelope": "steady" }, { "frequency": "16×", "amplitude": 3, "envelope": "steady" }] } },
                { name: "tremolo strings", midiProgram: 44, generalMidi: true, settings: { "type": "FM", "effects": "chorus & reverb", "transition": "medium fade", "chord": "harmony", "filterCutoffHz": 2000, "filterResonance": 0, "filterEnvelope": "tremolo4", "vibrato": "none", "algorithm": "1 2 3 4", "feedbackType": "1→2→3→4", "feedbackAmplitude": 12, "feedbackEnvelope": "steady", "operators": [{ "frequency": "1×", "amplitude": 8, "envelope": "custom" }, { "frequency": "~2×", "amplitude": 8, "envelope": "custom" }, { "frequency": "4×", "amplitude": 8, "envelope": "custom" }, { "frequency": "7×", "amplitude": 8, "envelope": "custom" }] } },
                { name: "strings", midiProgram: 48, generalMidi: true, settings: { "type": "FM", "effects": "chorus & reverb", "transition": "cross fade", "chord": "harmony", "filterCutoffHz": 2828, "filterResonance": 43, "filterEnvelope": "steady", "vibrato": "none", "algorithm": "(1 2)←(3 4)", "feedbackType": "4⟲", "feedbackAmplitude": 5, "feedbackEnvelope": "twang 3", "operators": [{ "frequency": "4×", "amplitude": 9, "envelope": "custom" }, { "frequency": "3×", "amplitude": 9, "envelope": "custom" }, { "frequency": "2×", "amplitude": 7, "envelope": "steady" }, { "frequency": "7×", "amplitude": 3, "envelope": "swell 1" }] } },
                { name: "slow strings", midiProgram: 49, generalMidi: true, settings: { "type": "FM", "effects": "chorus & reverb", "transition": "soft fade", "chord": "harmony", "filterCutoffHz": 1414, "filterResonance": 0, "filterEnvelope": "swell 2", "vibrato": "none", "algorithm": "(1 2)←(3 4)", "feedbackType": "4⟲", "feedbackAmplitude": 6, "feedbackEnvelope": "flare 3", "operators": [{ "frequency": "4×", "amplitude": 10, "envelope": "custom" }, { "frequency": "3×", "amplitude": 10, "envelope": "custom" }, { "frequency": "2×", "amplitude": 7, "envelope": "steady" }, { "frequency": "7×", "amplitude": 4, "envelope": "swell 1" }] } },
                { name: "strings synth 1", midiProgram: 50, generalMidi: true, settings: { "type": "chip", "transition": "soft fade", "effects": "chorus & reverb", "chord": "harmony", "filterCutoffHz": 1414, "filterResonance": 43, "filterEnvelope": "steady", "wave": "sawtooth", "interval": "hum", "vibrato": "delayed" } },
                { name: "strings synth 2", midiProgram: 51, generalMidi: true, settings: { "type": "FM", "effects": "chorus & reverb", "transition": "soft fade", "chord": "harmony", "filterCutoffHz": 2000, "filterResonance": 43, "filterEnvelope": "steady", "vibrato": "none", "algorithm": "1 2 3 4", "feedbackType": "1⟲ 2⟲ 3⟲ 4⟲", "feedbackAmplitude": 12, "feedbackEnvelope": "swell 1", "operators": [{ "frequency": "3×", "amplitude": 6, "envelope": "custom" }, { "frequency": "2×", "amplitude": 7, "envelope": "custom" }, { "frequency": "1×", "amplitude": 8, "envelope": "custom" }, { "frequency": "1×", "amplitude": 9, "envelope": "custom" }] } },
                { name: "orchestra hit 1", midiProgram: 55, generalMidi: true, midiSubharmonicOctaves: 1, settings: { "type": "FM", "effects": "chorus & reverb", "transition": "hard fade", "chord": "harmony", "filterCutoffHz": 8000, "filterResonance": 14, "filterEnvelope": "custom", "vibrato": "none", "algorithm": "1 2 3 4", "feedbackType": "1⟲ 2⟲ 3⟲ 4⟲", "feedbackAmplitude": 14, "feedbackEnvelope": "twang 3", "operators": [{ "frequency": "1×", "amplitude": 15, "envelope": "twang 3" }, { "frequency": "2×", "amplitude": 15, "envelope": "flare 3" }, { "frequency": "4×", "amplitude": 15, "envelope": "flare 2" }, { "frequency": "8×", "amplitude": 15, "envelope": "flare 1" }] } },
                { name: "violin 2", midiProgram: 40, generalMidi: true, settings: { "type": "FM", "effects": "reverb", "transition": "cross fade", "chord": "harmony", "filterCutoffHz": 2828, "filterResonance": 43, "filterEnvelope": "steady", "vibrato": "light", "algorithm": "(1 2)←(3 4)", "feedbackType": "4⟲", "feedbackAmplitude": 5, "feedbackEnvelope": "twang 3", "operators": [{ "frequency": "4×", "amplitude": 15, "envelope": "custom" }, { "frequency": "3×", "amplitude": 13, "envelope": "custom" }, { "frequency": "2×", "amplitude": 7, "envelope": "steady" }, { "frequency": "7×", "amplitude": 8, "envelope": "swell 1" }] } },
                { name: "orchestra hit 2", midiProgram: 55, midiSubharmonicOctaves: 1, settings: { "type": "FM", "effects": "chorus & reverb", "transition": "medium fade", "chord": "harmony", "filterCutoffHz": 8000, "filterResonance": 0, "filterEnvelope": "decay 1", "vibrato": "delayed", "algorithm": "1 2 3 4", "feedbackType": "1⟲ 2⟲ 3⟲ 4⟲", "feedbackAmplitude": 14, "feedbackEnvelope": "steady", "operators": [{ "frequency": "1×", "amplitude": 12, "envelope": "custom" }, { "frequency": "2×", "amplitude": 14, "envelope": "custom" }, { "frequency": "3×", "amplitude": 12, "envelope": "custom" }, { "frequency": "4×", "amplitude": 14, "envelope": "custom" }] } },
            ])
        },
        {
            name: "Vocal Presets",
            presets: toNameMap([
                { name: "choir soprano", midiProgram: 94, generalMidi: true, settings: { "type": "harmonics", "effects": "chorus & reverb", "transition": "soft fade", "chord": "harmony", "filterCutoffHz": 2828, "filterResonance": 57, "filterEnvelope": "steady", "interval": "union", "vibrato": "shaky", "harmonics": [86, 100, 86, 43, 14, 14, 57, 71, 57, 14, 14, 14, 14, 14, 43, 57, 43, 14, 14, 14, 14, 14, 14, 14, 0, 0, 0, 0] } },
                { name: "choir tenor", midiProgram: 52, generalMidi: true, settings: { "type": "harmonics", "effects": "chorus & reverb", "transition": "soft fade", "chord": "harmony", "filterCutoffHz": 2828, "filterResonance": 86, "filterEnvelope": "steady", "interval": "union", "vibrato": "shaky", "harmonics": [86, 100, 100, 86, 71, 57, 29, 14, 14, 14, 29, 43, 43, 43, 29, 14, 14, 14, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] } },
                { name: "choir bass", midiProgram: 52, settings: { "type": "harmonics", "effects": "chorus & reverb", "transition": "soft fade", "chord": "harmony", "filterCutoffHz": 2828, "filterResonance": 86, "filterEnvelope": "steady", "interval": "union", "vibrato": "shaky", "harmonics": [71, 86, 86, 100, 86, 100, 57, 43, 14, 14, 14, 14, 29, 29, 43, 43, 43, 43, 43, 29, 29, 29, 29, 14, 14, 14, 0, 0] } },
                { name: "solo soprano", midiProgram: 85, settings: { "type": "harmonics", "effects": "reverb", "transition": "cross fade", "chord": "harmony", "filterCutoffHz": 2828, "filterResonance": 71, "filterEnvelope": "steady", "interval": "union", "vibrato": "shaky", "harmonics": [86, 100, 86, 43, 14, 14, 57, 71, 57, 14, 14, 14, 14, 14, 43, 57, 43, 14, 14, 14, 14, 14, 14, 14, 0, 0, 0, 0] } },
                { name: "solo tenor", midiProgram: 85, settings: { "type": "harmonics", "effects": "reverb", "transition": "cross fade", "chord": "harmony", "filterCutoffHz": 2828, "filterResonance": 86, "filterEnvelope": "steady", "interval": "union", "vibrato": "shaky", "harmonics": [86, 100, 100, 86, 71, 57, 29, 14, 14, 14, 29, 43, 43, 43, 29, 14, 14, 14, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] } },
                { name: "solo bass", midiProgram: 85, settings: { "type": "harmonics", "effects": "reverb", "transition": "cross fade", "chord": "harmony", "filterCutoffHz": 2828, "filterResonance": 86, "filterEnvelope": "steady", "interval": "union", "vibrato": "shaky", "harmonics": [71, 86, 86, 100, 86, 100, 57, 43, 14, 14, 14, 14, 29, 29, 43, 43, 43, 43, 43, 29, 29, 29, 29, 14, 14, 14, 0, 0] } },
                { name: "voice ooh", midiProgram: 53, generalMidi: true, settings: { "type": "harmonics", "effects": "reverb", "transition": "soft", "chord": "harmony", "filterCutoffHz": 1414, "filterResonance": 57, "filterEnvelope": "steady", "interval": "union", "vibrato": "shaky", "harmonics": [100, 57, 43, 43, 14, 14, 0, 0, 0, 14, 29, 29, 14, 0, 14, 29, 29, 14, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] } },
                { name: "voice synth", midiProgram: 54, generalMidi: true, settings: { "type": "chip", "transition": "medium fade", "effects": "chorus & reverb", "chord": "harmony", "filterCutoffHz": 4000, "filterResonance": 57, "filterEnvelope": "steady", "wave": "rounded", "interval": "union", "vibrato": "light" } },
                { name: "vox synth lead", midiProgram: 85, generalMidi: true, settings: { "type": "FM", "effects": "chorus & reverb", "transition": "cross fade", "chord": "harmony", "filterCutoffHz": 2828, "filterResonance": 14, "filterEnvelope": "steady", "vibrato": "light", "algorithm": "(1 2 3)←4", "feedbackType": "1→2→3→4", "feedbackAmplitude": 2, "feedbackEnvelope": "punch", "operators": [{ "frequency": "2×", "amplitude": 10, "envelope": "custom" }, { "frequency": "9×", "amplitude": 5, "envelope": "custom" }, { "frequency": "20×", "amplitude": 1, "envelope": "custom" }, { "frequency": "~1×", "amplitude": 4, "envelope": "steady" }] } },
                { name: "tiny robot", midiProgram: 85, settings: { "type": "FM", "transition": "slide", "effects": "reverb", "chord": "harmony", "filterCutoffHz": 8000, "filterResonance": 0, "filterEnvelope": "steady", "vibrato": "delayed", "algorithm": "1←(2 3 4)", "feedbackType": "1⟲", "feedbackAmplitude": 2, "feedbackEnvelope": "twang 3", "operators": [{ "frequency": "2×", "amplitude": 15, "envelope": "custom" }, { "frequency": "1×", "amplitude": 7, "envelope": "punch" }, { "frequency": "~1×", "amplitude": 7, "envelope": "steady" }, { "frequency": "1×", "amplitude": 0, "envelope": "steady" }] } },
                { name: "yowie", midiProgram: 85, settings: { "type": "FM", "effects": "reverb", "transition": "cross fade", "chord": "harmony", "filterCutoffHz": 2000, "filterResonance": 86, "filterEnvelope": "tremolo5", "vibrato": "none", "algorithm": "1←2←(3 4)", "feedbackType": "1⟲", "feedbackAmplitude": 12, "feedbackEnvelope": "tremolo3", "operators": [{ "frequency": "2×", "amplitude": 12, "envelope": "custom" }, { "frequency": "16×", "amplitude": 5, "envelope": "steady" }, { "frequency": "1×", "amplitude": 5, "envelope": "steady" }, { "frequency": "1×", "amplitude": 0, "envelope": "steady" }] } },
                { name: "mouse", midiProgram: 85, settings: { "type": "FM", "effects": "reverb", "transition": "slide", "chord": "harmony", "filterCutoffHz": 8000, "filterResonance": 0, "filterEnvelope": "steady", "vibrato": "light", "algorithm": "1 2 3 4", "feedbackType": "1⟲ 2⟲", "feedbackAmplitude": 5, "feedbackEnvelope": "flare 2", "operators": [{ "frequency": "2×", "amplitude": 13, "envelope": "custom" }, { "frequency": "5×", "amplitude": 12, "envelope": "custom" }, { "frequency": "1×", "amplitude": 0, "envelope": "steady" }, { "frequency": "1×", "amplitude": 0, "envelope": "steady" }] } },
                { name: "gumdrop", midiProgram: 85, settings: { "type": "FM", "effects": "reverb", "transition": "hard", "chord": "harmony", "filterCutoffHz": 8000, "filterResonance": 0, "filterEnvelope": "steady", "vibrato": "none", "algorithm": "(1 2 3)←4", "feedbackType": "1⟲ 2⟲ 3⟲", "feedbackAmplitude": 0, "feedbackEnvelope": "steady", "operators": [{ "frequency": "2×", "amplitude": 15, "envelope": "punch" }, { "frequency": "4×", "amplitude": 15, "envelope": "punch" }, { "frequency": "7×", "amplitude": 15, "envelope": "punch" }, { "frequency": "1×", "amplitude": 10, "envelope": "twang 1" }] } },
                { name: "echo drop", midiProgram: 102, generalMidi: true, settings: { "type": "FM", "effects": "chorus & reverb", "transition": "hard", "chord": "harmony", "filterCutoffHz": 2828, "filterResonance": 14, "filterEnvelope": "punch", "vibrato": "none", "algorithm": "1←(2 3←4)", "feedbackType": "1⟲", "feedbackAmplitude": 2, "feedbackEnvelope": "steady", "operators": [{ "frequency": "~2×", "amplitude": 11, "envelope": "custom" }, { "frequency": "~1×", "amplitude": 5, "envelope": "steady" }, { "frequency": "11×", "amplitude": 2, "envelope": "steady" }, { "frequency": "16×", "amplitude": 5, "envelope": "swell 3" }] } },
                { name: "dark choir", midiProgram: 85, settings: { "type": "spectrum", "effects": "reverb", "transition": "soft", "chord": "harmony", "filterCutoffHz": 4000, "filterResonance": 29, "filterEnvelope": "swell 1", "spectrum": [43, 14, 14, 14, 14, 14, 14, 100, 14, 14, 14, 57, 14, 14, 100, 14, 43, 14, 43, 14, 14, 43, 14, 29, 14, 29, 14, 14, 29, 0] } },
            ])
        },
        {
            name: "Brass Presets",
            presets: toNameMap([
                { name: "trumpet", midiProgram: 56, generalMidi: true, settings: { "type": "FM", "effects": "reverb", "transition": "soft", "chord": "harmony", "filterCutoffHz": 2828, "filterResonance": 43, "filterEnvelope": "steady", "vibrato": "none", "algorithm": "1←(2 3 4)", "feedbackType": "1⟲", "feedbackAmplitude": 9, "feedbackEnvelope": "swell 1", "operators": [{ "frequency": "1×", "amplitude": 14, "envelope": "custom" }, { "frequency": "1×", "amplitude": 8, "envelope": "steady" }, { "frequency": "1×", "amplitude": 5, "envelope": "flare 2" }, { "frequency": "1×", "amplitude": 0, "envelope": "steady" }] } },
                { name: "trombone", midiProgram: 57, generalMidi: true, settings: { "type": "FM", "effects": "reverb", "transition": "soft", "chord": "harmony", "filterCutoffHz": 2000, "filterResonance": 43, "filterEnvelope": "steady", "vibrato": "none", "algorithm": "1←(2 3 4)", "feedbackType": "2⟲", "feedbackAmplitude": 7, "feedbackEnvelope": "swell 1", "operators": [{ "frequency": "1×", "amplitude": 14, "envelope": "custom" }, { "frequency": "1×", "amplitude": 8, "envelope": "steady" }, { "frequency": "1×", "amplitude": 0, "envelope": "steady" }, { "frequency": "1×", "amplitude": 0, "envelope": "steady" }] } },
                { name: "tuba", midiProgram: 58, generalMidi: true, settings: { "type": "FM", "effects": "reverb", "transition": "soft", "chord": "harmony", "filterCutoffHz": 2000, "filterResonance": 43, "filterEnvelope": "steady", "vibrato": "none", "algorithm": "1←(2 3 4)", "feedbackType": "2⟲", "feedbackAmplitude": 8, "feedbackEnvelope": "swell 1", "operators": [{ "frequency": "1×", "amplitude": 14, "envelope": "custom" }, { "frequency": "1×", "amplitude": 6, "envelope": "steady" }, { "frequency": "1×", "amplitude": 0, "envelope": "steady" }, { "frequency": "1×", "amplitude": 0, "envelope": "steady" }] } },
                { name: "muted trumpet", midiProgram: 59, generalMidi: true, settings: { "type": "FM", "effects": "reverb", "transition": "soft", "chord": "harmony", "filterCutoffHz": 2828, "filterResonance": 29, "filterEnvelope": "swell 1", "vibrato": "none", "algorithm": "1←(2 3←4)", "feedbackType": "1⟲", "feedbackAmplitude": 5, "feedbackEnvelope": "flare 2", "operators": [{ "frequency": "1×", "amplitude": 13, "envelope": "custom" }, { "frequency": "1×", "amplitude": 5, "envelope": "steady" }, { "frequency": "9×", "amplitude": 5, "envelope": "steady" }, { "frequency": "13×", "amplitude": 9, "envelope": "swell 1" }] } },
                { name: "french horn", midiProgram: 60, generalMidi: true, settings: { "type": "FM", "transition": "soft", "effects": "reverb", "chord": "harmony", "filterCutoffHz": 2828, "filterResonance": 14, "filterEnvelope": "steady", "vibrato": "none", "algorithm": "1←3 2←4", "feedbackType": "1⟲ 2⟲", "feedbackAmplitude": 3, "feedbackEnvelope": "swell 1", "operators": [{ "frequency": "1×", "amplitude": 15, "envelope": "custom" }, { "frequency": "1×", "amplitude": 12, "envelope": "custom" }, { "frequency": "1×", "amplitude": 10, "envelope": "swell 1" }, { "frequency": "~1×", "amplitude": 8, "envelope": "flare 2" }] } },
                { name: "brass section", midiProgram: 61, generalMidi: true, settings: { "type": "FM", "effects": "reverb", "transition": "soft", "chord": "harmony", "filterCutoffHz": 2828, "filterResonance": 14, "filterEnvelope": "punch", "vibrato": "none", "algorithm": "1←3 2←4", "feedbackType": "1⟲ 2⟲", "feedbackAmplitude": 6, "feedbackEnvelope": "swell 1", "operators": [{ "frequency": "1×", "amplitude": 14, "envelope": "custom" }, { "frequency": "1×", "amplitude": 12, "envelope": "custom" }, { "frequency": "1×", "amplitude": 10, "envelope": "swell 1" }, { "frequency": "~1×", "amplitude": 10, "envelope": "swell 1" }] } },
                { name: "brass synth 1", midiProgram: 62, generalMidi: true, settings: { "type": "FM", "effects": "reverb", "transition": "soft", "chord": "harmony", "filterCutoffHz": 4000, "filterResonance": 29, "filterEnvelope": "steady", "vibrato": "none", "algorithm": "1←3 2←4", "feedbackType": "1⟲ 2⟲", "feedbackAmplitude": 11, "feedbackEnvelope": "swell 1", "operators": [{ "frequency": "1×", "amplitude": 14, "envelope": "custom" }, { "frequency": "1×", "amplitude": 14, "envelope": "custom" }, { "frequency": "1×", "amplitude": 12, "envelope": "flare 1" }, { "frequency": "~1×", "amplitude": 8, "envelope": "flare 2" }] } },
                { name: "brass synth 2", midiProgram: 63, generalMidi: true, settings: { "type": "FM", "transition": "soft", "effects": "reverb", "chord": "harmony", "filterCutoffHz": 4000, "filterResonance": 43, "filterEnvelope": "twang 3", "vibrato": "none", "algorithm": "1←3 2←4", "feedbackType": "1⟲ 2⟲", "feedbackAmplitude": 9, "feedbackEnvelope": "swell 1", "operators": [{ "frequency": "1×", "amplitude": 15, "envelope": "custom" }, { "frequency": "1×", "amplitude": 15, "envelope": "custom" }, { "frequency": "1×", "amplitude": 10, "envelope": "flare 1" }, { "frequency": "~1×", "amplitude": 7, "envelope": "flare 1" }] } },
                { name: "pulse brass", midiProgram: 62, settings: { "type": "PWM", "effects": "reverb", "transition": "soft", "chord": "harmony", "filterCutoffHz": 4000, "filterResonance": 29, "filterEnvelope": "swell 1", "pulseWidth": 50, "pulseEnvelope": "flare 3", "vibrato": "none" } },
            ])
        },
        {
            name: "Reed Presets",
            presets: toNameMap([
                { name: "soprano sax", midiProgram: 64, generalMidi: true, settings: { "type": "FM", "effects": "reverb", "transition": "soft", "chord": "harmony", "filterCutoffHz": 2000, "filterResonance": 29, "filterEnvelope": "steady", "vibrato": "none", "algorithm": "1←2←3←4", "feedbackType": "4⟲", "feedbackAmplitude": 5, "feedbackEnvelope": "swell 1", "operators": [{ "frequency": "1×", "amplitude": 13, "envelope": "custom" }, { "frequency": "4×", "amplitude": 4, "envelope": "swell 1" }, { "frequency": "1×", "amplitude": 7, "envelope": "steady" }, { "frequency": "5×", "amplitude": 4, "envelope": "punch" }] } },
                { name: "alto sax", midiProgram: 65, generalMidi: true, settings: { "type": "FM", "effects": "reverb", "transition": "soft", "chord": "harmony", "filterCutoffHz": 2000, "filterResonance": 43, "filterEnvelope": "steady", "vibrato": "none", "algorithm": "1←(2 3←4)", "feedbackType": "1⟲", "feedbackAmplitude": 4, "feedbackEnvelope": "punch", "operators": [{ "frequency": "1×", "amplitude": 13, "envelope": "custom" }, { "frequency": "1×", "amplitude": 6, "envelope": "steady" }, { "frequency": "4×", "amplitude": 6, "envelope": "swell 1" }, { "frequency": "1×", "amplitude": 12, "envelope": "steady" }] } },
                { name: "tenor sax", midiProgram: 66, generalMidi: true, settings: { "type": "FM", "effects": "reverb", "transition": "soft", "chord": "harmony", "filterCutoffHz": 2828, "filterResonance": 29, "filterEnvelope": "steady", "vibrato": "none", "algorithm": "1←2←3←4", "feedbackType": "1⟲", "feedbackAmplitude": 6, "feedbackEnvelope": "swell 1", "operators": [{ "frequency": "2×", "amplitude": 12, "envelope": "custom" }, { "frequency": "3×", "amplitude": 7, "envelope": "steady" }, { "frequency": "1×", "amplitude": 3, "envelope": "steady" }, { "frequency": "8×", "amplitude": 3, "envelope": "steady" }] } },
                { name: "baritone sax", midiProgram: 67, generalMidi: true, settings: { "type": "FM", "effects": "reverb", "transition": "soft", "chord": "harmony", "filterCutoffHz": 2828, "filterResonance": 0, "filterEnvelope": "steady", "vibrato": "none", "algorithm": "1←(2 3←4)", "feedbackType": "1⟲", "feedbackAmplitude": 2, "feedbackEnvelope": "swell 2", "operators": [{ "frequency": "1×", "amplitude": 12, "envelope": "custom" }, { "frequency": "8×", "amplitude": 4, "envelope": "steady" }, { "frequency": "4×", "amplitude": 5, "envelope": "steady" }, { "frequency": "1×", "amplitude": 4, "envelope": "punch" }] } },
                { name: "sax synth", midiProgram: 64, settings: { "type": "FM", "effects": "reverb", "transition": "soft", "chord": "harmony", "filterCutoffHz": 8000, "filterResonance": 0, "filterEnvelope": "steady", "vibrato": "light", "algorithm": "1←(2 3 4)", "feedbackType": "1⟲ 2⟲", "feedbackAmplitude": 4, "feedbackEnvelope": "steady", "operators": [{ "frequency": "4×", "amplitude": 15, "envelope": "custom" }, { "frequency": "1×", "amplitude": 15, "envelope": "steady" }, { "frequency": "1×", "amplitude": 0, "envelope": "steady" }, { "frequency": "1×", "amplitude": 0, "envelope": "steady" }] } },
                { name: "shehnai", midiProgram: 111, generalMidi: true, settings: { "type": "FM", "effects": "reverb", "transition": "soft", "chord": "harmony", "filterCutoffHz": 8000, "filterResonance": 0, "filterEnvelope": "steady", "vibrato": "light", "algorithm": "1←(2 3 4)", "feedbackType": "1⟲", "feedbackAmplitude": 3, "feedbackEnvelope": "steady", "operators": [{ "frequency": "4×", "amplitude": 15, "envelope": "custom" }, { "frequency": "1×", "amplitude": 8, "envelope": "steady" }, { "frequency": "1×", "amplitude": 0, "envelope": "steady" }, { "frequency": "1×", "amplitude": 0, "envelope": "steady" }] } },
                { name: "oboe", midiProgram: 68, generalMidi: true, settings: { "type": "FM", "effects": "reverb", "transition": "cross fade", "chord": "harmony", "filterCutoffHz": 4000, "filterResonance": 14, "filterEnvelope": "swell 1", "vibrato": "none", "algorithm": "1 2←(3 4)", "feedbackType": "2⟲", "feedbackAmplitude": 2, "feedbackEnvelope": "tremolo5", "operators": [{ "frequency": "1×", "amplitude": 7, "envelope": "custom" }, { "frequency": "4×", "amplitude": 12, "envelope": "custom" }, { "frequency": "1×", "amplitude": 6, "envelope": "steady" }, { "frequency": "6×", "amplitude": 2, "envelope": "steady" }] } },
                { name: "english horn", midiProgram: 69, generalMidi: true, settings: { "type": "FM", "effects": "reverb", "transition": "cross fade", "chord": "harmony", "filterCutoffHz": 2000, "filterResonance": 14, "filterEnvelope": "steady", "vibrato": "none", "algorithm": "1 2←(3 4)", "feedbackType": "2⟲", "feedbackAmplitude": 2, "feedbackEnvelope": "steady", "operators": [{ "frequency": "4×", "amplitude": 12, "envelope": "custom" }, { "frequency": "2×", "amplitude": 10, "envelope": "custom" }, { "frequency": "1×", "amplitude": 8, "envelope": "punch" }, { "frequency": "8×", "amplitude": 4, "envelope": "steady" }] } },
                { name: "bassoon", midiProgram: 70, generalMidi: true, settings: { "type": "FM", "effects": "reverb", "transition": "soft", "chord": "harmony", "filterCutoffHz": 707, "filterResonance": 57, "filterEnvelope": "steady", "vibrato": "none", "algorithm": "1←(2 3←4)", "feedbackType": "1⟲", "feedbackAmplitude": 2, "feedbackEnvelope": "steady", "operators": [{ "frequency": "2×", "amplitude": 11, "envelope": "custom" }, { "frequency": "1×", "amplitude": 6, "envelope": "steady" }, { "frequency": "6×", "amplitude": 6, "envelope": "swell 1" }, { "frequency": "1×", "amplitude": 0, "envelope": "steady" }] } },
                { name: "clarinet", midiProgram: 71, generalMidi: true, settings: { "type": "harmonics", "effects": "reverb", "transition": "soft", "chord": "harmony", "filterCutoffHz": 1414, "filterResonance": 14, "filterEnvelope": "steady", "interval": "union", "vibrato": "none", "harmonics": [100, 43, 86, 57, 86, 71, 86, 71, 71, 71, 71, 71, 71, 43, 71, 71, 57, 57, 57, 57, 57, 57, 43, 43, 43, 29, 14, 0] } },
                { name: "harmonica", midiProgram: 22, generalMidi: true, settings: { "type": "FM", "effects": "reverb", "transition": "soft", "chord": "harmony", "filterCutoffHz": 5657, "filterResonance": 29, "filterEnvelope": "swell 1", "vibrato": "none", "algorithm": "1←(2 3←4)", "feedbackType": "1⟲", "feedbackAmplitude": 9, "feedbackEnvelope": "tremolo5", "operators": [{ "frequency": "2×", "amplitude": 14, "envelope": "custom" }, { "frequency": "1×", "amplitude": 15, "envelope": "steady" }, { "frequency": "~2×", "amplitude": 2, "envelope": "twang 3" }, { "frequency": "1×", "amplitude": 0, "envelope": "steady" }] } },
            ])
        },
        {
            name: "Flute Presets",
            presets: toNameMap([
                { name: "flute 1", midiProgram: 73, generalMidi: true, settings: { "type": "FM", "effects": "reverb", "transition": "soft", "chord": "harmony", "filterCutoffHz": 5657, "filterResonance": 14, "filterEnvelope": "steady", "vibrato": "none", "algorithm": "1←(2 3 4)", "feedbackType": "4⟲", "feedbackAmplitude": 7, "feedbackEnvelope": "decay 2", "operators": [{ "frequency": "1×", "amplitude": 15, "envelope": "custom" }, { "frequency": "2×", "amplitude": 4, "envelope": "steady" }, { "frequency": "1×", "amplitude": 3, "envelope": "steady" }, { "frequency": "~1×", "amplitude": 1, "envelope": "punch" }] } },
                { name: "recorder", midiProgram: 74, generalMidi: true, settings: { "type": "harmonics", "effects": "reverb", "transition": "soft", "chord": "harmony", "filterCutoffHz": 4000, "filterResonance": 29, "filterEnvelope": "swell 2", "interval": "union", "vibrato": "none", "harmonics": [100, 43, 57, 43, 57, 43, 43, 43, 43, 43, 43, 43, 43, 29, 29, 29, 29, 29, 29, 29, 14, 14, 14, 14, 14, 14, 14, 0] } },
                { name: "whistle", midiProgram: 78, generalMidi: true, settings: { "type": "harmonics", "effects": "chorus & reverb", "transition": "soft", "chord": "harmony", "filterCutoffHz": 2000, "filterResonance": 43, "filterEnvelope": "steady", "interval": "union", "vibrato": "delayed", "harmonics": [100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] } },
                { name: "ocarina", midiProgram: 79, generalMidi: true, settings: { "type": "harmonics", "effects": "reverb", "transition": "soft", "chord": "harmony", "filterCutoffHz": 2828, "filterResonance": 43, "filterEnvelope": "steady", "interval": "union", "vibrato": "none", "harmonics": [100, 14, 57, 14, 29, 14, 14, 14, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] } },
                { name: "piccolo", midiProgram: 72, generalMidi: true, settings: { "type": "FM", "effects": "reverb", "transition": "soft", "chord": "harmony", "filterCutoffHz": 5657, "filterResonance": 43, "filterEnvelope": "steady", "vibrato": "none", "algorithm": "1←3 2←4", "feedbackType": "4⟲", "feedbackAmplitude": 15, "feedbackEnvelope": "twang 1", "operators": [{ "frequency": "1×", "amplitude": 15, "envelope": "custom" }, { "frequency": "1×", "amplitude": 10, "envelope": "custom" }, { "frequency": "~2×", "amplitude": 3, "envelope": "punch" }, { "frequency": "~1×", "amplitude": 5, "envelope": "punch" }] } },
                { name: "shakuhachi", midiProgram: 77, generalMidi: true, settings: { "type": "FM", "effects": "chorus & reverb", "transition": "soft", "chord": "harmony", "filterCutoffHz": 4000, "filterResonance": 14, "filterEnvelope": "steady", "vibrato": "delayed", "algorithm": "1←(2 3←4)", "feedbackType": "3→4", "feedbackAmplitude": 15, "feedbackEnvelope": "steady", "operators": [{ "frequency": "1×", "amplitude": 15, "envelope": "custom" }, { "frequency": "2×", "amplitude": 3, "envelope": "punch" }, { "frequency": "~1×", "amplitude": 4, "envelope": "twang 1" }, { "frequency": "20×", "amplitude": 15, "envelope": "steady" }] } },
                { name: "pan flute", midiProgram: 75, generalMidi: true, settings: { "type": "spectrum", "effects": "reverb", "transition": "soft", "chord": "harmony", "filterCutoffHz": 8000, "filterResonance": 43, "filterEnvelope": "steady", "spectrum": [100, 0, 0, 0, 0, 0, 0, 14, 0, 0, 0, 71, 0, 0, 14, 0, 57, 0, 29, 14, 29, 14, 14, 29, 14, 29, 14, 14, 29, 14] } },
                { name: "blown bottle", midiProgram: 76, generalMidi: true, settings: { "type": "FM", "effects": "chorus & reverb", "transition": "cross fade", "chord": "harmony", "filterCutoffHz": 5657, "filterResonance": 57, "filterEnvelope": "steady", "vibrato": "none", "algorithm": "1 2 3 4", "feedbackType": "1⟲ 2⟲ 3⟲ 4⟲", "feedbackAmplitude": 7, "feedbackEnvelope": "twang 1", "operators": [{ "frequency": "1×", "amplitude": 15, "envelope": "custom" }, { "frequency": "3×", "amplitude": 4, "envelope": "custom" }, { "frequency": "6×", "amplitude": 2, "envelope": "custom" }, { "frequency": "11×", "amplitude": 2, "envelope": "custom" }] } },
                { name: "calliope", midiProgram: 82, generalMidi: true, settings: { "type": "spectrum", "transition": "cross fade", "effects": "reverb", "chord": "harmony", "filterCutoffHz": 5657, "filterResonance": 14, "filterEnvelope": "steady", "spectrum": [100, 0, 0, 0, 0, 0, 0, 86, 0, 0, 0, 71, 0, 0, 57, 0, 43, 0, 29, 14, 14, 29, 14, 14, 14, 14, 14, 14, 14, 14] } },
                { name: "chiffer", midiProgram: 83, generalMidi: true, settings: { "type": "spectrum", "effects": "reverb", "transition": "hard", "chord": "harmony", "filterCutoffHz": 2000, "filterResonance": 14, "filterEnvelope": "punch", "spectrum": [86, 0, 0, 0, 0, 0, 0, 71, 0, 0, 0, 71, 0, 0, 57, 0, 57, 0, 43, 14, 14, 43, 14, 29, 14, 29, 29, 29, 29, 14] } },
                { name: "breath noise", midiProgram: 121, generalMidi: true, settings: { "type": "spectrum", "effects": "reverb", "transition": "cross fade", "chord": "strum", "filterCutoffHz": 5657, "filterResonance": 14, "filterEnvelope": "twang 1", "spectrum": [71, 0, 0, 0, 0, 0, 0, 29, 0, 0, 0, 71, 0, 0, 29, 0, 100, 29, 14, 29, 100, 29, 100, 14, 14, 71, 0, 29, 0, 0] } },
                { name: "flute 2", midiProgram: 73, generalMidi: true, settings: { "type": "harmonics", "effects": "reverb", "transition": "seamless", "chord": "harmony", "filterCutoffHz": 1414, "filterResonance": 14, "filterEnvelope": "steady", "interval": "union", "vibrato": "delayed", "harmonics": [100, 43, 86, 57, 86, 71, 86, 71, 71, 71, 71, 71, 71, 43, 71, 71, 57, 57, 57, 57, 57, 57, 43, 43, 43, 29, 14, 0] } },
            ])
        },
        {
            name: "Pad Presets",
            presets: toNameMap([
                { name: "new age pad", midiProgram: 88, generalMidi: true, settings: { "type": "FM", "effects": "chorus & reverb", "transition": "hard fade", "chord": "harmony", "filterCutoffHz": 8000, "filterResonance": 43, "filterEnvelope": "twang 3", "vibrato": "none", "algorithm": "1←(2 3←4)", "feedbackType": "1⟲ 2⟲", "feedbackAmplitude": 3, "feedbackEnvelope": "swell 3", "operators": [{ "frequency": "2×", "amplitude": 14, "envelope": "custom" }, { "frequency": "~1×", "amplitude": 4, "envelope": "swell 2" }, { "frequency": "6×", "amplitude": 3, "envelope": "twang 3" }, { "frequency": "13×", "amplitude": 3, "envelope": "steady" }] } },
                { name: "warm pad", midiProgram: 89, generalMidi: true, settings: { "type": "FM", "effects": "chorus & reverb", "transition": "soft fade", "chord": "harmony", "filterCutoffHz": 2828, "filterResonance": 29, "filterEnvelope": "swell 3", "vibrato": "none", "algorithm": "1←(2 3 4)", "feedbackType": "1⟲", "feedbackAmplitude": 7, "feedbackEnvelope": "steady", "operators": [{ "frequency": "1×", "amplitude": 14, "envelope": "custom" }, { "frequency": "1×", "amplitude": 6, "envelope": "swell 1" }, { "frequency": "1×", "amplitude": 0, "envelope": "steady" }, { "frequency": "1×", "amplitude": 0, "envelope": "steady" }] } },
                { name: "polysynth pad", midiProgram: 90, generalMidi: true, settings: { "type": "chip", "transition": "hard fade", "effects": "chorus & reverb", "chord": "harmony", "filterCutoffHz": 2828, "filterResonance": 43, "filterEnvelope": "twang 3", "wave": "sawtooth", "interval": "hum", "vibrato": "delayed" } },
                { name: "space voice pad", midiProgram: 91, generalMidi: true, settings: { "type": "FM", "effects": "chorus & reverb", "transition": "medium fade", "chord": "harmony", "filterCutoffHz": 4000, "filterResonance": 71, "filterEnvelope": "steady", "vibrato": "none", "algorithm": "(1 2 3)←4", "feedbackType": "1⟲ 2⟲ 3⟲ 4⟲", "feedbackAmplitude": 5, "feedbackEnvelope": "swell 2", "operators": [{ "frequency": "1×", "amplitude": 10, "envelope": "custom" }, { "frequency": "2×", "amplitude": 8, "envelope": "custom" }, { "frequency": "3×", "amplitude": 7, "envelope": "custom" }, { "frequency": "11×", "amplitude": 1, "envelope": "punch" }] } },
                { name: "bowed glass pad", midiProgram: 92, generalMidi: true, settings: { "type": "FM", "effects": "reverb", "transition": "soft fade", "chord": "harmony", "filterCutoffHz": 4000, "filterResonance": 14, "filterEnvelope": "twang 3", "vibrato": "none", "algorithm": "1←3 2←4", "feedbackType": "1⟲ 2⟲", "feedbackAmplitude": 0, "feedbackEnvelope": "steady", "operators": [{ "frequency": "1×", "amplitude": 10, "envelope": "custom" }, { "frequency": "2×", "amplitude": 12, "envelope": "custom" }, { "frequency": "3×", "amplitude": 7, "envelope": "twang 3" }, { "frequency": "7×", "amplitude": 4, "envelope": "flare 3" }] } },
                { name: "metallic pad", midiProgram: 93, generalMidi: true, settings: { "type": "FM", "effects": "reverb", "transition": "medium fade", "chord": "harmony", "filterCutoffHz": 5657, "filterResonance": 14, "filterEnvelope": "twang 3", "vibrato": "none", "algorithm": "1←3 2←4", "feedbackType": "1⟲ 2⟲", "feedbackAmplitude": 13, "feedbackEnvelope": "twang 3", "operators": [{ "frequency": "1×", "amplitude": 15, "envelope": "custom" }, { "frequency": "~1×", "amplitude": 9, "envelope": "custom" }, { "frequency": "1×", "amplitude": 7, "envelope": "swell 2" }, { "frequency": "11×", "amplitude": 7, "envelope": "steady" }] } },
                { name: "sweep pad", midiProgram: 95, generalMidi: true, settings: { "type": "chip", "effects": "chorus & reverb", "transition": "soft fade", "chord": "harmony", "filterCutoffHz": 4000, "filterResonance": 86, "filterEnvelope": "flare 3", "wave": "sawtooth", "interval": "hum", "vibrato": "none" } },
                { name: "atmosphere", midiProgram: 99, generalMidi: true, settings: { "type": "FM", "effects": "chorus & reverb", "transition": "hard fade", "chord": "strum", "filterCutoffHz": 4000, "filterResonance": 29, "filterEnvelope": "steady", "vibrato": "none", "algorithm": "1←(2 3 4)", "feedbackType": "3⟲ 4⟲", "feedbackAmplitude": 3, "feedbackEnvelope": "steady", "operators": [{ "frequency": "1×", "amplitude": 14, "envelope": "custom" }, { "frequency": "1×", "amplitude": 10, "envelope": "swell 3" }, { "frequency": "3×", "amplitude": 7, "envelope": "twang 2" }, { "frequency": "1×", "amplitude": 7, "envelope": "twang 3" }] } },
                { name: "brightness", midiProgram: 100, generalMidi: true, settings: { "type": "harmonics", "effects": "chorus & reverb", "transition": "medium fade", "chord": "harmony", "filterCutoffHz": 2828, "filterResonance": 14, "filterEnvelope": "twang 3", "interval": "octave", "vibrato": "none", "harmonics": [100, 86, 86, 86, 43, 57, 43, 71, 43, 43, 43, 57, 43, 43, 57, 71, 57, 43, 29, 43, 57, 57, 43, 29, 29, 29, 29, 14] } },
                { name: "goblins", midiProgram: 101, generalMidi: true, settings: { "type": "FM", "effects": "chorus & reverb", "transition": "soft fade", "chord": "harmony", "filterCutoffHz": 1414, "filterResonance": 14, "filterEnvelope": "swell 2", "vibrato": "none", "algorithm": "1←2←3←4", "feedbackType": "1⟲", "feedbackAmplitude": 10, "feedbackEnvelope": "flare 3", "operators": [{ "frequency": "1×", "amplitude": 15, "envelope": "custom" }, { "frequency": "4×", "amplitude": 5, "envelope": "swell 3" }, { "frequency": "1×", "amplitude": 10, "envelope": "tremolo1" }, { "frequency": "1×", "amplitude": 0, "envelope": "steady" }] } },
                { name: "sci-fi", midiProgram: 103, generalMidi: true, settings: { "type": "FM", "effects": "chorus & reverb", "transition": "medium fade", "chord": "harmony", "filterCutoffHz": 5657, "filterResonance": 14, "filterEnvelope": "twang 3", "vibrato": "none", "algorithm": "(1 2)←3←4", "feedbackType": "1⟲ 2⟲ 3⟲ 4⟲", "feedbackAmplitude": 8, "feedbackEnvelope": "twang 3", "operators": [{ "frequency": "~1×", "amplitude": 13, "envelope": "custom" }, { "frequency": "2×", "amplitude": 10, "envelope": "custom" }, { "frequency": "5×", "amplitude": 5, "envelope": "twang 3" }, { "frequency": "11×", "amplitude": 8, "envelope": "tremolo5" }] } },
                { name: "flutter pad", midiProgram: 90, settings: { "type": "FM", "effects": "chorus & reverb", "transition": "hard fade", "chord": "harmony", "filterCutoffHz": 4000, "filterResonance": 86, "filterEnvelope": "twang 3", "vibrato": "delayed", "algorithm": "(1 2)←(3 4)", "feedbackType": "1⟲ 2⟲ 3⟲", "feedbackAmplitude": 9, "feedbackEnvelope": "steady", "operators": [{ "frequency": "1×", "amplitude": 13, "envelope": "custom" }, { "frequency": "5×", "amplitude": 7, "envelope": "custom" }, { "frequency": "7×", "amplitude": 5, "envelope": "tremolo1" }, { "frequency": "~1×", "amplitude": 6, "envelope": "punch" }] } },
                { name: "feedback pad", midiProgram: 89, settings: { "type": "FM", "effects": "reverb", "transition": "soft fade", "chord": "custom interval", "filterCutoffHz": 8000, "filterResonance": 0, "filterEnvelope": "steady", "vibrato": "none", "algorithm": "1 2 3 4", "feedbackType": "1⟲ 2⟲ 3⟲ 4⟲", "feedbackAmplitude": 7, "feedbackEnvelope": "swell 2", "operators": [{ "frequency": "1×", "amplitude": 15, "envelope": "custom" }, { "frequency": "1×", "amplitude": 15, "envelope": "custom" }, { "frequency": "1×", "amplitude": 15, "envelope": "custom" }, { "frequency": "~1×", "amplitude": 15, "envelope": "custom" }] } },
            ])
        },
        {
            name: "Drum Presets",
            presets: toNameMap([
                { name: "standard drumset", midiProgram: 116, isNoise: true, settings: { "type": "drumset", "effects": "reverb", "drums": [{ "filterEnvelope": "twang 1", "spectrum": [57, 71, 71, 86, 86, 86, 71, 71, 71, 71, 57, 57, 57, 57, 43, 43, 43, 43, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29] }, { "filterEnvelope": "twang 1", "spectrum": [0, 0, 0, 100, 71, 71, 57, 86, 57, 57, 57, 71, 43, 43, 57, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43] }, { "filterEnvelope": "twang 1", "spectrum": [0, 0, 0, 0, 100, 57, 43, 43, 29, 57, 43, 29, 71, 43, 43, 43, 43, 57, 43, 43, 43, 43, 43, 43, 43, 43, 29, 43, 43, 43] }, { "filterEnvelope": "twang 1", "spectrum": [0, 0, 0, 0, 0, 71, 57, 43, 43, 43, 57, 57, 43, 29, 57, 43, 43, 43, 29, 43, 57, 43, 43, 43, 43, 43, 43, 29, 43, 43] }, { "filterEnvelope": "decay 2", "spectrum": [0, 14, 29, 43, 86, 71, 29, 43, 43, 43, 43, 29, 71, 29, 71, 29, 43, 43, 43, 43, 57, 43, 43, 57, 43, 43, 43, 57, 57, 57] }, { "filterEnvelope": "decay 1", "spectrum": [0, 0, 14, 14, 14, 14, 29, 29, 29, 43, 43, 43, 57, 57, 57, 71, 71, 71, 71, 71, 71, 71, 71, 57, 57, 57, 57, 43, 43, 43] }, { "filterEnvelope": "twang 3", "spectrum": [43, 43, 43, 71, 29, 29, 43, 43, 43, 29, 43, 43, 43, 29, 29, 43, 43, 29, 29, 29, 57, 14, 57, 43, 43, 57, 43, 43, 57, 57] }, { "filterEnvelope": "decay 3", "spectrum": [29, 43, 43, 43, 43, 29, 29, 43, 29, 29, 43, 29, 14, 29, 43, 29, 43, 29, 57, 29, 43, 57, 43, 71, 43, 71, 57, 57, 71, 71] }, { "filterEnvelope": "twang 3", "spectrum": [43, 29, 29, 43, 29, 29, 29, 57, 29, 29, 29, 57, 43, 43, 29, 29, 57, 43, 43, 43, 71, 43, 43, 71, 57, 71, 71, 71, 71, 71] }, { "filterEnvelope": "decay 3", "spectrum": [57, 57, 57, 43, 57, 57, 43, 43, 57, 43, 43, 43, 71, 57, 43, 57, 86, 71, 57, 86, 71, 57, 86, 100, 71, 86, 86, 86, 86, 86] }, { "filterEnvelope": "flare 1", "spectrum": [0, 0, 14, 14, 14, 14, 29, 29, 29, 43, 43, 43, 57, 57, 71, 71, 86, 86, 100, 100, 100, 100, 100, 100, 100, 100, 86, 57, 29, 0] }, { "filterEnvelope": "decay 2", "spectrum": [14, 14, 14, 14, 29, 14, 14, 29, 14, 43, 14, 43, 57, 86, 57, 57, 100, 57, 43, 43, 57, 100, 57, 43, 29, 14, 0, 0, 0, 0] }] } },
                { name: "steel pan", midiProgram: 114, generalMidi: true, settings: { "type": "FM", "effects": "chorus & reverb", "transition": "hard fade", "chord": "harmony", "filterCutoffHz": 2828, "filterResonance": 0, "filterEnvelope": "decay 2", "vibrato": "none", "algorithm": "1←(2 3←4)", "feedbackType": "1⟲", "feedbackAmplitude": 0, "feedbackEnvelope": "steady", "operators": [{ "frequency": "~1×", "amplitude": 14, "envelope": "custom" }, { "frequency": "7×", "amplitude": 3, "envelope": "flare 1" }, { "frequency": "3×", "amplitude": 5, "envelope": "flare 2" }, { "frequency": "4×", "amplitude": 4, "envelope": "swell 2" }] } },
                { name: "steel pan synth", midiProgram: 114, settings: { "type": "FM", "effects": "reverb", "transition": "hard", "chord": "harmony", "filterCutoffHz": 2828, "filterResonance": 0, "filterEnvelope": "twang 1", "vibrato": "none", "algorithm": "1 2 3←4", "feedbackType": "1⟲", "feedbackAmplitude": 5, "feedbackEnvelope": "flare 1", "operators": [{ "frequency": "~1×", "amplitude": 12, "envelope": "custom" }, { "frequency": "2×", "amplitude": 15, "envelope": "custom" }, { "frequency": "4×", "amplitude": 14, "envelope": "flare 1" }, { "frequency": "~1×", "amplitude": 3, "envelope": "flare 2" }] } },
                { name: "timpani", midiProgram: 47, generalMidi: true, settings: { "type": "spectrum", "effects": "reverb", "transition": "hard fade", "chord": "harmony", "filterCutoffHz": 4000, "filterResonance": 29, "filterEnvelope": "twang 2", "spectrum": [100, 0, 0, 0, 86, 0, 0, 71, 0, 14, 43, 14, 43, 43, 0, 29, 43, 29, 29, 29, 43, 29, 43, 29, 43, 43, 43, 43, 43, 43] } },
                { name: "dark strike", midiProgram: 47, settings: { "type": "spectrum", "effects": "reverb", "transition": "hard fade", "chord": "harmony", "filterCutoffHz": 4000, "filterResonance": 29, "filterEnvelope": "twang 2", "spectrum": [0, 0, 0, 0, 14, 14, 14, 29, 29, 43, 43, 86, 43, 43, 43, 29, 86, 29, 29, 29, 86, 29, 14, 14, 14, 14, 0, 0, 0, 0] } },
                { name: "woodblock", midiProgram: 115, generalMidi: true, isNoise: true, midiSubharmonicOctaves: -2.5, settings: { "type": "spectrum", "effects": "reverb", "transition": "hard fade", "chord": "strum", "filterCutoffHz": 2828, "filterResonance": 14, "filterEnvelope": "twang 1", "spectrum": [0, 14, 29, 43, 43, 57, 86, 86, 71, 57, 57, 43, 43, 57, 86, 86, 43, 43, 71, 57, 57, 57, 57, 57, 86, 86, 71, 71, 71, 71] } },
                { name: "taiko drum", midiProgram: 116, generalMidi: true, isNoise: true, midiSubharmonicOctaves: -0.5, settings: { "type": "spectrum", "effects": "reverb", "transition": "hard fade", "chord": "strum", "filterCutoffHz": 2828, "filterResonance": 29, "filterEnvelope": "twang 1", "spectrum": [71, 100, 100, 43, 43, 71, 71, 43, 43, 43, 43, 43, 43, 57, 29, 57, 43, 57, 43, 43, 57, 43, 43, 43, 43, 43, 43, 43, 43, 43] } },
                { name: "melodic drum", midiProgram: 117, generalMidi: true, isNoise: true, midiSubharmonicOctaves: -1.5, settings: { "type": "spectrum", "effects": "reverb", "transition": "hard fade", "chord": "strum", "filterCutoffHz": 2828, "filterResonance": 43, "filterEnvelope": "twang 1", "spectrum": [100, 71, 71, 57, 57, 43, 43, 71, 43, 43, 43, 57, 43, 43, 57, 43, 43, 43, 43, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29] } },
                { name: "drum synth", midiProgram: 118, generalMidi: true, isNoise: true, midiSubharmonicOctaves: -2, settings: { "type": "spectrum", "effects": "reverb", "transition": "hard fade", "chord": "harmony", "filterCutoffHz": 4000, "filterResonance": 43, "filterEnvelope": "decay 1", "spectrum": [100, 86, 71, 57, 43, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29] } },
                { name: "tom-tom", midiProgram: 116, isNoise: true, midiSubharmonicOctaves: -1, settings: { "type": "spectrum", "effects": "reverb", "transition": "hard fade", "chord": "strum", "filterCutoffHz": 2000, "filterResonance": 14, "filterEnvelope": "twang 1", "spectrum": [100, 29, 14, 0, 0, 86, 14, 43, 29, 86, 29, 14, 29, 57, 43, 43, 43, 43, 57, 43, 43, 43, 29, 57, 43, 43, 43, 43, 43, 43] } },
                { name: "metal pipe", midiProgram: 117, isNoise: true, midiSubharmonicOctaves: -1.5, settings: { "type": "spectrum", "effects": "reverb", "transition": "hard fade", "chord": "strum", "filterCutoffHz": 8000, "filterResonance": 14, "filterEnvelope": "twang 2", "spectrum": [29, 43, 86, 43, 43, 43, 43, 43, 100, 29, 14, 14, 100, 14, 14, 0, 0, 0, 0, 0, 14, 29, 29, 14, 0, 0, 14, 29, 0, 0] } },
            ])
        },
        {
            name: "Novelty Presets",
            presets: toNameMap([
                { name: "guitar fret noise", midiProgram: 120, generalMidi: true, settings: { "type": "spectrum", "effects": "reverb", "transition": "hard", "chord": "harmony", "filterCutoffHz": 8000, "filterResonance": 86, "filterEnvelope": "flare 1", "spectrum": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 14, 0, 0, 0, 29, 14, 0, 0, 43, 0, 43, 0, 71, 43, 0, 57, 0] } },
                { name: "fifth saw lead", midiProgram: 86, generalMidi: true, midiSubharmonicOctaves: 1, settings: { "type": "chip", "effects": "chorus & reverb", "transition": "hard fade", "chord": "harmony", "filterCutoffHz": 2828, "filterResonance": 57, "filterEnvelope": "twang 3", "wave": "sawtooth", "interval": "fifth", "vibrato": "none" } },
                { name: "fifth swell", midiProgram: 86, midiSubharmonicOctaves: 1, settings: { "type": "chip", "effects": "chorus & reverb", "transition": "hard fade", "chord": "harmony", "filterCutoffHz": 2000, "filterResonance": 57, "filterEnvelope": "swell 3", "wave": "sawtooth", "interval": "fifth", "vibrato": "none" } },
                { name: "soundtrack", midiProgram: 97, generalMidi: true, settings: { "type": "chip", "effects": "chorus & reverb", "transition": "soft fade", "chord": "harmony", "filterCutoffHz": 2000, "filterResonance": 14, "filterEnvelope": "flare 3", "wave": "sawtooth", "interval": "fifth", "vibrato": "none" } },
                { name: "reverse cymbal", midiProgram: 119, generalMidi: true, isNoise: true, midiSubharmonicOctaves: -3, settings: { "type": "spectrum", "effects": "none", "transition": "soft", "chord": "harmony", "filterCutoffHz": 4000, "filterResonance": 14, "filterEnvelope": "swell 3", "spectrum": [29, 57, 57, 29, 57, 57, 29, 29, 43, 29, 29, 43, 29, 29, 57, 57, 14, 57, 14, 57, 71, 71, 57, 86, 57, 100, 86, 86, 86, 86] } },
                { name: "seashore", midiProgram: 122, generalMidi: true, isNoise: true, midiSubharmonicOctaves: -3, settings: { "type": "spectrum", "transition": "soft fade", "effects": "reverb", "chord": "harmony", "filterCutoffHz": 2828, "filterResonance": 0, "filterEnvelope": "swell 3", "spectrum": [14, 14, 29, 29, 43, 43, 43, 57, 57, 57, 57, 57, 57, 71, 71, 71, 71, 71, 71, 71, 71, 71, 71, 71, 71, 71, 71, 71, 71, 57] } },
                { name: "bird tweet", midiProgram: 123, generalMidi: true, settings: { "type": "harmonics", "effects": "reverb", "transition": "soft", "chord": "strum", "filterCutoffHz": 2828, "filterResonance": 0, "filterEnvelope": "decay 1", "interval": "hum", "vibrato": "heavy", "harmonics": [0, 0, 14, 100, 14, 0, 0, 14, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] } },
                { name: "telephone ring", midiProgram: 124, generalMidi: true, settings: { "type": "FM", "effects": "reverb", "transition": "hard", "chord": "arpeggio", "filterCutoffHz": 4000, "filterResonance": 14, "filterEnvelope": "tremolo4", "vibrato": "none", "algorithm": "1←(2 3 4)", "feedbackType": "1⟲", "feedbackAmplitude": 2, "feedbackEnvelope": "steady", "operators": [{ "frequency": "2×", "amplitude": 12, "envelope": "custom" }, { "frequency": "1×", "amplitude": 4, "envelope": "tremolo1" }, { "frequency": "20×", "amplitude": 1, "envelope": "steady" }, { "frequency": "1×", "amplitude": 0, "envelope": "steady" }] } },
                { name: "helicopter", midiProgram: 125, generalMidi: true, isNoise: true, midiSubharmonicOctaves: -0.5, settings: { "type": "spectrum", "effects": "reverb", "transition": "seamless", "chord": "arpeggio", "filterCutoffHz": 1414, "filterResonance": 14, "filterEnvelope": "tremolo4", "spectrum": [14, 43, 43, 57, 57, 57, 71, 71, 71, 71, 86, 86, 86, 86, 86, 86, 86, 86, 86, 86, 86, 71, 71, 71, 71, 71, 71, 71, 57, 57] } },
                { name: "applause", midiProgram: 126, generalMidi: true, isNoise: true, midiSubharmonicOctaves: -3, settings: { "type": "spectrum", "effects": "reverb", "transition": "soft fade", "chord": "harmony", "filterCutoffHz": 2000, "filterResonance": 14, "filterEnvelope": "swell 3", "spectrum": [14, 14, 29, 29, 29, 43, 43, 57, 71, 71, 86, 86, 86, 71, 71, 57, 57, 57, 71, 86, 86, 86, 86, 86, 71, 71, 57, 57, 57, 57] } },
                { name: "gunshot", midiProgram: 127, generalMidi: true, isNoise: true, midiSubharmonicOctaves: -2, settings: { "type": "spectrum", "effects": "reverb", "transition": "hard fade", "chord": "strum", "filterCutoffHz": 1414, "filterResonance": 29, "filterEnvelope": "twang 1", "spectrum": [14, 29, 43, 43, 57, 57, 57, 71, 71, 71, 86, 86, 86, 86, 86, 86, 86, 86, 86, 86, 86, 71, 71, 71, 71, 57, 57, 57, 57, 43] } },
                { name: "scoot", midiProgram: 92, settings: { "type": "chip", "transition": "hard", "effects": "reverb", "chord": "harmony", "filterCutoffHz": 707, "filterResonance": 86, "filterEnvelope": "flare 1", "wave": "sawtooth", "interval": "shimmer", "vibrato": "none" } },
                { name: "buzz saw", midiProgram: 30, settings: { "type": "FM", "effects": "reverb", "transition": "soft", "chord": "custom interval", "filterCutoffHz": 2000, "filterResonance": 0, "filterEnvelope": "steady", "vibrato": "none", "algorithm": "1←2←3←4", "feedbackType": "1⟲", "feedbackAmplitude": 0, "feedbackEnvelope": "steady", "operators": [{ "frequency": "5×", "amplitude": 13, "envelope": "custom" }, { "frequency": "1×", "amplitude": 10, "envelope": "steady" }, { "frequency": "~1×", "amplitude": 6, "envelope": "steady" }, { "frequency": "11×", "amplitude": 12, "envelope": "steady" }] } },
                { name: "mosquito", midiProgram: 93, settings: { "type": "PWM", "effects": "reverb", "transition": "cross fade", "chord": "harmony", "filterCutoffHz": 2828, "filterResonance": 57, "filterEnvelope": "steady", "pulseWidth": 4, "pulseEnvelope": "tremolo6", "vibrato": "shaky" } },
                { name: "breathing", midiProgram: 126, isNoise: true, midiSubharmonicOctaves: -1, settings: { "type": "spectrum", "effects": "reverb", "transition": "hard fade", "chord": "harmony", "filterCutoffHz": 2000, "filterResonance": 14, "filterEnvelope": "swell 2", "spectrum": [14, 14, 14, 29, 29, 29, 29, 29, 43, 29, 29, 43, 43, 43, 29, 29, 71, 43, 86, 86, 57, 100, 86, 86, 86, 86, 71, 86, 71, 57] } },
                { name: "klaxon synth", midiProgram: 125, isNoise: true, midiSubharmonicOctaves: -1, settings: { "type": "noise", "effects": "reverb", "transition": "slide", "chord": "harmony", "filterCutoffHz": 2000, "filterResonance": 86, "filterEnvelope": "steady", "wave": "buzz" } },
                { name: "theremin", midiProgram: 40, settings: { "type": "harmonics", "effects": "reverb", "transition": "slide", "chord": "harmony", "filterCutoffHz": 4000, "filterResonance": 14, "filterEnvelope": "steady", "interval": "union", "vibrato": "heavy", "harmonics": [100, 71, 57, 43, 29, 29, 14, 14, 14, 14, 14, 14, 14, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] } },
                { name: "sonar ping", midiProgram: 121, settings: { "type": "spectrum", "effects": "reverb", "transition": "medium fade", "chord": "harmony", "filterCutoffHz": 1414, "filterResonance": 14, "filterEnvelope": "twang 2", "spectrum": [100, 43, 29, 29, 14, 14, 14, 14, 14, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] } },
            ])
        },
    ]);

    function scaleElementsByFactor(array, factor) {
        for (let i = 0; i < array.length; i++) {
            array[i] *= factor;
        }
    }
    function isPowerOf2(n) {
        return !!n && !(n & (n - 1));
    }
    function countBits(n) {
        if (!isPowerOf2(n))
            throw new Error("FFT array length must be a power of 2.");
        return Math.round(Math.log(n) / Math.log(2));
    }
    function reverseIndexBits(array, fullArrayLength) {
        const bitCount = countBits(fullArrayLength);
        if (bitCount > 16)
            throw new Error("FFT array length must not be greater than 2^16.");
        const finalShift = 16 - bitCount;
        for (let i = 0; i < fullArrayLength; i++) {
            let j;
            j = ((i & 0xaaaa) >> 1) | ((i & 0x5555) << 1);
            j = ((j & 0xcccc) >> 2) | ((j & 0x3333) << 2);
            j = ((j & 0xf0f0) >> 4) | ((j & 0x0f0f) << 4);
            j = ((j >> 8) | ((j & 0xff) << 8)) >> finalShift;
            if (j > i) {
                let temp = array[i];
                array[i] = array[j];
                array[j] = temp;
            }
        }
    }
    function inverseRealFourierTransform(array, fullArrayLength) {
        const totalPasses = countBits(fullArrayLength);
        if (fullArrayLength < 4)
            throw new Error("FFT array length must be at least 4.");
        for (let pass = totalPasses - 1; pass >= 2; pass--) {
            const subStride = 1 << pass;
            const midSubStride = subStride >> 1;
            const stride = subStride << 1;
            const radiansIncrement = Math.PI * 2.0 / stride;
            const cosIncrement = Math.cos(radiansIncrement);
            const sinIncrement = Math.sin(radiansIncrement);
            const oscillatorMultiplier = 2.0 * cosIncrement;
            for (let startIndex = 0; startIndex < fullArrayLength; startIndex += stride) {
                const startIndexA = startIndex;
                const midIndexA = startIndexA + midSubStride;
                const startIndexB = startIndexA + subStride;
                const midIndexB = startIndexB + midSubStride;
                const stopIndex = startIndexB + subStride;
                const realStartA = array[startIndexA];
                const imagStartB = array[startIndexB];
                array[startIndexA] = realStartA + imagStartB;
                array[midIndexA] *= 2;
                array[startIndexB] = realStartA - imagStartB;
                array[midIndexB] *= 2;
                let c = cosIncrement;
                let s = -sinIncrement;
                let cPrev = 1.0;
                let sPrev = 0.0;
                for (let index = 1; index < midSubStride; index++) {
                    const indexA0 = startIndexA + index;
                    const indexA1 = startIndexB - index;
                    const indexB0 = startIndexB + index;
                    const indexB1 = stopIndex - index;
                    const real0 = array[indexA0];
                    const real1 = array[indexA1];
                    const imag0 = array[indexB0];
                    const imag1 = array[indexB1];
                    const tempA = real0 - real1;
                    const tempB = imag0 + imag1;
                    array[indexA0] = real0 + real1;
                    array[indexA1] = imag1 - imag0;
                    array[indexB0] = tempA * c - tempB * s;
                    array[indexB1] = tempB * c + tempA * s;
                    const cTemp = oscillatorMultiplier * c - cPrev;
                    const sTemp = oscillatorMultiplier * s - sPrev;
                    cPrev = c;
                    sPrev = s;
                    c = cTemp;
                    s = sTemp;
                }
            }
        }
        for (let index = 0; index < fullArrayLength; index += 4) {
            const index1 = index + 1;
            const index2 = index + 2;
            const index3 = index + 3;
            const real0 = array[index];
            const real1 = array[index1] * 2;
            const imag2 = array[index2];
            const imag3 = array[index3] * 2;
            const tempA = real0 + imag2;
            const tempB = real0 - imag2;
            array[index] = tempA + real1;
            array[index1] = tempA - real1;
            array[index2] = tempB + imag3;
            array[index3] = tempB - imag3;
        }
        reverseIndexBits(array, fullArrayLength);
    }

    class Deque {
        constructor() {
            this._capacity = 1;
            this._buffer = [undefined];
            this._mask = 0;
            this._offset = 0;
            this._count = 0;
        }
        pushFront(element) {
            if (this._count >= this._capacity)
                this._expandCapacity();
            this._offset = (this._offset - 1) & this._mask;
            this._buffer[this._offset] = element;
            this._count++;
        }
        pushBack(element) {
            if (this._count >= this._capacity)
                this._expandCapacity();
            this._buffer[(this._offset + this._count) & this._mask] = element;
            this._count++;
        }
        popFront() {
            if (this._count <= 0)
                throw new Error("No elements left to pop.");
            const element = this._buffer[this._offset];
            this._buffer[this._offset] = undefined;
            this._offset = (this._offset + 1) & this._mask;
            this._count--;
            return element;
        }
        popBack() {
            if (this._count <= 0)
                throw new Error("No elements left to pop.");
            this._count--;
            const index = (this._offset + this._count) & this._mask;
            const element = this._buffer[index];
            this._buffer[index] = undefined;
            return element;
        }
        peakFront() {
            if (this._count <= 0)
                throw new Error("No elements left to pop.");
            return this._buffer[this._offset];
        }
        peakBack() {
            if (this._count <= 0)
                throw new Error("No elements left to pop.");
            return this._buffer[(this._offset + this._count - 1) & this._mask];
        }
        count() {
            return this._count;
        }
        set(index, element) {
            if (index < 0 || index >= this._count)
                throw new Error("Invalid index");
            this._buffer[(this._offset + index) & this._mask] = element;
        }
        get(index) {
            if (index < 0 || index >= this._count)
                throw new Error("Invalid index");
            return this._buffer[(this._offset + index) & this._mask];
        }
        remove(index) {
            if (index < 0 || index >= this._count)
                throw new Error("Invalid index");
            if (index <= (this._count >> 1)) {
                while (index > 0) {
                    this.set(index, this.get(index - 1));
                    index--;
                }
                this.popFront();
            }
            else {
                index++;
                while (index < this._count) {
                    this.set(index - 1, this.get(index));
                    index++;
                }
                this.popBack();
            }
        }
        _expandCapacity() {
            if (this._capacity >= 0x40000000)
                throw new Error("Capacity too big.");
            this._capacity = this._capacity << 1;
            const oldBuffer = this._buffer;
            const newBuffer = new Array(this._capacity);
            const size = this._count | 0;
            const offset = this._offset | 0;
            for (let i = 0; i < size; i++) {
                newBuffer[i] = oldBuffer[(offset + i) & this._mask];
            }
            for (let i = size; i < this._capacity; i++) {
                newBuffer[i] = undefined;
            }
            this._offset = 0;
            this._buffer = newBuffer;
            this._mask = this._capacity - 1;
        }
    }

    const base64IntToCharCode = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 45, 95];
    const base64CharCodeToInt = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 62, 62, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 0, 0, 0, 0, 0, 0, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 0, 0, 0, 0, 63, 0, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 0, 0, 0, 0, 0];
    class BitFieldReader {
        constructor(source, startIndex, stopIndex) {
            this._bits = [];
            this._readIndex = 0;
            for (let i = startIndex; i < stopIndex; i++) {
                const value = base64CharCodeToInt[source.charCodeAt(i)];
                this._bits.push((value >> 5) & 0x1);
                this._bits.push((value >> 4) & 0x1);
                this._bits.push((value >> 3) & 0x1);
                this._bits.push((value >> 2) & 0x1);
                this._bits.push((value >> 1) & 0x1);
                this._bits.push(value & 0x1);
            }
        }
        read(bitCount) {
            let result = 0;
            while (bitCount > 0) {
                result = result << 1;
                result += this._bits[this._readIndex++];
                bitCount--;
            }
            return result;
        }
        readLongTail(minValue, minBits) {
            let result = minValue;
            let numBits = minBits;
            while (this._bits[this._readIndex++]) {
                result += 1 << numBits;
                numBits++;
            }
            while (numBits > 0) {
                numBits--;
                if (this._bits[this._readIndex++]) {
                    result += 1 << numBits;
                }
            }
            return result;
        }
        readPartDuration() {
            return this.readLongTail(1, 3);
        }
        readLegacyPartDuration() {
            return this.readLongTail(1, 2);
        }
        readPinCount() {
            return this.readLongTail(1, 0);
        }
        readPitchInterval() {
            if (this.read(1)) {
                return -this.readLongTail(1, 3);
            }
            else {
                return this.readLongTail(1, 3);
            }
        }
    }
    class BitFieldWriter {
        constructor() {
            this._index = 0;
            this._bits = [];
        }
        clear() {
            this._index = 0;
        }
        write(bitCount, value) {
            bitCount--;
            while (bitCount >= 0) {
                this._bits[this._index++] = (value >>> bitCount) & 1;
                bitCount--;
            }
        }
        writeLongTail(minValue, minBits, value) {
            if (value < minValue)
                throw new Error("value out of bounds");
            value -= minValue;
            let numBits = minBits;
            while (value >= (1 << numBits)) {
                this._bits[this._index++] = 1;
                value -= 1 << numBits;
                numBits++;
            }
            this._bits[this._index++] = 0;
            while (numBits > 0) {
                numBits--;
                this._bits[this._index++] = (value >>> numBits) & 1;
            }
        }
        writePartDuration(value) {
            this.writeLongTail(1, 3, value);
        }
        writePinCount(value) {
            this.writeLongTail(1, 0, value);
        }
        writePitchInterval(value) {
            if (value < 0) {
                this.write(1, 1);
                this.writeLongTail(1, 3, -value);
            }
            else {
                this.write(1, 0);
                this.writeLongTail(1, 3, value);
            }
        }
        concat(other) {
            for (let i = 0; i < other._index; i++) {
                this._bits[this._index++] = other._bits[i];
            }
        }
        encodeBase64(buffer) {
            for (let i = 0; i < this._index; i += 6) {
                const value = (this._bits[i] << 5) | (this._bits[i + 1] << 4) | (this._bits[i + 2] << 3) | (this._bits[i + 3] << 2) | (this._bits[i + 4] << 1) | this._bits[i + 5];
                buffer.push(base64IntToCharCode[value]);
            }
            return buffer;
        }
        lengthBase64() {
            return Math.ceil(this._index / 6);
        }
    }
    function makeNotePin(interval, time, volume) {
        return { interval: interval, time: time, volume: volume };
    }
    function clamp(min, max, val) {
        max = max - 1;
        if (val <= max) {
            if (val >= min)
                return val;
            else
                return min;
        }
        else {
            return max;
        }
    }
    function validateRange(min, max, val) {
        if (min <= val && val <= max)
            return val;
        throw new Error(`Value ${val} not in range [${min}, ${max}]`);
    }
    class Note {
        constructor(pitch, start, end, volume, fadeout = false) {
            this.pitches = [pitch];
            this.pins = [makeNotePin(0, 0, volume), makeNotePin(0, end - start, fadeout ? 0 : volume)];
            this.start = start;
            this.end = end;
        }
        pickMainInterval() {
            let longestFlatIntervalDuration = 0;
            let mainInterval = 0;
            for (let pinIndex = 1; pinIndex < this.pins.length; pinIndex++) {
                const pinA = this.pins[pinIndex - 1];
                const pinB = this.pins[pinIndex];
                if (pinA.interval == pinB.interval) {
                    const duration = pinB.time - pinA.time;
                    if (longestFlatIntervalDuration < duration) {
                        longestFlatIntervalDuration = duration;
                        mainInterval = pinA.interval;
                    }
                }
            }
            if (longestFlatIntervalDuration == 0) {
                let loudestVolume = 0;
                for (let pinIndex = 0; pinIndex < this.pins.length; pinIndex++) {
                    const pin = this.pins[pinIndex];
                    if (loudestVolume < pin.volume) {
                        loudestVolume = pin.volume;
                        mainInterval = pin.interval;
                    }
                }
            }
            return mainInterval;
        }
        clone() {
            const newNote = new Note(-1, this.start, this.end, 6);
            newNote.pitches = this.pitches.concat();
            newNote.pins = [];
            for (const pin of this.pins) {
                newNote.pins.push(makeNotePin(pin.interval, pin.time, pin.volume));
            }
            return newNote;
        }
    }
    class Pattern {
        constructor() {
            this.notes = [];
            this.instrument = 0;
        }
        cloneNotes() {
            const result = [];
            for (const note of this.notes) {
                result.push(note.clone());
            }
            return result;
        }
        reset() {
            this.notes.length = 0;
            this.instrument = 0;
        }
    }
    class Operator {
        constructor(index) {
            this.frequency = 0;
            this.amplitude = 0;
            this.envelope = 0;
            this.reset(index);
        }
        reset(index) {
            this.frequency = 0;
            this.amplitude = (index <= 1) ? Config.operatorAmplitudeMax : 0;
            this.envelope = (index == 0) ? 0 : 1;
        }
        copy(other) {
            this.frequency = other.frequency;
            this.amplitude = other.amplitude;
            this.envelope = other.envelope;
        }
    }
    class SpectrumWave {
        constructor(isNoiseChannel) {
            this.spectrum = [];
            this._wave = null;
            this._waveIsReady = false;
            this.reset(isNoiseChannel);
        }
        reset(isNoiseChannel) {
            for (let i = 0; i < Config.spectrumControlPoints; i++) {
                if (isNoiseChannel) {
                    this.spectrum[i] = Math.round(Config.spectrumMax * (1 / Math.sqrt(1 + i / 3)));
                }
                else {
                    const isHarmonic = i == 0 || i == 7 || i == 11 || i == 14 || i == 16 || i == 18 || i == 21 || i == 23 || i >= 25;
                    this.spectrum[i] = isHarmonic ? Math.max(0, Math.round(Config.spectrumMax * (1 - i / 30))) : 0;
                }
            }
            this._waveIsReady = false;
        }
        markCustomWaveDirty() {
            this._waveIsReady = false;
        }
        getCustomWave(lowestOctave) {
            if (!this._waveIsReady || this._wave == null) {
                let waveLength = Config.chipNoiseLength;
                if (this._wave == null || this._wave.length != waveLength + 1) {
                    this._wave = new Float32Array(waveLength + 1);
                }
                const wave = this._wave;
                for (let i = 0; i < waveLength; i++) {
                    wave[i] = 0;
                }
                const highestOctave = 14;
                const falloffRatio = 0.25;
                const pitchTweak = [0, 1 / 7, Math.log(5 / 4) / Math.LN2, 3 / 7, Math.log(3 / 2) / Math.LN2, 5 / 7, 6 / 7];
                function controlPointToOctave(point) {
                    return lowestOctave + Math.floor(point / Config.spectrumControlPointsPerOctave) + pitchTweak[(point + Config.spectrumControlPointsPerOctave) % Config.spectrumControlPointsPerOctave];
                }
                let combinedAmplitude = 1;
                for (let i = 0; i < Config.spectrumControlPoints + 1; i++) {
                    const value1 = (i <= 0) ? 0 : this.spectrum[i - 1];
                    const value2 = (i >= Config.spectrumControlPoints) ? this.spectrum[Config.spectrumControlPoints - 1] : this.spectrum[i];
                    const octave1 = controlPointToOctave(i - 1);
                    let octave2 = controlPointToOctave(i);
                    if (i >= Config.spectrumControlPoints)
                        octave2 = highestOctave + (octave2 - highestOctave) * falloffRatio;
                    if (value1 == 0 && value2 == 0)
                        continue;
                    combinedAmplitude += 0.02 * drawNoiseSpectrum(wave, octave1, octave2, value1 / Config.spectrumMax, value2 / Config.spectrumMax, -0.5);
                }
                if (this.spectrum[Config.spectrumControlPoints - 1] > 0) {
                    combinedAmplitude += 0.02 * drawNoiseSpectrum(wave, highestOctave + (controlPointToOctave(Config.spectrumControlPoints) - highestOctave) * falloffRatio, highestOctave, this.spectrum[Config.spectrumControlPoints - 1] / Config.spectrumMax, 0, -0.5);
                }
                inverseRealFourierTransform(wave, waveLength);
                scaleElementsByFactor(wave, 5.0 / (Math.sqrt(waveLength) * Math.pow(combinedAmplitude, 0.75)));
                wave[waveLength] = wave[0];
                this._waveIsReady = true;
            }
            return this._wave;
        }
    }
    class HarmonicsWave {
        constructor() {
            this.harmonics = [];
            this._wave = null;
            this._waveIsReady = false;
            this.reset();
        }
        reset() {
            for (let i = 0; i < Config.harmonicsControlPoints; i++) {
                this.harmonics[i] = 0;
            }
            this.harmonics[0] = Config.harmonicsMax;
            this.harmonics[3] = Config.harmonicsMax;
            this.harmonics[6] = Config.harmonicsMax;
            this._waveIsReady = false;
        }
        markCustomWaveDirty() {
            this._waveIsReady = false;
        }
        getCustomWave() {
            if (!this._waveIsReady || this._wave == null) {
                let waveLength = Config.harmonicsWavelength;
                const retroWave = getDrumWave(0);
                if (this._wave == null || this._wave.length != waveLength + 1) {
                    this._wave = new Float32Array(waveLength + 1);
                }
                const wave = this._wave;
                for (let i = 0; i < waveLength; i++) {
                    wave[i] = 0;
                }
                const overallSlope = -0.25;
                let combinedControlPointAmplitude = 1;
                for (let harmonicIndex = 0; harmonicIndex < Config.harmonicsRendered; harmonicIndex++) {
                    const harmonicFreq = harmonicIndex + 1;
                    let controlValue = harmonicIndex < Config.harmonicsControlPoints ? this.harmonics[harmonicIndex] : this.harmonics[Config.harmonicsControlPoints - 1];
                    if (harmonicIndex >= Config.harmonicsControlPoints) {
                        controlValue *= 1 - (harmonicIndex - Config.harmonicsControlPoints) / (Config.harmonicsRendered - Config.harmonicsControlPoints);
                    }
                    const normalizedValue = controlValue / Config.harmonicsMax;
                    let amplitude = Math.pow(2, controlValue - Config.harmonicsMax + 1) * Math.sqrt(normalizedValue);
                    if (harmonicIndex < Config.harmonicsControlPoints) {
                        combinedControlPointAmplitude += amplitude;
                    }
                    amplitude *= Math.pow(harmonicFreq, overallSlope);
                    amplitude *= retroWave[harmonicIndex + 589];
                    wave[waveLength - harmonicFreq] = amplitude;
                }
                inverseRealFourierTransform(wave, waveLength);
                const mult = 1 / Math.pow(combinedControlPointAmplitude, 0.7);
                let cumulative = 0;
                let wavePrev = 0;
                for (let i = 0; i < wave.length; i++) {
                    cumulative += wavePrev;
                    wavePrev = wave[i] * mult;
                    wave[i] = cumulative;
                }
                wave[waveLength] = wave[0];
                this._waveIsReady = true;
            }
            return this._wave;
        }
    }
    class Instrument {
        constructor(isNoiseChannel, isModChannel) {
            this.type = 0;
            this.preset = 0;
            this.chipWave = 2;
            this.chipNoise = 1;
            this.filterCutoff = 12;
            this.filterResonance = 0;
            this.filterEnvelope = 1;
            this.transition = 1;
            this.vibrato = 0;
            this.vibratoDepth = 0;
            this.vibratoSpeed = 10;
            this.vibratoDelay = 0;
            this.vibratoType = 0;
            this.interval = 0;
            this.effects = 0;
            this.chord = 1;
            this.volume = 0;
            this.pan = Config.panCenter;
            this.panDelay = 10;
            this.arpeggioSpeed = 12;
            this.fastTwoNoteArp = false;
            this.tieNoteTransition = false;
            this.clicklessTransition = false;
            this.detune = 0;
            this.pulseWidth = Config.pulseWidthRange;
            this.pulseEnvelope = 1;
            this.algorithm = 0;
            this.feedbackType = 0;
            this.feedbackAmplitude = 0;
            this.feedbackEnvelope = 1;
            this.LFOtime = 0;
            this.nextLFOtime = 0;
            this.arpTime = 0;
            this.customChipWave = new Float64Array(64);
            this.customChipWaveIntegral = new Float64Array(65);
            this.operators = [];
            this.harmonicsWave = new HarmonicsWave();
            this.drumsetEnvelopes = [];
            this.drumsetSpectrumWaves = [];
            this.modChannels = [];
            this.modStatuses = [];
            this.modInstruments = [];
            this.modSettings = [];
            if (isModChannel) {
                for (let mod = 0; mod < Config.modCount; mod++) {
                    this.modChannels.push(0);
                    this.modStatuses.push(ModStatus.msNone);
                    this.modInstruments.push(0);
                    this.modSettings.push(ModSetting.mstNone);
                }
            }
            this.spectrumWave = new SpectrumWave(isNoiseChannel);
            for (let i = 0; i < Config.operatorCount; i++) {
                this.operators[i] = new Operator(i);
            }
            for (let i = 0; i < Config.drumCount; i++) {
                this.drumsetEnvelopes[i] = Config.envelopes.dictionary["twang 2"].index;
                this.drumsetSpectrumWaves[i] = new SpectrumWave(true);
            }
            for (let i = 0; i < 64; i++) {
                this.customChipWave[i] = 24 - Math.floor(i * (48 / 64));
            }
            let sum = 0.0;
            for (let i = 0; i < this.customChipWave.length; i++) {
                sum += this.customChipWave[i];
            }
            const average = sum / this.customChipWave.length;
            let cumulative = 0;
            let wavePrev = 0;
            for (let i = 0; i < this.customChipWave.length; i++) {
                cumulative += wavePrev;
                wavePrev = this.customChipWave[i] - average;
                this.customChipWaveIntegral[i] = cumulative;
            }
            this.customChipWaveIntegral[64] = 0.0;
        }
        setTypeAndReset(type, isNoiseChannel, isModChannel) {
            if (isModChannel)
                type = 8;
            this.type = type;
            this.preset = type;
            this.volume = 0;
            this.pan = Config.panCenter;
            this.panDelay = 10;
            this.arpeggioSpeed = 12;
            this.detune = 0;
            this.tieNoteTransition = false;
            this.clicklessTransition = false;
            switch (type) {
                case 0:
                    this.chipWave = 2;
                    this.filterCutoff = 6;
                    this.filterResonance = 0;
                    this.filterEnvelope = Config.envelopes.dictionary["steady"].index;
                    this.transition = 1;
                    this.vibrato = 0;
                    this.interval = 0;
                    this.effects = 1;
                    this.chord = 2;
                    break;
                case 7:
                    this.chipWave = 2;
                    this.filterCutoff = 6;
                    this.filterResonance = 0;
                    this.filterEnvelope = Config.envelopes.dictionary["steady"].index;
                    this.transition = 1;
                    this.vibrato = 0;
                    this.interval = 0;
                    this.effects = 1;
                    this.chord = 2;
                    for (let i = 0; i < 64; i++) {
                        this.customChipWave[i] = 24 - (Math.floor(i * (48 / 64)));
                    }
                    let sum = 0.0;
                    for (let i = 0; i < this.customChipWave.length; i++) {
                        sum += this.customChipWave[i];
                    }
                    const average = sum / this.customChipWave.length;
                    let cumulative = 0;
                    let wavePrev = 0;
                    for (let i = 0; i < this.customChipWave.length; i++) {
                        cumulative += wavePrev;
                        wavePrev = this.customChipWave[i] - average;
                        this.customChipWaveIntegral[i] = cumulative;
                    }
                    this.customChipWaveIntegral[64] = 0.0;
                    break;
                case 1:
                    this.transition = 1;
                    this.vibrato = 0;
                    this.effects = 1;
                    this.chord = 3;
                    this.filterCutoff = 10;
                    this.filterResonance = 0;
                    this.filterEnvelope = 1;
                    this.algorithm = 0;
                    this.feedbackType = 0;
                    this.feedbackAmplitude = 0;
                    this.feedbackEnvelope = Config.envelopes.dictionary["steady"].index;
                    for (let i = 0; i < this.operators.length; i++) {
                        this.operators[i].reset(i);
                    }
                    break;
                case 2:
                    this.chipNoise = 1;
                    this.transition = 1;
                    this.effects = 0;
                    this.chord = 2;
                    this.filterCutoff = 10;
                    this.filterResonance = 0;
                    this.filterEnvelope = Config.envelopes.dictionary["steady"].index;
                    break;
                case 3:
                    this.transition = 1;
                    this.effects = 1;
                    this.chord = 0;
                    this.filterCutoff = 10;
                    this.filterResonance = 0;
                    this.filterEnvelope = Config.envelopes.dictionary["steady"].index;
                    this.spectrumWave.reset(isNoiseChannel);
                    break;
                case 4:
                    this.effects = 0;
                    for (let i = 0; i < Config.drumCount; i++) {
                        this.drumsetEnvelopes[i] = Config.envelopes.dictionary["twang 2"].index;
                        if (this.drumsetSpectrumWaves[i] == undefined) {
                            this.drumsetSpectrumWaves[i] = new SpectrumWave(true);
                        }
                        this.drumsetSpectrumWaves[i].reset(isNoiseChannel);
                    }
                    break;
                case 5:
                    this.filterCutoff = 10;
                    this.filterResonance = 0;
                    this.filterEnvelope = Config.envelopes.dictionary["steady"].index;
                    this.transition = 1;
                    this.vibrato = 0;
                    this.interval = 0;
                    this.effects = 1;
                    this.chord = 0;
                    this.harmonicsWave.reset();
                    break;
                case 6:
                    this.filterCutoff = 10;
                    this.filterResonance = 0;
                    this.filterEnvelope = Config.envelopes.dictionary["steady"].index;
                    this.transition = 1;
                    this.vibrato = 0;
                    this.interval = 0;
                    this.effects = 1;
                    this.chord = 2;
                    this.pulseWidth = Config.pulseWidthRange;
                    this.pulseEnvelope = Config.envelopes.dictionary["twang 2"].index;
                    break;
                case 8:
                    this.transition = 0;
                    this.vibrato = 0;
                    this.interval = 0;
                    this.effects = 0;
                    this.chord = 0;
                    this.modChannels = [];
                    this.modStatuses = [];
                    this.modInstruments = [];
                    this.modSettings = [];
                    for (let mod = 0; mod < Config.modCount; mod++) {
                        this.modChannels.push(0);
                        this.modStatuses.push(ModStatus.msNone);
                        this.modInstruments.push(0);
                        this.modSettings.push(ModSetting.mstNone);
                    }
                    break;
                default:
                    throw new Error("Unrecognized instrument type: " + type);
            }
        }
        toJsonObject() {
            const instrumentObject = {
                "type": Config.instrumentTypeNames[this.type],
                "volume": this.volume,
                "pan": (this.pan - Config.panCenter) * 100 / Config.panCenter,
                "panDelay": this.panDelay,
                "arpeggioSpeed": this.arpeggioSpeed,
                "fastTwoNoteArp": this.fastTwoNoteArp,
                "tieNoteTransition": this.tieNoteTransition,
                "clicklessTransition": this.clicklessTransition,
                "vibrato": this.vibrato,
                "vibratoDepth": this.vibratoDepth,
                "vibratoDelay": this.vibratoDelay,
                "vibratoSpeed": this.vibratoSpeed,
                "vibratoType": this.vibratoType,
                "detune": this.detune,
                "effects": Config.effectsNames[this.effects],
            };
            if (this.preset != this.type) {
                instrumentObject["preset"] = this.preset;
            }
            if (this.type != 4) {
                instrumentObject["transition"] = Config.transitions[this.transition].name;
                instrumentObject["chord"] = this.getChord().name;
                instrumentObject["filterCutoffHz"] = Math.round(Config.filterCutoffMaxHz * Math.pow(2.0, this.getFilterCutoffOctaves()));
                instrumentObject["filterResonance"] = Math.round(100 * this.filterResonance / (Config.filterResonanceRange - 1));
                instrumentObject["filterEnvelope"] = this.getFilterEnvelope().name;
            }
            if (this.type == 2) {
                instrumentObject["wave"] = Config.chipNoises[this.chipNoise].name;
            }
            else if (this.type == 3) {
                instrumentObject["spectrum"] = [];
                for (let i = 0; i < Config.spectrumControlPoints; i++) {
                    instrumentObject["spectrum"][i] = Math.round(100 * this.spectrumWave.spectrum[i] / Config.spectrumMax);
                }
            }
            else if (this.type == 4) {
                instrumentObject["drums"] = [];
                for (let j = 0; j < Config.drumCount; j++) {
                    const spectrum = [];
                    for (let i = 0; i < Config.spectrumControlPoints; i++) {
                        spectrum[i] = Math.round(100 * this.drumsetSpectrumWaves[j].spectrum[i] / Config.spectrumMax);
                    }
                    instrumentObject["drums"][j] = {
                        "filterEnvelope": this.getDrumsetEnvelope(j).name,
                        "spectrum": spectrum,
                    };
                }
            }
            else if (this.type == 0) {
                instrumentObject["wave"] = Config.chipWaves[this.chipWave].name;
                instrumentObject["interval"] = Config.intervals[this.interval].name;
                if (this.vibrato != 5) {
                    instrumentObject["vibrato"] = Config.vibratos[this.vibrato].name;
                }
                else {
                    instrumentObject["vibrato"] = "custom";
                }
            }
            else if (this.type == 7) {
                instrumentObject["wave"] = Config.chipWaves[this.chipWave].name;
                instrumentObject["interval"] = Config.intervals[this.interval].name;
                if (this.vibrato != 5) {
                    instrumentObject["vibrato"] = Config.vibratos[this.vibrato].name;
                }
                else {
                    instrumentObject["vibrato"] = "custom";
                }
                instrumentObject["customChipWave"] = new Float64Array(64);
                instrumentObject["customChipWaveIntegral"] = new Float64Array(65);
                for (let i = 0; i < this.customChipWave.length; i++) {
                    instrumentObject["customChipWave"][i] = this.customChipWave[i];
                }
                instrumentObject["customChipWaveIntegral"][64] = 0;
            }
            else if (this.type == 6) {
                instrumentObject["pulseWidth"] = this.pulseWidth;
                instrumentObject["pulseEnvelope"] = Config.envelopes[this.pulseEnvelope].name;
                if (this.vibrato != 5) {
                    instrumentObject["vibrato"] = Config.vibratos[this.vibrato].name;
                }
                else {
                    instrumentObject["vibrato"] = "custom";
                }
            }
            else if (this.type == 5) {
                instrumentObject["interval"] = Config.intervals[this.interval].name;
                if (this.vibrato != 5) {
                    instrumentObject["vibrato"] = Config.vibratos[this.vibrato].name;
                }
                else {
                    instrumentObject["vibrato"] = "custom";
                }
                instrumentObject["harmonics"] = [];
                for (let i = 0; i < Config.harmonicsControlPoints; i++) {
                    instrumentObject["harmonics"][i] = Math.round(100 * this.harmonicsWave.harmonics[i] / Config.harmonicsMax);
                }
            }
            else if (this.type == 1) {
                const operatorArray = [];
                for (const operator of this.operators) {
                    operatorArray.push({
                        "frequency": Config.operatorFrequencies[operator.frequency].name,
                        "amplitude": operator.amplitude,
                        "envelope": Config.envelopes[operator.envelope].name,
                    });
                }
                if (this.vibrato != 5) {
                    instrumentObject["vibrato"] = Config.vibratos[this.vibrato].name;
                }
                else {
                    instrumentObject["vibrato"] = "custom";
                }
                instrumentObject["algorithm"] = Config.algorithms[this.algorithm].name;
                instrumentObject["feedbackType"] = Config.feedbacks[this.feedbackType].name;
                instrumentObject["feedbackAmplitude"] = this.feedbackAmplitude;
                instrumentObject["feedbackEnvelope"] = Config.envelopes[this.feedbackEnvelope].name;
                instrumentObject["operators"] = operatorArray;
            }
            else if (this.type == 8) {
                instrumentObject["modChannels"] = [];
                instrumentObject["modInstruments"] = [];
                instrumentObject["modSettings"] = [];
                instrumentObject["modStatuses"] = [];
                for (let mod = 0; mod < Config.modCount; mod++) {
                    instrumentObject["modChannels"][mod] = this.modChannels[mod];
                    instrumentObject["modInstruments"][mod] = this.modInstruments[mod];
                    instrumentObject["modSettings"][mod] = this.modSettings[mod];
                    instrumentObject["modStatuses"][mod] = this.modStatuses[mod];
                }
            }
            else {
                throw new Error("Unrecognized instrument type");
            }
            return instrumentObject;
        }
        fromJsonObject(instrumentObject, isNoiseChannel, isModChannel, useSlowerRhythm, useFastTwoNoteArp) {
            if (instrumentObject == undefined)
                instrumentObject = {};
            let type = Config.instrumentTypeNames.indexOf(instrumentObject["type"]);
            if (type == -1)
                type = isModChannel ? 8 : (isNoiseChannel ? 2 : 0);
            this.setTypeAndReset(type, isNoiseChannel, isModChannel);
            if (instrumentObject["preset"] != undefined) {
                this.preset = instrumentObject["preset"] >>> 0;
            }
            if (instrumentObject["volume"] != undefined) {
                this.volume = clamp(-Config.volumeRange / 2, Config.volumeRange / 2, instrumentObject["volume"] | 0);
            }
            else {
                this.volume = 0;
            }
            if (instrumentObject["pan"] != undefined) {
                this.pan = clamp(0, Config.panMax + 1, Math.round(Config.panCenter + (instrumentObject["pan"] | 0) * Config.panCenter / 100));
            }
            else {
                this.pan = Config.panCenter;
            }
            if (instrumentObject["panDelay"] != undefined) {
                this.panDelay = (instrumentObject["panDelay"] | 0);
            }
            else {
                this.panDelay = 10;
            }
            if (instrumentObject["detune"] != undefined) {
                this.detune = clamp(Config.detuneMin, Config.detuneMax + 1, (instrumentObject["detune"] | 0));
            }
            else {
                this.detune = 0;
            }
            const oldTransitionNames = { "binary": 0, "sudden": 1, "smooth": 2 };
            const transitionObject = instrumentObject["transition"] || instrumentObject["envelope"];
            this.transition = oldTransitionNames[transitionObject] != undefined ? oldTransitionNames[transitionObject] : Config.transitions.findIndex(transition => transition.name == transitionObject);
            if (this.transition == -1)
                this.transition = 1;
            this.effects = Config.effectsNames.indexOf(instrumentObject["effects"]);
            if (this.effects == -1)
                this.effects = (this.type == 2) ? 0 : 1;
            if (instrumentObject["filterCutoffHz"] != undefined) {
                this.filterCutoff = clamp(0, Config.filterCutoffRange, Math.round((Config.filterCutoffRange - 1) + 2.0 * Math.log((instrumentObject["filterCutoffHz"] | 0) / Config.filterCutoffMaxHz) / Math.LN2));
            }
            else {
                this.filterCutoff = (this.type == 0) ? 6 : 10;
            }
            if (instrumentObject["filterResonance"] != undefined) {
                this.filterResonance = clamp(0, Config.filterResonanceRange, Math.round((Config.filterResonanceRange - 1) * (instrumentObject["filterResonance"] | 0) / 100));
            }
            else {
                this.filterResonance = 0;
            }
            this.filterEnvelope = Config.envelopes.findIndex(envelope => envelope.name == instrumentObject["filterEnvelope"]);
            if (this.filterEnvelope == -1)
                this.filterEnvelope = Config.envelopes.dictionary["steady"].index;
            if (instrumentObject["filter"] != undefined) {
                const legacyToCutoff = [20, 12, 6, 0, 16, 10, 4];
                const legacyToEnvelope = [1, 1, 1, 1, 18, 19, 20];
                const filterNames = ["none", "bright", "medium", "soft", "decay bright", "decay medium", "decay soft"];
                const oldFilterNames = { "sustain sharp": 1, "sustain medium": 2, "sustain soft": 3, "decay sharp": 4 };
                let legacyFilter = oldFilterNames[instrumentObject["filter"]] != undefined ? oldFilterNames[instrumentObject["filter"]] : filterNames.indexOf(instrumentObject["filter"]);
                if (legacyFilter == -1)
                    legacyFilter = 0;
                this.filterCutoff = legacyToCutoff[legacyFilter];
                this.filterEnvelope = legacyToEnvelope[legacyFilter];
                this.filterResonance = 0;
            }
            const legacyEffectNames = ["none", "vibrato light", "vibrato delayed", "vibrato heavy"];
            if (this.type == 2) {
                this.chipNoise = Config.chipNoises.findIndex(wave => wave.name == instrumentObject["wave"]);
                if (this.chipNoise == -1)
                    this.chipNoise = 1;
                this.chord = Config.chords.findIndex(chord => chord.name == instrumentObject["chord"]);
                if (this.chord == -1)
                    this.chord = 2;
            }
            else if (this.type == 3) {
                if (instrumentObject["spectrum"] != undefined) {
                    for (let i = 0; i < Config.spectrumControlPoints; i++) {
                        this.spectrumWave.spectrum[i] = Math.max(0, Math.min(Config.spectrumMax, Math.round(Config.spectrumMax * (+instrumentObject["spectrum"][i]) / 100)));
                    }
                }
                this.chord = Config.chords.findIndex(chord => chord.name == instrumentObject["chord"]);
                if (this.chord == -1)
                    this.chord = 0;
            }
            else if (this.type == 4) {
                if (instrumentObject["drums"] != undefined) {
                    for (let j = 0; j < Config.drumCount; j++) {
                        const drum = instrumentObject["drums"][j];
                        if (drum == undefined)
                            continue;
                        if (drum["filterEnvelope"] != undefined) {
                            this.drumsetEnvelopes[j] = Config.envelopes.findIndex(envelope => envelope.name == drum["filterEnvelope"]);
                            if (this.drumsetEnvelopes[j] == -1)
                                this.drumsetEnvelopes[j] = Config.envelopes.dictionary["twang 2"].index;
                        }
                        if (drum["spectrum"] != undefined) {
                            for (let i = 0; i < Config.spectrumControlPoints; i++) {
                                this.drumsetSpectrumWaves[j].spectrum[i] = Math.max(0, Math.min(Config.spectrumMax, Math.round(Config.spectrumMax * (+drum["spectrum"][i]) / 100)));
                            }
                        }
                    }
                }
            }
            else if (this.type == 5) {
                if (instrumentObject["harmonics"] != undefined) {
                    for (let i = 0; i < Config.harmonicsControlPoints; i++) {
                        this.harmonicsWave.harmonics[i] = Math.max(0, Math.min(Config.harmonicsMax, Math.round(Config.harmonicsMax * (+instrumentObject["harmonics"][i]) / 100)));
                    }
                }
                if (instrumentObject["interval"] != undefined) {
                    this.interval = Config.intervals.findIndex(interval => interval.name == instrumentObject["interval"]);
                    if (this.interval == -1)
                        this.interval = 0;
                }
                if (instrumentObject["vibrato"] != undefined) {
                    this.vibrato = Config.vibratos.findIndex(vibrato => vibrato.name == instrumentObject["vibrato"]);
                    if (this.vibrato == -1)
                        this.vibrato = Config.vibratos.length;
                    if (this.vibrato == Config.vibratos.length) {
                        this.vibratoDepth = instrumentObject["vibratoDepth"];
                        this.vibratoSpeed = instrumentObject["vibratoSpeed"];
                        this.vibratoDelay = instrumentObject["vibratoDelay"];
                        this.vibratoType = instrumentObject["vibratoType"];
                    }
                    else {
                        this.vibratoDepth = Config.vibratos[this.vibrato].amplitude;
                        this.vibratoDelay = Config.vibratos[this.vibrato].delayParts;
                        this.vibratoSpeed = 10;
                        this.vibratoType = Config.vibratos[this.vibrato].type;
                    }
                }
                this.chord = Config.chords.findIndex(chord => chord.name == instrumentObject["chord"]);
                if (this.chord == -1)
                    this.chord = 0;
            }
            else if (this.type == 6) {
                if (instrumentObject["pulseWidth"] != undefined) {
                    this.pulseWidth = clamp(0, Config.pulseWidthRange + 1, Math.round(instrumentObject["pulseWidth"]));
                }
                else {
                    this.pulseWidth = Config.pulseWidthRange;
                }
                if (instrumentObject["pulseEnvelope"] != undefined) {
                    this.pulseEnvelope = Config.envelopes.findIndex(envelope => envelope.name == instrumentObject["pulseEnvelope"]);
                    if (this.pulseEnvelope == -1)
                        this.pulseEnvelope = Config.envelopes.dictionary["steady"].index;
                }
                if (instrumentObject["vibrato"] != undefined) {
                    this.vibrato = Config.vibratos.findIndex(vibrato => vibrato.name == instrumentObject["vibrato"]);
                    if (this.vibrato == -1)
                        this.vibrato = Config.vibratos.length;
                    if (this.vibrato == Config.vibratos.length) {
                        this.vibratoDepth = instrumentObject["vibratoDepth"];
                        this.vibratoSpeed = instrumentObject["vibratoSpeed"];
                        this.vibratoDelay = instrumentObject["vibratoDelay"];
                        this.vibratoType = instrumentObject["vibratoType"];
                    }
                    else {
                        this.vibratoDepth = Config.vibratos[this.vibrato].amplitude;
                        this.vibratoDelay = Config.vibratos[this.vibrato].delayParts;
                        this.vibratoSpeed = 10;
                        this.vibratoType = Config.vibratos[this.vibrato].type;
                    }
                }
                this.chord = Config.chords.findIndex(chord => chord.name == instrumentObject["chord"]);
                if (this.chord == -1)
                    this.chord = 0;
            }
            else if (this.type == 0) {
                const legacyWaveNames = { "triangle": 1, "square": 2, "pulse wide": 3, "pulse narrow": 4, "sawtooth": 5, "double saw": 6, "double pulse": 7, "spiky": 8, "plateau": 0 };
                this.chipWave = legacyWaveNames[instrumentObject["wave"]] != undefined ? legacyWaveNames[instrumentObject["wave"]] : Config.chipWaves.findIndex(wave => wave.name == instrumentObject["wave"]);
                if (this.chipWave == -1)
                    this.chipWave = 1;
                if (instrumentObject["interval"] != undefined) {
                    this.interval = Config.intervals.findIndex(interval => interval.name == instrumentObject["interval"]);
                    if (this.interval == -1)
                        this.interval = 0;
                }
                else if (instrumentObject["chorus"] != undefined) {
                    const legacyChorusNames = { "fifths": 5, "octaves": 6 };
                    this.interval = legacyChorusNames[instrumentObject["chorus"]] != undefined ? legacyChorusNames[instrumentObject["chorus"]] : Config.intervals.findIndex(interval => interval.name == instrumentObject["chorus"]);
                    if (this.interval == -1)
                        this.interval = 0;
                }
                if (instrumentObject["vibrato"] != undefined) {
                    this.vibrato = Config.vibratos.findIndex(vibrato => vibrato.name == instrumentObject["vibrato"]);
                    if (this.vibrato == -1)
                        this.vibrato = Config.vibratos.length;
                    if (this.vibrato == Config.vibratos.length) {
                        this.vibratoDepth = instrumentObject["vibratoDepth"];
                        this.vibratoSpeed = instrumentObject["vibratoSpeed"];
                        this.vibratoDelay = instrumentObject["vibratoDelay"];
                        this.vibratoType = instrumentObject["vibratoType"];
                    }
                    else {
                        this.vibratoDepth = Config.vibratos[this.vibrato].amplitude;
                        this.vibratoDelay = Config.vibratos[this.vibrato].delayParts;
                        this.vibratoSpeed = 10;
                        this.vibratoType = Config.vibratos[this.vibrato].type;
                    }
                }
                else if (instrumentObject["effect"] != undefined) {
                    this.vibrato = legacyEffectNames.indexOf(instrumentObject["effect"]);
                    if (this.vibrato == -1)
                        this.vibrato = 0;
                }
                this.chord = Config.chords.findIndex(chord => chord.name == instrumentObject["chord"]);
                if (this.chord == -1)
                    this.chord = 2;
                if (instrumentObject["chorus"] == "custom harmony") {
                    this.interval = 2;
                    this.chord = 3;
                }
            }
            else if (this.type == 1) {
                if (instrumentObject["vibrato"] != undefined) {
                    this.vibrato = Config.vibratos.findIndex(vibrato => vibrato.name == instrumentObject["vibrato"]);
                    if (this.vibrato == -1)
                        this.vibrato = Config.vibratos.length;
                    if (this.vibrato == Config.vibratos.length) {
                        this.vibratoDepth = instrumentObject["vibratoDepth"];
                        this.vibratoSpeed = instrumentObject["vibratoSpeed"];
                        this.vibratoDelay = instrumentObject["vibratoDelay"];
                        this.vibratoType = instrumentObject["vibratoType"];
                    }
                    else {
                        this.vibratoDepth = Config.vibratos[this.vibrato].amplitude;
                        this.vibratoDelay = Config.vibratos[this.vibrato].delayParts;
                        this.vibratoSpeed = 10;
                        this.vibratoType = Config.vibratos[this.vibrato].type;
                    }
                }
                else if (instrumentObject["effect"] != undefined) {
                    this.vibrato = legacyEffectNames.indexOf(instrumentObject["effect"]);
                    if (this.vibrato == -1)
                        this.vibrato = 0;
                }
                this.chord = Config.chords.findIndex(chord => chord.name == instrumentObject["chord"]);
                if (this.chord == -1)
                    this.chord = 3;
                this.algorithm = Config.algorithms.findIndex(algorithm => algorithm.name == instrumentObject["algorithm"]);
                if (this.algorithm == -1)
                    this.algorithm = 0;
                this.feedbackType = Config.feedbacks.findIndex(feedback => feedback.name == instrumentObject["feedbackType"]);
                if (this.feedbackType == -1)
                    this.feedbackType = 0;
                if (instrumentObject["feedbackAmplitude"] != undefined) {
                    this.feedbackAmplitude = clamp(0, Config.operatorAmplitudeMax + 1, instrumentObject["feedbackAmplitude"] | 0);
                }
                else {
                    this.feedbackAmplitude = 0;
                }
                const legacyEnvelopeNames = { "pluck 1": 6, "pluck 2": 7, "pluck 3": 8 };
                this.feedbackEnvelope = legacyEnvelopeNames[instrumentObject["feedbackEnvelope"]] != undefined ? legacyEnvelopeNames[instrumentObject["feedbackEnvelope"]] : Config.envelopes.findIndex(envelope => envelope.name == instrumentObject["feedbackEnvelope"]);
                if (this.feedbackEnvelope == -1)
                    this.feedbackEnvelope = 0;
                for (let j = 0; j < Config.operatorCount; j++) {
                    const operator = this.operators[j];
                    let operatorObject = undefined;
                    if (instrumentObject["operators"])
                        operatorObject = instrumentObject["operators"][j];
                    if (operatorObject == undefined)
                        operatorObject = {};
                    operator.frequency = Config.operatorFrequencies.findIndex(freq => freq.name == operatorObject["frequency"]);
                    if (operator.frequency == -1)
                        operator.frequency = 0;
                    if (operatorObject["amplitude"] != undefined) {
                        operator.amplitude = clamp(0, Config.operatorAmplitudeMax + 1, operatorObject["amplitude"] | 0);
                    }
                    else {
                        operator.amplitude = 0;
                    }
                    operator.envelope = legacyEnvelopeNames[operatorObject["envelope"]] != undefined ? legacyEnvelopeNames[operatorObject["envelope"]] : Config.envelopes.findIndex(envelope => envelope.name == operatorObject["envelope"]);
                    if (operator.envelope == -1)
                        operator.envelope = 0;
                }
            }
            else if (this.type == 7) {
                if (instrumentObject["interval"] != undefined) {
                    this.interval = Config.intervals.findIndex(interval => interval.name == instrumentObject["interval"]);
                    if (this.interval == -1)
                        this.interval = 0;
                }
                else if (instrumentObject["chorus"] != undefined) {
                    const legacyChorusNames = { "fifths": 5, "octaves": 6 };
                    this.interval = legacyChorusNames[instrumentObject["chorus"]] != undefined ? legacyChorusNames[instrumentObject["chorus"]] : Config.intervals.findIndex(interval => interval.name == instrumentObject["chorus"]);
                    if (this.interval == -1)
                        this.interval = 0;
                }
                if (instrumentObject["vibrato"] != undefined) {
                    this.vibrato = Config.vibratos.findIndex(vibrato => vibrato.name == instrumentObject["vibrato"]);
                    if (this.vibrato == -1)
                        this.vibrato = Config.vibratos.length;
                    if (this.vibrato == Config.vibratos.length) {
                        this.vibratoDepth = instrumentObject["vibratoDepth"];
                        this.vibratoSpeed = instrumentObject["vibratoSpeed"];
                        this.vibratoDelay = instrumentObject["vibratoDelay"];
                        this.vibratoType = instrumentObject["vibratoType"];
                    }
                    else {
                        this.vibratoDepth = Config.vibratos[this.vibrato].amplitude;
                        this.vibratoDelay = Config.vibratos[this.vibrato].delayParts;
                        this.vibratoSpeed = 10;
                        this.vibratoType = Config.vibratos[this.vibrato].type;
                    }
                }
                else if (instrumentObject["effect"] != undefined) {
                    this.vibrato = legacyEffectNames.indexOf(instrumentObject["effect"]);
                    if (this.vibrato == -1)
                        this.vibrato = 0;
                }
                this.chord = Config.chords.findIndex(chord => chord.name == instrumentObject["chord"]);
                if (this.chord == -1)
                    this.chord = 2;
                if (instrumentObject["chorus"] == "custom harmony") {
                    this.interval = 2;
                    this.chord = 3;
                }
                if (instrumentObject["customChipWave"]) {
                    for (let i = 0; i < 64; i++) {
                        this.customChipWave[i] = instrumentObject["customChipWave"][i];
                    }
                    let sum = 0.0;
                    for (let i = 0; i < this.customChipWave.length; i++) {
                        sum += this.customChipWave[i];
                    }
                    const average = sum / this.customChipWave.length;
                    let cumulative = 0;
                    let wavePrev = 0;
                    for (let i = 0; i < this.customChipWave.length; i++) {
                        cumulative += wavePrev;
                        wavePrev = this.customChipWave[i] - average;
                        this.customChipWaveIntegral[i] = cumulative;
                    }
                    this.customChipWaveIntegral[64] = 0.0;
                }
            }
            else if (this.type == 8) {
                if (instrumentObject["modChannels"] != undefined) {
                    for (let mod = 0; mod < Config.modCount; mod++) {
                        this.modChannels[mod] = instrumentObject["modChannels"][mod];
                        this.modInstruments[mod] = instrumentObject["modInstruments"][mod];
                        this.modSettings[mod] = instrumentObject["modSettings"][mod];
                        this.modStatuses[mod] = instrumentObject["modStatuses"][mod];
                    }
                }
            }
            else {
                throw new Error("Unrecognized instrument type.");
            }
            if (this.type != 8) {
                if (this.chord == 2 && instrumentObject["arpeggioSpeed"] != undefined) {
                    this.arpeggioSpeed = instrumentObject["arpeggioSpeed"];
                }
                else {
                    this.arpeggioSpeed = (useSlowerRhythm) ? 9 : 12;
                }
                if (instrumentObject["fastTwoNoteArp"] != undefined) {
                    this.fastTwoNoteArp = instrumentObject["fastTwoNoteArp"];
                }
                else {
                    this.fastTwoNoteArp = useFastTwoNoteArp;
                }
                if (instrumentObject["tieNoteTransition"] != undefined) {
                    this.tieNoteTransition = instrumentObject["tieNoteTransition"];
                }
                else {
                    this.tieNoteTransition = false;
                }
                if (instrumentObject["clicklessTransition"] != undefined) {
                    this.clicklessTransition = instrumentObject["clicklessTransition"];
                }
                else {
                    this.clicklessTransition = false;
                }
            }
        }
        static frequencyFromPitch(pitch) {
            return 440.0 * Math.pow(2.0, (pitch - 69.0) / 12.0);
        }
        static drumsetIndexReferenceDelta(index) {
            return Instrument.frequencyFromPitch(Config.spectrumBasePitch + index * 6) / 44100;
        }
        static _drumsetIndexToSpectrumOctave(index) {
            return 15 + Math.log(Instrument.drumsetIndexReferenceDelta(index)) / Math.LN2;
        }
        warmUp() {
            this.LFOtime = 0;
            this.nextLFOtime = 0;
            this.arpTime = 0;
            if (this.type == 2) {
                getDrumWave(this.chipNoise, inverseRealFourierTransform, scaleElementsByFactor);
            }
            else if (this.type == 5) {
                this.harmonicsWave.getCustomWave();
            }
            else if (this.type == 3) {
                this.spectrumWave.getCustomWave(8);
            }
            else if (this.type == 4) {
                for (let i = 0; i < Config.drumCount; i++) {
                    this.drumsetSpectrumWaves[i].getCustomWave(Instrument._drumsetIndexToSpectrumOctave(i));
                }
            }
        }
        getDrumWave() {
            if (this.type == 2) {
                return getDrumWave(this.chipNoise, inverseRealFourierTransform, scaleElementsByFactor);
            }
            else if (this.type == 3) {
                return this.spectrumWave.getCustomWave(8);
            }
            else {
                throw new Error("Unhandled instrument type in getDrumWave");
            }
        }
        getDrumsetWave(pitch) {
            if (this.type == 4) {
                return this.drumsetSpectrumWaves[pitch].getCustomWave(Instrument._drumsetIndexToSpectrumOctave(pitch));
            }
            else {
                throw new Error("Unhandled instrument type in getDrumWave");
            }
        }
        getTransition() {
            return this.type == 4 ? Config.transitions.dictionary["hard fade"] :
                this.type == 8 ? Config.transitions.dictionary["seamless"] : Config.transitions[this.transition];
        }
        getChord() {
            return this.type == 4 ? Config.chords.dictionary["harmony"] : Config.chords[this.chord];
        }
        getFilterCutoffOctaves() {
            return this.type == 4 ? 0 : (this.filterCutoff - (Config.filterCutoffRange - 1)) * 0.5;
        }
        getFilterIsFirstOrder() {
            return this.type == 4 ? false : this.filterResonance == 0;
        }
        getFilterResonance() {
            return this.type == 4 ? 1 : this.filterResonance;
        }
        getFilterEnvelope() {
            if (this.type == 4)
                throw new Error("Can't getFilterEnvelope() for drumset.");
            return Config.envelopes[this.filterEnvelope];
        }
        getDrumsetEnvelope(pitch) {
            if (this.type != 4)
                throw new Error("Can't getDrumsetEnvelope() for non-drumset.");
            return Config.envelopes[this.drumsetEnvelopes[pitch]];
        }
    }
    var ModStatus;
    (function (ModStatus) {
        ModStatus[ModStatus["msForPitch"] = 0] = "msForPitch";
        ModStatus[ModStatus["msForNoise"] = 1] = "msForNoise";
        ModStatus[ModStatus["msForSong"] = 2] = "msForSong";
        ModStatus[ModStatus["msNone"] = 3] = "msNone";
    })(ModStatus || (ModStatus = {}));
    var ModSetting;
    (function (ModSetting) {
        ModSetting[ModSetting["mstNone"] = 0] = "mstNone";
        ModSetting[ModSetting["mstSongVolume"] = 1] = "mstSongVolume";
        ModSetting[ModSetting["mstTempo"] = 2] = "mstTempo";
        ModSetting[ModSetting["mstReverb"] = 3] = "mstReverb";
        ModSetting[ModSetting["mstNextBar"] = 4] = "mstNextBar";
        ModSetting[ModSetting["mstInsVolume"] = 5] = "mstInsVolume";
        ModSetting[ModSetting["mstPan"] = 6] = "mstPan";
        ModSetting[ModSetting["mstFilterCut"] = 7] = "mstFilterCut";
        ModSetting[ModSetting["mstFilterPeak"] = 8] = "mstFilterPeak";
        ModSetting[ModSetting["mstFMSlider1"] = 9] = "mstFMSlider1";
        ModSetting[ModSetting["mstFMSlider2"] = 10] = "mstFMSlider2";
        ModSetting[ModSetting["mstFMSlider3"] = 11] = "mstFMSlider3";
        ModSetting[ModSetting["mstFMSlider4"] = 12] = "mstFMSlider4";
        ModSetting[ModSetting["mstFMFeedback"] = 13] = "mstFMFeedback";
        ModSetting[ModSetting["mstPulseWidth"] = 14] = "mstPulseWidth";
        ModSetting[ModSetting["mstDetune"] = 15] = "mstDetune";
        ModSetting[ModSetting["mstVibratoDepth"] = 16] = "mstVibratoDepth";
        ModSetting[ModSetting["mstSongDetune"] = 17] = "mstSongDetune";
        ModSetting[ModSetting["mstVibratoSpeed"] = 18] = "mstVibratoSpeed";
        ModSetting[ModSetting["mstVibratoDelay"] = 19] = "mstVibratoDelay";
        ModSetting[ModSetting["mstArpeggioSpeed"] = 20] = "mstArpeggioSpeed";
        ModSetting[ModSetting["mstPanDelay"] = 21] = "mstPanDelay";
        ModSetting[ModSetting["mstResetArpeggio"] = 22] = "mstResetArpeggio";
        ModSetting[ModSetting["mstMaxValue"] = 23] = "mstMaxValue";
    })(ModSetting || (ModSetting = {}));
    class Channel {
        constructor() {
            this.octave = 0;
            this.instruments = [];
            this.patterns = [];
            this.bars = [];
            this.muted = false;
            this.name = "";
        }
    }
    class Song {
        constructor(string) {
            this.channels = [];
            this.limitDecay = 4.0;
            this.limitRise = 4000.0;
            this.compressionThreshold = 1.0;
            this.limitThreshold = 1.0;
            this.compressionRatio = 1.0;
            this.limitRatio = 1.0;
            this.masterGain = 1.0;
            this.inVolumeCap = 0.0;
            this.outVolumeCap = 0.0;
            this.mstMaxVols = new Map([
                [ModSetting.mstNone, 6],
                [ModSetting.mstSongVolume, 100],
                [ModSetting.mstTempo, Config.tempoMax - Config.tempoMin],
                [ModSetting.mstReverb, Config.reverbRange - 1],
                [ModSetting.mstNextBar, 1],
                [ModSetting.mstInsVolume, Config.volumeRange],
                [ModSetting.mstPan, Config.panMax],
                [ModSetting.mstFilterCut, Config.filterCutoffRange - 1],
                [ModSetting.mstFilterPeak, Config.filterResonanceRange - 1],
                [ModSetting.mstFMSlider1, 15],
                [ModSetting.mstFMSlider2, 15],
                [ModSetting.mstFMSlider3, 15],
                [ModSetting.mstFMSlider4, 15],
                [ModSetting.mstFMFeedback, 15],
                [ModSetting.mstPulseWidth, Config.pulseWidthRange],
                [ModSetting.mstDetune, Config.detuneMax - Config.detuneMin],
                [ModSetting.mstVibratoDepth, 50],
                [ModSetting.mstSongDetune, Config.songDetuneMax - Config.songDetuneMin],
                [ModSetting.mstVibratoSpeed, 30],
                [ModSetting.mstVibratoDelay, 50],
                [ModSetting.mstArpeggioSpeed, 50],
                [ModSetting.mstPanDelay, 20],
                [ModSetting.mstResetArpeggio, 1],
                [ModSetting.mstMaxValue, 6],
            ]);
            this.mstNewNoteVols = new Map([
                [ModSetting.mstNone, 6],
                [ModSetting.mstSongVolume, 100],
                [ModSetting.mstTempo, Math.ceil((Config.tempoMax - Config.tempoMin) / 2)],
                [ModSetting.mstReverb, 0],
                [ModSetting.mstNextBar, 1],
                [ModSetting.mstInsVolume, Math.ceil(Config.volumeRange / 2)],
                [ModSetting.mstPan, Math.ceil(Config.panMax / 2)],
                [ModSetting.mstFilterCut, Config.filterCutoffRange - 1],
                [ModSetting.mstFilterPeak, 0],
                [ModSetting.mstFMSlider1, 15],
                [ModSetting.mstFMSlider2, 15],
                [ModSetting.mstFMSlider3, 15],
                [ModSetting.mstFMSlider4, 15],
                [ModSetting.mstFMFeedback, 15],
                [ModSetting.mstPulseWidth, Math.ceil(Config.pulseWidthRange)],
                [ModSetting.mstDetune, Math.ceil((Config.detuneMax - Config.detuneMin) / 2)],
                [ModSetting.mstVibratoDepth, 0],
                [ModSetting.mstSongDetune, Math.ceil((Config.songDetuneMax - Config.songDetuneMin) / 2)],
                [ModSetting.mstVibratoSpeed, 0],
                [ModSetting.mstVibratoDelay, 0],
                [ModSetting.mstArpeggioSpeed, 10],
                [ModSetting.mstPanDelay, 10],
                [ModSetting.mstResetArpeggio, 1],
                [ModSetting.mstMaxValue, 6],
            ]);
            this.getNewNoteVolume = (isMod, modChannel, modInstrument, modCount) => {
                if (!isMod || modChannel == undefined || modInstrument == undefined || modCount == undefined)
                    return 6;
                else {
                    modCount = Config.modCount - modCount - 1;
                    let cap = this.mstNewNoteVols.get(this.channels[modChannel].instruments[modInstrument].modSettings[modCount]);
                    if (this.channels[modChannel].instruments[modInstrument].modSettings[modCount] == ModSetting.mstTempo) {
                        cap = this.realToModValue(this.tempo, ModSetting.mstTempo);
                    }
                    if (cap != undefined)
                        return cap;
                    else
                        return 6;
                }
            };
            this.getVolumeCap = (isMod, modChannel, modInstrument, modCount) => {
                if (!isMod || modChannel == undefined || modInstrument == undefined || modCount == undefined)
                    return 6;
                else {
                    modCount = Config.modCount - modCount - 1;
                    let cap = this.mstMaxVols.get(this.channels[modChannel].instruments[modInstrument].modSettings[modCount]);
                    if (cap != undefined)
                        return cap;
                    else
                        return 6;
                }
            };
            this.getVolumeCapForSetting = (isMod, modSetting) => {
                if (!isMod)
                    return 6;
                else {
                    let cap = this.mstMaxVols.get(modSetting);
                    if (cap != undefined)
                        return cap;
                    else
                        return 6;
                }
            };
            if (string != undefined) {
                this.fromBase64String(string);
            }
            else {
                this.initToDefault(true);
            }
        }
        modValueToReal(value, setting) {
            switch (setting) {
                case ModSetting.mstTempo:
                    value += Config.tempoMin;
                    break;
                case ModSetting.mstInsVolume:
                    value -= Config.volumeRange / 2.0;
                    break;
                case ModSetting.mstDetune:
                    value += Config.detuneMin;
                    break;
                case ModSetting.mstSongDetune:
                    value += Config.songDetuneMin;
                    break;
                case ModSetting.mstFilterCut:
                case ModSetting.mstFilterPeak:
                case ModSetting.mstSongVolume:
                case ModSetting.mstPan:
                case ModSetting.mstReverb:
                case ModSetting.mstNextBar:
                case ModSetting.mstFMSlider1:
                case ModSetting.mstFMSlider2:
                case ModSetting.mstFMSlider3:
                case ModSetting.mstFMSlider4:
                case ModSetting.mstFMFeedback:
                case ModSetting.mstPulseWidth:
                case ModSetting.mstVibratoDepth:
                case ModSetting.mstVibratoSpeed:
                case ModSetting.mstVibratoDelay:
                case ModSetting.mstArpeggioSpeed:
                case ModSetting.mstPanDelay:
                case ModSetting.mstResetArpeggio:
                case ModSetting.mstNone:
            }
            return value;
        }
        isSettingForSong(setting) {
            switch (setting) {
                case ModSetting.mstTempo:
                case ModSetting.mstReverb:
                case ModSetting.mstSongVolume:
                case ModSetting.mstNextBar:
                    return true;
                default:
                    return false;
            }
        }
        realToModValue(value, setting) {
            switch (setting) {
                case ModSetting.mstTempo:
                    value -= Config.tempoMin;
                    break;
                case ModSetting.mstInsVolume:
                    value += Config.volumeRange / 2.0;
                    break;
                case ModSetting.mstDetune:
                    value -= Config.detuneMin;
                    break;
                case ModSetting.mstSongDetune:
                    value -= Config.songDetuneMin;
                    break;
                case ModSetting.mstFilterCut:
                case ModSetting.mstFilterPeak:
                case ModSetting.mstSongVolume:
                case ModSetting.mstPan:
                case ModSetting.mstReverb:
                case ModSetting.mstNextBar:
                case ModSetting.mstFMSlider1:
                case ModSetting.mstFMSlider2:
                case ModSetting.mstFMSlider3:
                case ModSetting.mstFMSlider4:
                case ModSetting.mstFMFeedback:
                case ModSetting.mstPulseWidth:
                case ModSetting.mstVibratoDepth:
                case ModSetting.mstVibratoSpeed:
                case ModSetting.mstVibratoDelay:
                case ModSetting.mstArpeggioSpeed:
                case ModSetting.mstPanDelay:
                case ModSetting.mstResetArpeggio:
                case ModSetting.mstNone:
            }
            return value;
        }
        getChannelCount() {
            return this.pitchChannelCount + this.noiseChannelCount + this.modChannelCount;
        }
        getChannelIsNoise(channel) {
            return (channel >= this.pitchChannelCount && channel < this.pitchChannelCount + this.noiseChannelCount);
        }
        getChannelIsMod(channel) {
            return (channel >= this.pitchChannelCount + this.noiseChannelCount);
        }
        initToDefault(andResetChannels = true) {
            this.scale = 0;
            this.key = 0;
            this.loopStart = 0;
            this.loopLength = 4;
            this.tempo = 150;
            this.reverb = 0;
            this.beatsPerBar = 8;
            this.barCount = 16;
            this.patternsPerChannel = 8;
            this.rhythm = 1;
            this.instrumentsPerChannel = 1;
            this.title = "Unnamed";
            document.title = EditorConfig.versionDisplayName;
            if (andResetChannels) {
                this.pitchChannelCount = 3;
                this.noiseChannelCount = 1;
                this.modChannelCount = 0;
                for (let channelIndex = 0; channelIndex < this.getChannelCount(); channelIndex++) {
                    if (this.channels.length <= channelIndex) {
                        this.channels[channelIndex] = new Channel();
                    }
                    const channel = this.channels[channelIndex];
                    channel.octave = Math.max(3 - channelIndex, 0);
                    for (let pattern = 0; pattern < this.patternsPerChannel; pattern++) {
                        if (channel.patterns.length <= pattern) {
                            channel.patterns[pattern] = new Pattern();
                        }
                        else {
                            channel.patterns[pattern].reset();
                        }
                    }
                    channel.patterns.length = this.patternsPerChannel;
                    const isNoiseChannel = channelIndex >= this.pitchChannelCount && channelIndex < this.pitchChannelCount + this.noiseChannelCount;
                    const isModChannel = channelIndex >= this.pitchChannelCount + this.noiseChannelCount;
                    for (let instrument = 0; instrument < this.instrumentsPerChannel; instrument++) {
                        if (channel.instruments.length <= instrument) {
                            channel.instruments[instrument] = new Instrument(isNoiseChannel, isModChannel);
                        }
                        channel.instruments[instrument].setTypeAndReset(isModChannel ? 8 : (isNoiseChannel ? 2 : 0), isNoiseChannel, isModChannel);
                    }
                    channel.instruments.length = this.instrumentsPerChannel;
                    for (let bar = 0; bar < this.barCount; bar++) {
                        channel.bars[bar] = bar < 4 ? 1 : 0;
                    }
                    channel.bars.length = this.barCount;
                }
                this.channels.length = this.getChannelCount();
            }
        }
        toBase64String() {
            let bits;
            let buffer = [];
            buffer.push(Song._variant);
            buffer.push(base64IntToCharCode[Song._latestJummBoxVersion]);
            buffer.push(78);
            var encodedSongTitle = encodeURIComponent(this.title);
            buffer.push(base64IntToCharCode[encodedSongTitle.length >> 6], base64IntToCharCode[encodedSongTitle.length & 0x3f]);
            for (let i = 0; i < encodedSongTitle.length; i++) {
                buffer.push(encodedSongTitle.charCodeAt(i));
            }
            buffer.push(110, base64IntToCharCode[this.pitchChannelCount], base64IntToCharCode[this.noiseChannelCount], base64IntToCharCode[this.modChannelCount]);
            buffer.push(115, base64IntToCharCode[this.scale]);
            buffer.push(107, base64IntToCharCode[this.key]);
            buffer.push(108, base64IntToCharCode[this.loopStart >> 6], base64IntToCharCode[this.loopStart & 0x3f]);
            buffer.push(101, base64IntToCharCode[(this.loopLength - 1) >> 6], base64IntToCharCode[(this.loopLength - 1) & 0x3f]);
            buffer.push(116, base64IntToCharCode[this.tempo >> 6], base64IntToCharCode[this.tempo & 0x3F]);
            buffer.push(109, base64IntToCharCode[this.reverb]);
            buffer.push(97, base64IntToCharCode[this.beatsPerBar - 1]);
            buffer.push(103, base64IntToCharCode[(this.barCount - 1) >> 6], base64IntToCharCode[(this.barCount - 1) & 0x3f]);
            buffer.push(106, base64IntToCharCode[(this.patternsPerChannel - 1) >> 6], base64IntToCharCode[(this.patternsPerChannel - 1) & 0x3f]);
            buffer.push(105, base64IntToCharCode[this.instrumentsPerChannel - 1]);
            buffer.push(114, base64IntToCharCode[this.rhythm]);
            buffer.push(79);
            if (this.compressionRatio != 1.0 || this.limitRatio != 1.0 || this.limitRise != 4000.0 || this.limitDecay != 4.0 || this.limitThreshold != 1.0 || this.compressionThreshold != 1.0 || this.masterGain != 1.0) {
                buffer.push(base64IntToCharCode[Math.round(this.compressionRatio < 1 ? this.compressionRatio * 10 : 10 + (this.compressionRatio - 1) * 60)]);
                buffer.push(base64IntToCharCode[Math.round(this.limitRatio < 1 ? this.limitRatio * 10 : 9 + this.limitRatio)]);
                buffer.push(base64IntToCharCode[this.limitDecay]);
                buffer.push(base64IntToCharCode[Math.round((this.limitRise - 2000.0) / 250.0)]);
                buffer.push(base64IntToCharCode[Math.round(this.compressionThreshold * 20)]);
                buffer.push(base64IntToCharCode[Math.round(this.limitThreshold * 20)]);
                buffer.push(base64IntToCharCode[Math.round(this.masterGain * 50) >> 6], base64IntToCharCode[Math.round(this.masterGain * 50) & 0x3f]);
            }
            else {
                buffer.push(base64IntToCharCode[0x3f]);
            }
            buffer.push(85);
            for (let channel = 0; channel < this.getChannelCount(); channel++) {
                var encodedChannelName = encodeURIComponent(this.channels[channel].name);
                buffer.push(base64IntToCharCode[encodedChannelName.length >> 6], base64IntToCharCode[encodedChannelName.length & 0x3f]);
                for (let i = 0; i < encodedChannelName.length; i++) {
                    buffer.push(encodedChannelName.charCodeAt(i));
                }
            }
            buffer.push(111);
            for (let channel = 0; channel < this.getChannelCount(); channel++) {
                buffer.push(base64IntToCharCode[this.channels[channel].octave]);
            }
            for (let channel = 0; channel < this.getChannelCount(); channel++) {
                for (let i = 0; i < this.instrumentsPerChannel; i++) {
                    const instrument = this.channels[channel].instruments[i];
                    buffer.push(84, base64IntToCharCode[instrument.type]);
                    buffer.push(118, base64IntToCharCode[(instrument.volume + Config.volumeRange / 2) >> 6], base64IntToCharCode[(instrument.volume + Config.volumeRange / 2) & 0x3f]);
                    buffer.push(76, base64IntToCharCode[instrument.pan >> 6], base64IntToCharCode[instrument.pan & 0x3f]);
                    buffer.push(base64IntToCharCode[instrument.panDelay]);
                    buffer.push(68, base64IntToCharCode[(instrument.detune - Config.detuneMin) >> 6], base64IntToCharCode[(instrument.detune - Config.detuneMin) & 0x3f]);
                    buffer.push(117, base64IntToCharCode[instrument.preset >> 6], base64IntToCharCode[instrument.preset & 63]);
                    buffer.push(113, base64IntToCharCode[instrument.effects]);
                    if (instrument.type != 4) {
                        buffer.push(100, base64IntToCharCode[instrument.transition]);
                        buffer.push(base64IntToCharCode[+instrument.tieNoteTransition]);
                        buffer.push(base64IntToCharCode[+instrument.clicklessTransition]);
                        buffer.push(102, base64IntToCharCode[instrument.filterCutoff]);
                        buffer.push(121, base64IntToCharCode[instrument.filterResonance]);
                        buffer.push(122, base64IntToCharCode[instrument.filterEnvelope]);
                        buffer.push(67, base64IntToCharCode[instrument.chord]);
                    }
                    if (instrument.type == 0) {
                        buffer.push(119, base64IntToCharCode[instrument.chipWave]);
                        buffer.push(99, base64IntToCharCode[instrument.vibrato]);
                        if (instrument.vibrato == Config.vibratos.length) {
                            buffer.push(base64IntToCharCode[Math.round(instrument.vibratoDepth * 25)]);
                            buffer.push(base64IntToCharCode[instrument.vibratoSpeed]);
                            buffer.push(base64IntToCharCode[instrument.vibratoDelay]);
                            buffer.push(base64IntToCharCode[instrument.vibratoType]);
                        }
                        if (instrument.chord == 2) {
                            buffer.push(71, base64IntToCharCode[instrument.arpeggioSpeed]);
                            buffer.push(base64IntToCharCode[+instrument.fastTwoNoteArp]);
                        }
                        buffer.push(104, base64IntToCharCode[instrument.interval]);
                    }
                    else if (instrument.type == 1) {
                        buffer.push(99, base64IntToCharCode[instrument.vibrato]);
                        if (instrument.vibrato == Config.vibratos.length) {
                            buffer.push(base64IntToCharCode[Math.round(instrument.vibratoDepth * 25)]);
                            buffer.push(base64IntToCharCode[instrument.vibratoSpeed]);
                            buffer.push(base64IntToCharCode[instrument.vibratoDelay]);
                            buffer.push(base64IntToCharCode[instrument.vibratoType]);
                        }
                        if (instrument.chord == 2) {
                            buffer.push(71, base64IntToCharCode[instrument.arpeggioSpeed]);
                            buffer.push(base64IntToCharCode[+instrument.fastTwoNoteArp]);
                        }
                        buffer.push(104, base64IntToCharCode[instrument.interval]);
                        buffer.push(65, base64IntToCharCode[instrument.algorithm]);
                        buffer.push(70, base64IntToCharCode[instrument.feedbackType]);
                        buffer.push(66, base64IntToCharCode[instrument.feedbackAmplitude]);
                        buffer.push(86, base64IntToCharCode[instrument.feedbackEnvelope]);
                        buffer.push(81);
                        for (let o = 0; o < Config.operatorCount; o++) {
                            buffer.push(base64IntToCharCode[instrument.operators[o].frequency]);
                        }
                        buffer.push(80);
                        for (let o = 0; o < Config.operatorCount; o++) {
                            buffer.push(base64IntToCharCode[instrument.operators[o].amplitude]);
                        }
                        buffer.push(69);
                        for (let o = 0; o < Config.operatorCount; o++) {
                            buffer.push(base64IntToCharCode[instrument.operators[o].envelope]);
                        }
                    }
                    else if (instrument.type == 7) {
                        buffer.push(119, base64IntToCharCode[instrument.chipWave]);
                        buffer.push(99, base64IntToCharCode[instrument.vibrato]);
                        if (instrument.vibrato == Config.vibratos.length) {
                            buffer.push(base64IntToCharCode[Math.round(instrument.vibratoDepth * 25)]);
                            buffer.push(base64IntToCharCode[instrument.vibratoSpeed]);
                            buffer.push(base64IntToCharCode[instrument.vibratoDelay]);
                            buffer.push(base64IntToCharCode[instrument.vibratoType]);
                        }
                        if (instrument.chord == 2) {
                            buffer.push(71, base64IntToCharCode[instrument.arpeggioSpeed]);
                            buffer.push(base64IntToCharCode[+instrument.fastTwoNoteArp]);
                        }
                        buffer.push(104, base64IntToCharCode[instrument.interval]);
                        buffer.push(77);
                        for (let j = 0; j < 64; j++) {
                            buffer.push(base64IntToCharCode[(instrument.customChipWave[j] + 24)]);
                        }
                    }
                    else if (instrument.type == 2) {
                        buffer.push(119, base64IntToCharCode[instrument.chipNoise]);
                        if (instrument.chord == 2) {
                            buffer.push(71, base64IntToCharCode[instrument.arpeggioSpeed]);
                            buffer.push(base64IntToCharCode[+instrument.fastTwoNoteArp]);
                        }
                        buffer.push(104, base64IntToCharCode[instrument.interval]);
                    }
                    else if (instrument.type == 3) {
                        buffer.push(83);
                        const spectrumBits = new BitFieldWriter();
                        for (let i = 0; i < Config.spectrumControlPoints; i++) {
                            spectrumBits.write(Config.spectrumControlPointBits, instrument.spectrumWave.spectrum[i]);
                        }
                        spectrumBits.encodeBase64(buffer);
                        buffer.push(99, base64IntToCharCode[instrument.vibrato]);
                        if (instrument.vibrato == Config.vibratos.length) {
                            buffer.push(base64IntToCharCode[Math.round(instrument.vibratoDepth * 25)]);
                            buffer.push(base64IntToCharCode[instrument.vibratoSpeed]);
                            buffer.push(base64IntToCharCode[instrument.vibratoDelay]);
                            buffer.push(base64IntToCharCode[instrument.vibratoType]);
                        }
                        if (instrument.chord == 2) {
                            buffer.push(71, base64IntToCharCode[instrument.arpeggioSpeed]);
                            buffer.push(base64IntToCharCode[+instrument.fastTwoNoteArp]);
                        }
                        buffer.push(104, base64IntToCharCode[instrument.interval]);
                    }
                    else if (instrument.type == 4) {
                        buffer.push(122);
                        for (let j = 0; j < Config.drumCount; j++) {
                            buffer.push(base64IntToCharCode[instrument.drumsetEnvelopes[j]]);
                        }
                        buffer.push(83);
                        const spectrumBits = new BitFieldWriter();
                        for (let j = 0; j < Config.drumCount; j++) {
                            for (let i = 0; i < Config.spectrumControlPoints; i++) {
                                spectrumBits.write(Config.spectrumControlPointBits, instrument.drumsetSpectrumWaves[j].spectrum[i]);
                            }
                        }
                        spectrumBits.encodeBase64(buffer);
                    }
                    else if (instrument.type == 5) {
                        buffer.push(99, base64IntToCharCode[instrument.vibrato]);
                        if (instrument.vibrato == Config.vibratos.length) {
                            buffer.push(base64IntToCharCode[Math.round(instrument.vibratoDepth * 25)]);
                            buffer.push(base64IntToCharCode[instrument.vibratoSpeed]);
                            buffer.push(base64IntToCharCode[instrument.vibratoDelay]);
                            buffer.push(base64IntToCharCode[instrument.vibratoType]);
                        }
                        if (instrument.chord == 2) {
                            buffer.push(71, base64IntToCharCode[instrument.arpeggioSpeed]);
                            buffer.push(base64IntToCharCode[+instrument.fastTwoNoteArp]);
                        }
                        buffer.push(104, base64IntToCharCode[instrument.interval]);
                        buffer.push(72);
                        const harmonicsBits = new BitFieldWriter();
                        for (let i = 0; i < Config.harmonicsControlPoints; i++) {
                            harmonicsBits.write(Config.harmonicsControlPointBits, instrument.harmonicsWave.harmonics[i]);
                        }
                        harmonicsBits.encodeBase64(buffer);
                    }
                    else if (instrument.type == 6) {
                        buffer.push(99, base64IntToCharCode[instrument.vibrato]);
                        if (instrument.vibrato == Config.vibratos.length) {
                            buffer.push(base64IntToCharCode[Math.round(instrument.vibratoDepth * 25)]);
                            buffer.push(base64IntToCharCode[instrument.vibratoSpeed]);
                            buffer.push(base64IntToCharCode[instrument.vibratoDelay]);
                            buffer.push(base64IntToCharCode[instrument.vibratoType]);
                        }
                        if (instrument.chord == 2) {
                            buffer.push(71, base64IntToCharCode[instrument.arpeggioSpeed]);
                            buffer.push(base64IntToCharCode[+instrument.fastTwoNoteArp]);
                        }
                        buffer.push(87, base64IntToCharCode[instrument.pulseWidth], base64IntToCharCode[instrument.pulseEnvelope]);
                        buffer.push(104, base64IntToCharCode[instrument.interval]);
                    }
                    else if (instrument.type == 8) ;
                    else {
                        throw new Error("Unknown instrument type.");
                    }
                }
            }
            buffer.push(98);
            bits = new BitFieldWriter();
            let neededBits = 0;
            while ((1 << neededBits) < this.patternsPerChannel + 1)
                neededBits++;
            for (let channel = 0; channel < this.getChannelCount(); channel++)
                for (let i = 0; i < this.barCount; i++) {
                    bits.write(neededBits, this.channels[channel].bars[i]);
                }
            bits.encodeBase64(buffer);
            buffer.push(112);
            bits = new BitFieldWriter();
            const shapeBits = new BitFieldWriter();
            let neededInstrumentBits = 0;
            while ((1 << neededInstrumentBits) < this.instrumentsPerChannel)
                neededInstrumentBits++;
            for (let channel = 0; channel < this.getChannelCount(); channel++) {
                const isNoiseChannel = this.getChannelIsNoise(channel);
                const isModChannel = this.getChannelIsMod(channel);
                if (isModChannel) {
                    for (let instrumentIndex = 0; instrumentIndex < this.instrumentsPerChannel; instrumentIndex++) {
                        let instrument = this.channels[channel].instruments[instrumentIndex];
                        for (let mod = 0; mod < Config.modCount; mod++) {
                            const modStatus = instrument.modStatuses[mod];
                            const modChannel = instrument.modChannels[mod];
                            const modInstrument = instrument.modInstruments[mod];
                            const modSetting = instrument.modSettings[mod];
                            bits.write(2, modStatus);
                            if (modStatus == ModStatus.msForPitch || modStatus == ModStatus.msForNoise) {
                                bits.write(8, modChannel);
                                bits.write(neededInstrumentBits, modInstrument);
                            }
                            if (modStatus != ModStatus.msNone) {
                                bits.write(6, modSetting);
                            }
                        }
                    }
                }
                const octaveOffset = (isNoiseChannel || isModChannel) ? 0 : this.channels[channel].octave * 12;
                let lastPitch = ((isNoiseChannel || isModChannel) ? 4 : 12) + octaveOffset;
                const recentPitches = isModChannel ? [0, 1, 2, 3, 4, 5] : (isNoiseChannel ? [4, 6, 7, 2, 3, 8, 0, 10] : [12, 19, 24, 31, 36, 7, 0]);
                const recentShapes = [];
                for (let i = 0; i < recentPitches.length; i++) {
                    recentPitches[i] += octaveOffset;
                }
                for (const pattern of this.channels[channel].patterns) {
                    bits.write(neededInstrumentBits, pattern.instrument);
                    if (pattern.notes.length > 0) {
                        bits.write(1, 1);
                        let curPart = 0;
                        for (const note of pattern.notes) {
                            if (note.start < curPart && isModChannel) {
                                bits.write(2, 0);
                                bits.write(1, 1);
                                bits.writePartDuration(curPart - note.start);
                            }
                            if (note.start > curPart) {
                                bits.write(2, 0);
                                if (isModChannel)
                                    bits.write(1, 0);
                                bits.writePartDuration(note.start - curPart);
                            }
                            shapeBits.clear();
                            if (note.pitches.length == 1) {
                                shapeBits.write(1, 0);
                            }
                            else {
                                shapeBits.write(1, 1);
                                shapeBits.write(3, note.pitches.length - 2);
                            }
                            shapeBits.writePinCount(note.pins.length - 1);
                            if (!isModChannel) {
                                shapeBits.write(3, note.pins[0].volume);
                            }
                            else {
                                shapeBits.write(9, note.pins[0].volume);
                            }
                            let shapePart = 0;
                            let startPitch = note.pitches[0];
                            let currentPitch = startPitch;
                            const pitchBends = [];
                            for (let i = 1; i < note.pins.length; i++) {
                                const pin = note.pins[i];
                                const nextPitch = startPitch + pin.interval;
                                if (currentPitch != nextPitch) {
                                    shapeBits.write(1, 1);
                                    pitchBends.push(nextPitch);
                                    currentPitch = nextPitch;
                                }
                                else {
                                    shapeBits.write(1, 0);
                                }
                                shapeBits.writePartDuration(pin.time - shapePart);
                                shapePart = pin.time;
                                if (!isModChannel) {
                                    shapeBits.write(3, pin.volume);
                                }
                                else {
                                    shapeBits.write(9, pin.volume);
                                }
                            }
                            const shapeString = String.fromCharCode.apply(null, shapeBits.encodeBase64([]));
                            const shapeIndex = recentShapes.indexOf(shapeString);
                            if (shapeIndex == -1) {
                                bits.write(2, 1);
                                bits.concat(shapeBits);
                            }
                            else {
                                bits.write(1, 1);
                                bits.writeLongTail(0, 0, shapeIndex);
                                recentShapes.splice(shapeIndex, 1);
                            }
                            recentShapes.unshift(shapeString);
                            if (recentShapes.length > 10)
                                recentShapes.pop();
                            const allPitches = note.pitches.concat(pitchBends);
                            for (let i = 0; i < allPitches.length; i++) {
                                const pitch = allPitches[i];
                                const pitchIndex = recentPitches.indexOf(pitch);
                                if (pitchIndex == -1) {
                                    let interval = 0;
                                    let pitchIter = lastPitch;
                                    if (pitchIter < pitch) {
                                        while (pitchIter != pitch) {
                                            pitchIter++;
                                            if (recentPitches.indexOf(pitchIter) == -1)
                                                interval++;
                                        }
                                    }
                                    else {
                                        while (pitchIter != pitch) {
                                            pitchIter--;
                                            if (recentPitches.indexOf(pitchIter) == -1)
                                                interval--;
                                        }
                                    }
                                    bits.write(1, 0);
                                    bits.writePitchInterval(interval);
                                }
                                else {
                                    bits.write(1, 1);
                                    bits.write(4, pitchIndex);
                                    recentPitches.splice(pitchIndex, 1);
                                }
                                recentPitches.unshift(pitch);
                                if (recentPitches.length > 16)
                                    recentPitches.pop();
                                if (i == note.pitches.length - 1) {
                                    lastPitch = note.pitches[0];
                                }
                                else {
                                    lastPitch = pitch;
                                }
                            }
                            curPart = note.end;
                        }
                        if (curPart < this.beatsPerBar * Config.partsPerBeat + (+isModChannel)) {
                            bits.write(2, 0);
                            if (isModChannel)
                                bits.write(1, 0);
                            bits.writePartDuration(this.beatsPerBar * Config.partsPerBeat + (+isModChannel) - curPart);
                        }
                    }
                    else {
                        bits.write(1, 0);
                    }
                }
            }
            let stringLength = bits.lengthBase64();
            let digits = [];
            while (stringLength > 0) {
                digits.unshift(base64IntToCharCode[stringLength & 0x3f]);
                stringLength = stringLength >> 6;
            }
            buffer.push(base64IntToCharCode[digits.length]);
            Array.prototype.push.apply(buffer, digits);
            bits.encodeBase64(buffer);
            const maxApplyArgs = 64000;
            if (buffer.length < maxApplyArgs) {
                return String.fromCharCode.apply(null, buffer);
            }
            else {
                let result = "";
                for (let i = 0; i < buffer.length; i += maxApplyArgs) {
                    result += String.fromCharCode.apply(null, buffer.slice(i, i + maxApplyArgs));
                }
                return result;
            }
        }
        fromBase64String(compressed) {
            if (compressed == null || compressed == "") {
                this.initToDefault(true);
                return;
            }
            let charIndex = 0;
            while (compressed.charCodeAt(charIndex) <= 32)
                charIndex++;
            if (compressed.charCodeAt(charIndex) == 35)
                charIndex++;
            if (compressed.charCodeAt(charIndex) == 123) {
                this.fromJsonObject(JSON.parse(charIndex == 0 ? compressed : compressed.substring(charIndex)));
                return;
            }
            const variantTest = compressed.charCodeAt(charIndex);
            var variant = "beepbox";
            if (variantTest == 0x6A) {
                variant = "jummbox";
                charIndex++;
            }
            const version = base64CharCodeToInt[compressed.charCodeAt(charIndex++)];
            if (variant == "beepbox" && (version == -1 || version > Song._latestBeepboxVersion || version < Song._oldestBeepboxVersion))
                return;
            if (variant == "jummbox" && (version == -1 || version > Song._latestJummBoxVersion || version < Song._oldestJummBoxVersion))
                return;
            const beforeTwo = version < 2;
            const beforeThree = version < 3;
            const beforeFour = version < 4;
            const beforeFive = version < 5;
            const beforeSix = version < 6;
            const beforeSeven = version < 7;
            const beforeEight = version < 8;
            this.initToDefault(variant == "beepbox" && beforeSix);
            if (beforeThree && variant == "beepbox") {
                for (const channel of this.channels)
                    channel.instruments[0].transition = 0;
                this.channels[3].instruments[0].chipNoise = 0;
            }
            let instrumentChannelIterator = 0;
            let instrumentIndexIterator = -1;
            let toSetOctaves = [];
            let command;
            let channel;
            let useSlowerArpSpeed = false;
            let useFastTwoNoteArp = false;
            while (charIndex < compressed.length)
                switch (command = compressed.charCodeAt(charIndex++)) {
                    case 78:
                        {
                            var songNameLength = (base64CharCodeToInt[compressed.charCodeAt(charIndex++)] << 6) + base64CharCodeToInt[compressed.charCodeAt(charIndex++)];
                            this.title = decodeURIComponent(compressed.substring(charIndex, charIndex + songNameLength));
                            document.title = this.title + " - " + EditorConfig.versionDisplayName;
                            charIndex += songNameLength;
                        }
                        break;
                    case 110:
                        {
                            this.pitchChannelCount = base64CharCodeToInt[compressed.charCodeAt(charIndex++)];
                            this.noiseChannelCount = base64CharCodeToInt[compressed.charCodeAt(charIndex++)];
                            if (variant == "beepbox" || beforeTwo) {
                                this.modChannelCount = 0;
                            }
                            else {
                                this.modChannelCount = base64CharCodeToInt[compressed.charCodeAt(charIndex++)];
                            }
                            this.pitchChannelCount = validateRange(Config.pitchChannelCountMin, Config.pitchChannelCountMax, this.pitchChannelCount);
                            this.noiseChannelCount = validateRange(Config.noiseChannelCountMin, Config.noiseChannelCountMax, this.noiseChannelCount);
                            this.modChannelCount = validateRange(Config.modChannelCountMin, Config.modChannelCountMax, this.modChannelCount);
                            for (let channelIndex = this.channels.length; channelIndex < this.getChannelCount(); channelIndex++) {
                                this.channels[channelIndex] = new Channel();
                            }
                            this.channels.length = this.getChannelCount();
                        }
                        break;
                    case 115:
                        {
                            this.scale = base64CharCodeToInt[compressed.charCodeAt(charIndex++)];
                            if (variant == "beepbox")
                                this.scale = 0;
                        }
                        break;
                    case 107:
                        {
                            if (beforeSeven && variant == "beepbox") {
                                this.key = clamp(0, Config.keys.length, 11 - base64CharCodeToInt[compressed.charCodeAt(charIndex++)]);
                            }
                            else {
                                this.key = clamp(0, Config.keys.length, base64CharCodeToInt[compressed.charCodeAt(charIndex++)]);
                            }
                        }
                        break;
                    case 108:
                        {
                            if (beforeFive && variant == "beepbox") {
                                this.loopStart = base64CharCodeToInt[compressed.charCodeAt(charIndex++)];
                            }
                            else {
                                this.loopStart = (base64CharCodeToInt[compressed.charCodeAt(charIndex++)] << 6) + base64CharCodeToInt[compressed.charCodeAt(charIndex++)];
                            }
                        }
                        break;
                    case 101:
                        {
                            if (beforeFive && variant == "beepbox") {
                                this.loopLength = base64CharCodeToInt[compressed.charCodeAt(charIndex++)];
                            }
                            else {
                                this.loopLength = (base64CharCodeToInt[compressed.charCodeAt(charIndex++)] << 6) + base64CharCodeToInt[compressed.charCodeAt(charIndex++)] + 1;
                            }
                        }
                        break;
                    case 116:
                        {
                            if (beforeFour && variant == "beepbox") {
                                this.tempo = [95, 120, 151, 190][base64CharCodeToInt[compressed.charCodeAt(charIndex++)]];
                            }
                            else if (beforeSeven && variant == "beepbox") {
                                this.tempo = [88, 95, 103, 111, 120, 130, 140, 151, 163, 176, 190, 206, 222, 240, 259][base64CharCodeToInt[compressed.charCodeAt(charIndex++)]];
                            }
                            else {
                                this.tempo = (base64CharCodeToInt[compressed.charCodeAt(charIndex++)] << 6) | (base64CharCodeToInt[compressed.charCodeAt(charIndex++)]);
                            }
                            this.tempo = clamp(Config.tempoMin, Config.tempoMax + 1, this.tempo);
                        }
                        break;
                    case 109:
                        {
                            if (variant == "beepbox") {
                                this.reverb = base64CharCodeToInt[compressed.charCodeAt(charIndex++)] * 8;
                                this.reverb = clamp(0, Config.reverbRange, this.reverb);
                            }
                            else {
                                this.reverb = base64CharCodeToInt[compressed.charCodeAt(charIndex++)];
                                this.reverb = clamp(0, Config.reverbRange, this.reverb);
                            }
                        }
                        break;
                    case 97:
                        {
                            if (beforeThree && variant == "beepbox") {
                                this.beatsPerBar = [6, 7, 8, 9, 10][base64CharCodeToInt[compressed.charCodeAt(charIndex++)]];
                            }
                            else {
                                this.beatsPerBar = base64CharCodeToInt[compressed.charCodeAt(charIndex++)] + 1;
                            }
                            this.beatsPerBar = Math.max(Config.beatsPerBarMin, Math.min(Config.beatsPerBarMax, this.beatsPerBar));
                        }
                        break;
                    case 103:
                        {
                            const barCount = (base64CharCodeToInt[compressed.charCodeAt(charIndex++)] << 6) + base64CharCodeToInt[compressed.charCodeAt(charIndex++)] + 1;
                            this.barCount = validateRange(Config.barCountMin, Config.barCountMax, barCount);
                            for (let channel = 0; channel < this.getChannelCount(); channel++) {
                                for (let bar = this.channels[channel].bars.length; bar < this.barCount; bar++) {
                                    this.channels[channel].bars[bar] = (bar < 4) ? 1 : 0;
                                }
                                this.channels[channel].bars.length = this.barCount;
                            }
                        }
                        break;
                    case 106:
                        {
                            if (variant == "beepbox" && beforeEight) {
                                this.patternsPerChannel = base64CharCodeToInt[compressed.charCodeAt(charIndex++)] + 1;
                            }
                            else {
                                this.patternsPerChannel = (base64CharCodeToInt[compressed.charCodeAt(charIndex++)] << 6) + base64CharCodeToInt[compressed.charCodeAt(charIndex++)] + 1;
                            }
                            this.patternsPerChannel = validateRange(1, Config.barCountMax, this.patternsPerChannel);
                            for (let channel = 0; channel < this.getChannelCount(); channel++) {
                                for (let pattern = this.channels[channel].patterns.length; pattern < this.patternsPerChannel; pattern++) {
                                    this.channels[channel].patterns[pattern] = new Pattern();
                                }
                                this.channels[channel].patterns.length = this.patternsPerChannel;
                            }
                        }
                        break;
                    case 105:
                        {
                            const instrumentsPerChannel = base64CharCodeToInt[compressed.charCodeAt(charIndex++)] + 1;
                            this.instrumentsPerChannel = validateRange(Config.instrumentsPerChannelMin, Config.instrumentsPerChannelMax, instrumentsPerChannel);
                            for (let channel = 0; channel < this.getChannelCount(); channel++) {
                                const isNoiseChannel = channel >= this.pitchChannelCount && channel < this.pitchChannelCount + this.noiseChannelCount;
                                const isModChannel = channel >= this.pitchChannelCount + this.noiseChannelCount;
                                for (let instrumentIndex = this.channels[channel].instruments.length; instrumentIndex < this.instrumentsPerChannel; instrumentIndex++) {
                                    this.channels[channel].instruments[instrumentIndex] = new Instrument(isNoiseChannel, isModChannel);
                                }
                                this.channels[channel].instruments.length = this.instrumentsPerChannel;
                                if (beforeSix && variant == "beepbox") {
                                    for (let instrumentIndex = 0; instrumentIndex < this.instrumentsPerChannel; instrumentIndex++) {
                                        this.channels[channel].instruments[instrumentIndex].setTypeAndReset(isNoiseChannel ? 2 : 0, isNoiseChannel, isModChannel);
                                    }
                                }
                            }
                        }
                        break;
                    case 114:
                        {
                            this.rhythm = base64CharCodeToInt[compressed.charCodeAt(charIndex++)];
                            if (variant == "jummbox" && beforeThree || variant == "beepbox") {
                                if (this.rhythm == 0 || this.rhythm == 2) {
                                    useSlowerArpSpeed = true;
                                }
                                if (this.rhythm >= 2) {
                                    useFastTwoNoteArp = true;
                                }
                            }
                        }
                        break;
                    case 111:
                        {
                            if (beforeThree && variant == "beepbox") {
                                channel = base64CharCodeToInt[compressed.charCodeAt(charIndex++)];
                                this.channels[channel].octave = clamp(0, Config.maxScrollableOctaves + 1, base64CharCodeToInt[compressed.charCodeAt(charIndex++)]);
                                toSetOctaves[channel] = clamp(0, Config.maxScrollableOctaves - (+(window.localStorage.getItem("extraOctaves") || "0")) + 1, this.channels[channel].octave);
                            }
                            else {
                                for (channel = 0; channel < this.getChannelCount(); channel++) {
                                    this.channels[channel].octave = clamp(0, Config.maxScrollableOctaves + 1, base64CharCodeToInt[compressed.charCodeAt(charIndex++)]);
                                    toSetOctaves[channel] = clamp(0, Config.maxScrollableOctaves - (+(window.localStorage.getItem("extraOctaves") || "0")) + 1, this.channels[channel].octave);
                                }
                            }
                        }
                        break;
                    case 84:
                        {
                            instrumentIndexIterator++;
                            if (instrumentIndexIterator >= this.instrumentsPerChannel) {
                                instrumentChannelIterator++;
                                instrumentIndexIterator = 0;
                            }
                            validateRange(0, this.channels.length - 1, instrumentChannelIterator);
                            const instrument = this.channels[instrumentChannelIterator].instruments[instrumentIndexIterator];
                            const instrumentType = clamp(0, 9, base64CharCodeToInt[compressed.charCodeAt(charIndex++)]);
                            instrument.setTypeAndReset(instrumentType, instrumentChannelIterator >= this.pitchChannelCount && instrumentChannelIterator < this.pitchChannelCount + this.noiseChannelCount, instrumentChannelIterator >= this.pitchChannelCount + this.noiseChannelCount);
                            if (useSlowerArpSpeed) {
                                instrument.arpeggioSpeed = 9;
                            }
                            if (useFastTwoNoteArp) {
                                instrument.fastTwoNoteArp = true;
                            }
                        }
                        break;
                    case 117:
                        {
                            const presetValue = (base64CharCodeToInt[compressed.charCodeAt(charIndex++)] << 6) | (base64CharCodeToInt[compressed.charCodeAt(charIndex++)]);
                            this.channels[instrumentChannelIterator].instruments[instrumentIndexIterator].preset = presetValue;
                        }
                        break;
                    case 119:
                        {
                            if (beforeThree && variant == "beepbox") {
                                const legacyWaves = [1, 2, 3, 4, 5, 6, 7, 8, 0];
                                const channel = base64CharCodeToInt[compressed.charCodeAt(charIndex++)];
                                this.channels[channel].instruments[0].chipWave = clamp(0, Config.chipWaves.length, legacyWaves[base64CharCodeToInt[compressed.charCodeAt(charIndex++)]] | 0);
                            }
                            else if (beforeSix && variant == "beepbox") {
                                const legacyWaves = [1, 2, 3, 4, 5, 6, 7, 8, 0];
                                for (let channel = 0; channel < this.getChannelCount(); channel++) {
                                    for (let i = 0; i < this.instrumentsPerChannel; i++) {
                                        if (channel >= this.pitchChannelCount) {
                                            this.channels[channel].instruments[i].chipNoise = clamp(0, Config.chipNoises.length, base64CharCodeToInt[compressed.charCodeAt(charIndex++)]);
                                        }
                                        else {
                                            this.channels[channel].instruments[i].chipWave = clamp(0, Config.chipWaves.length, legacyWaves[base64CharCodeToInt[compressed.charCodeAt(charIndex++)]] | 0);
                                        }
                                    }
                                }
                            }
                            else if (beforeSeven && variant == "beepbox") {
                                const legacyWaves = [1, 2, 3, 4, 5, 6, 7, 8, 0];
                                if (instrumentChannelIterator >= this.pitchChannelCount) {
                                    this.channels[instrumentChannelIterator].instruments[instrumentIndexIterator].chipNoise = clamp(0, Config.chipNoises.length, base64CharCodeToInt[compressed.charCodeAt(charIndex++)]);
                                }
                                else {
                                    this.channels[instrumentChannelIterator].instruments[instrumentIndexIterator].chipWave = clamp(0, Config.chipWaves.length, legacyWaves[base64CharCodeToInt[compressed.charCodeAt(charIndex++)]] | 0);
                                }
                            }
                            else {
                                if (instrumentChannelIterator >= this.pitchChannelCount) {
                                    this.channels[instrumentChannelIterator].instruments[instrumentIndexIterator].chipNoise = clamp(0, Config.chipNoises.length, base64CharCodeToInt[compressed.charCodeAt(charIndex++)]);
                                }
                                else {
                                    this.channels[instrumentChannelIterator].instruments[instrumentIndexIterator].chipWave = clamp(0, Config.chipWaves.length, base64CharCodeToInt[compressed.charCodeAt(charIndex++)]);
                                }
                            }
                        }
                        break;
                    case 102:
                        {
                            if (beforeSeven && variant == "beepbox") {
                                const legacyToCutoff = [10, 6, 3, 0, 8, 5, 2];
                                const legacyToEnvelope = [1, 1, 1, 1, 18, 19, 20];
                                const filterNames = ["none", "bright", "medium", "soft", "decay bright", "decay medium", "decay soft"];
                                if (beforeThree && variant == "beepbox") {
                                    channel = base64CharCodeToInt[compressed.charCodeAt(charIndex++)];
                                    const instrument = this.channels[channel].instruments[0];
                                    const legacyFilter = [1, 3, 4, 5][clamp(0, filterNames.length, base64CharCodeToInt[compressed.charCodeAt(charIndex++)])];
                                    instrument.filterCutoff = legacyToCutoff[legacyFilter];
                                    instrument.filterEnvelope = legacyToEnvelope[legacyFilter];
                                    instrument.filterResonance = 0;
                                }
                                else if (beforeSix && variant == "beepbox") {
                                    for (channel = 0; channel < this.getChannelCount(); channel++) {
                                        for (let i = 0; i < this.instrumentsPerChannel; i++) {
                                            const instrument = this.channels[channel].instruments[i];
                                            const legacyFilter = clamp(0, filterNames.length, base64CharCodeToInt[compressed.charCodeAt(charIndex++)] + 1);
                                            if (channel < this.pitchChannelCount) {
                                                instrument.filterCutoff = legacyToCutoff[legacyFilter];
                                                instrument.filterEnvelope = legacyToEnvelope[legacyFilter];
                                                instrument.filterResonance = 0;
                                            }
                                            else {
                                                instrument.filterCutoff = 10;
                                                instrument.filterEnvelope = 1;
                                                instrument.filterResonance = 0;
                                            }
                                        }
                                    }
                                }
                                else {
                                    const legacyFilter = clamp(0, filterNames.length, base64CharCodeToInt[compressed.charCodeAt(charIndex++)]);
                                    const instrument = this.channels[instrumentChannelIterator].instruments[instrumentIndexIterator];
                                    instrument.filterCutoff = legacyToCutoff[legacyFilter];
                                    instrument.filterEnvelope = legacyToEnvelope[legacyFilter];
                                    instrument.filterResonance = 0;
                                }
                            }
                            else {
                                const instrument = this.channels[instrumentChannelIterator].instruments[instrumentIndexIterator];
                                instrument.filterCutoff = clamp(0, Config.filterCutoffRange, base64CharCodeToInt[compressed.charCodeAt(charIndex++)]);
                            }
                        }
                        break;
                    case 121:
                        {
                            this.channels[instrumentChannelIterator].instruments[instrumentIndexIterator].filterResonance = clamp(0, Config.filterResonanceRange, base64CharCodeToInt[compressed.charCodeAt(charIndex++)]);
                        }
                        break;
                    case 122:
                        {
                            const instrument = this.channels[instrumentChannelIterator].instruments[instrumentIndexIterator];
                            if (instrument.type == 4) {
                                for (let i = 0; i < Config.drumCount; i++) {
                                    instrument.drumsetEnvelopes[i] = clamp(0, Config.envelopes.length, base64CharCodeToInt[compressed.charCodeAt(charIndex++)]);
                                }
                            }
                            else {
                                instrument.filterEnvelope = clamp(0, Config.envelopes.length, base64CharCodeToInt[compressed.charCodeAt(charIndex++)]);
                            }
                        }
                        break;
                    case 87:
                        {
                            if (variant == "beepbox") {
                                const instrument = this.channels[instrumentChannelIterator].instruments[instrumentIndexIterator];
                                instrument.pulseWidth = Math.round(clamp(0, Config.pulseWidthRange + 1, Math.pow(0.5, (7 - base64CharCodeToInt[compressed.charCodeAt(charIndex++)]) * 0.5) * 50));
                                instrument.pulseEnvelope = clamp(0, Config.envelopes.length, base64CharCodeToInt[compressed.charCodeAt(charIndex++)]);
                            }
                            else {
                                const instrument = this.channels[instrumentChannelIterator].instruments[instrumentIndexIterator];
                                instrument.pulseWidth = clamp(0, Config.pulseWidthRange + 1, base64CharCodeToInt[compressed.charCodeAt(charIndex++)]);
                                instrument.pulseEnvelope = clamp(0, Config.envelopes.length, base64CharCodeToInt[compressed.charCodeAt(charIndex++)]);
                            }
                        }
                        break;
                    case 100:
                        {
                            if (beforeThree && variant == "beepbox") {
                                channel = base64CharCodeToInt[compressed.charCodeAt(charIndex++)];
                                this.channels[channel].instruments[0].transition = clamp(0, Config.transitions.length, base64CharCodeToInt[compressed.charCodeAt(charIndex++)]);
                            }
                            else if (beforeSix && variant == "beepbox") {
                                for (channel = 0; channel < this.getChannelCount(); channel++) {
                                    for (let i = 0; i < this.instrumentsPerChannel; i++) {
                                        this.channels[channel].instruments[i].transition = clamp(0, Config.transitions.length, base64CharCodeToInt[compressed.charCodeAt(charIndex++)]);
                                    }
                                }
                            }
                            else if (beforeFour || variant == "beepbox") {
                                this.channels[instrumentChannelIterator].instruments[instrumentIndexIterator].transition = clamp(0, Config.transitions.length, base64CharCodeToInt[compressed.charCodeAt(charIndex++)]);
                            }
                            else {
                                this.channels[instrumentChannelIterator].instruments[instrumentIndexIterator].transition = clamp(0, Config.transitions.length, base64CharCodeToInt[compressed.charCodeAt(charIndex++)]);
                                this.channels[instrumentChannelIterator].instruments[instrumentIndexIterator].tieNoteTransition = base64CharCodeToInt[compressed.charCodeAt(charIndex++)] ? true : false;
                                this.channels[instrumentChannelIterator].instruments[instrumentIndexIterator].clicklessTransition = base64CharCodeToInt[compressed.charCodeAt(charIndex++)] ? true : false;
                            }
                        }
                        break;
                    case 99:
                        {
                            if (beforeThree && variant == "beepbox") {
                                const legacyEffects = [0, 3, 2, 0];
                                const legacyEnvelopes = [1, 1, 1, 13];
                                const channel = base64CharCodeToInt[compressed.charCodeAt(charIndex++)];
                                const effect = clamp(0, legacyEffects.length, base64CharCodeToInt[compressed.charCodeAt(charIndex++)]);
                                const instrument = this.channels[channel].instruments[0];
                                instrument.vibrato = legacyEffects[effect];
                                instrument.filterEnvelope = (instrument.filterEnvelope == 1)
                                    ? legacyEnvelopes[effect]
                                    : instrument.filterEnvelope;
                            }
                            else if (beforeSix && variant == "beepbox") {
                                const legacyEffects = [0, 1, 2, 3, 0, 0];
                                const legacyEnvelopes = [1, 1, 1, 1, 16, 13];
                                for (let channel = 0; channel < this.getChannelCount(); channel++) {
                                    for (let i = 0; i < this.instrumentsPerChannel; i++) {
                                        const effect = clamp(0, legacyEffects.length, base64CharCodeToInt[compressed.charCodeAt(charIndex++)]);
                                        const instrument = this.channels[channel].instruments[i];
                                        instrument.vibrato = legacyEffects[effect];
                                        instrument.filterEnvelope = (instrument.filterEnvelope == 1)
                                            ? legacyEnvelopes[effect]
                                            : instrument.filterEnvelope;
                                    }
                                }
                            }
                            else if (beforeSeven && variant == "beepbox") {
                                const legacyEffects = [0, 1, 2, 3, 0, 0];
                                const legacyEnvelopes = [1, 1, 1, 1, 16, 13];
                                const effect = clamp(0, legacyEffects.length, base64CharCodeToInt[compressed.charCodeAt(charIndex++)]);
                                const instrument = this.channels[instrumentChannelIterator].instruments[instrumentIndexIterator];
                                instrument.vibrato = legacyEffects[effect];
                                instrument.filterEnvelope = (instrument.filterEnvelope == 1)
                                    ? legacyEnvelopes[effect]
                                    : instrument.filterEnvelope;
                            }
                            else {
                                const vibrato = clamp(0, Config.vibratos.length + 1, base64CharCodeToInt[compressed.charCodeAt(charIndex++)]);
                                const instrument = this.channels[instrumentChannelIterator].instruments[instrumentIndexIterator];
                                instrument.vibrato = vibrato;
                                if (vibrato == Config.vibratos.length) {
                                    instrument.vibratoDepth = clamp(0, this.mstMaxVols.get(ModSetting.mstVibratoDepth) + 1, base64CharCodeToInt[compressed.charCodeAt(charIndex++)]) / 25;
                                    instrument.vibratoSpeed = clamp(0, this.mstMaxVols.get(ModSetting.mstVibratoSpeed) + 1, base64CharCodeToInt[compressed.charCodeAt(charIndex++)]);
                                    instrument.vibratoDelay = clamp(0, this.mstMaxVols.get(ModSetting.mstVibratoDelay) + 1, base64CharCodeToInt[compressed.charCodeAt(charIndex++)]);
                                    instrument.vibratoType = clamp(0, Config.vibratoTypes.length, base64CharCodeToInt[compressed.charCodeAt(charIndex++)]);
                                }
                                else {
                                    instrument.vibratoDepth = Config.vibratos[instrument.vibrato].amplitude;
                                    instrument.vibratoSpeed = 10;
                                    instrument.vibratoDelay = Config.vibratos[instrument.vibrato].delayParts;
                                    instrument.vibratoType = Config.vibratos[instrument.vibrato].type;
                                }
                            }
                        }
                        break;
                    case 71:
                        {
                            const instrument = this.channels[instrumentChannelIterator].instruments[instrumentIndexIterator];
                            instrument.arpeggioSpeed = clamp(0, this.mstMaxVols.get(ModSetting.mstArpeggioSpeed) + 1, base64CharCodeToInt[compressed.charCodeAt(charIndex++)]);
                            instrument.fastTwoNoteArp = base64CharCodeToInt[compressed.charCodeAt(charIndex++)] ? true : false;
                        }
                        break;
                    case 104:
                        {
                            if (beforeThree && variant == "beepbox") {
                                channel = base64CharCodeToInt[compressed.charCodeAt(charIndex++)];
                                this.channels[channel].instruments[0].interval = clamp(0, Config.intervals.length, base64CharCodeToInt[compressed.charCodeAt(charIndex++)]);
                            }
                            else if (beforeSix && variant == "beepbox") {
                                for (channel = 0; channel < this.getChannelCount(); channel++) {
                                    for (let i = 0; i < this.instrumentsPerChannel; i++) {
                                        const originalValue = base64CharCodeToInt[compressed.charCodeAt(charIndex++)];
                                        let interval = clamp(0, Config.intervals.length, originalValue);
                                        if (originalValue == 8) {
                                            interval = 2;
                                            this.channels[channel].instruments[i].chord = 3;
                                        }
                                        this.channels[channel].instruments[i].interval = interval;
                                    }
                                }
                            }
                            else if (beforeSeven && variant == "beepbox") {
                                const originalValue = base64CharCodeToInt[compressed.charCodeAt(charIndex++)];
                                let interval = clamp(0, Config.intervals.length, originalValue);
                                if (originalValue == 8) {
                                    interval = 2;
                                    this.channels[instrumentChannelIterator].instruments[instrumentIndexIterator].chord = 3;
                                }
                                this.channels[instrumentChannelIterator].instruments[instrumentIndexIterator].interval = interval;
                            }
                            else {
                                this.channels[instrumentChannelIterator].instruments[instrumentIndexIterator].interval = clamp(0, Config.intervals.length, base64CharCodeToInt[compressed.charCodeAt(charIndex++)]);
                            }
                        }
                        break;
                    case 67:
                        {
                            this.channels[instrumentChannelIterator].instruments[instrumentIndexIterator].chord = clamp(0, Config.chords.length, base64CharCodeToInt[compressed.charCodeAt(charIndex++)]);
                        }
                        break;
                    case 113:
                        {
                            this.channels[instrumentChannelIterator].instruments[instrumentIndexIterator].effects = clamp(0, Config.effectsNames.length, base64CharCodeToInt[compressed.charCodeAt(charIndex++)]);
                        }
                        break;
                    case 118:
                        {
                            if (beforeThree && variant == "beepbox") {
                                channel = base64CharCodeToInt[compressed.charCodeAt(charIndex++)];
                                const instrument = this.channels[channel].instruments[0];
                                instrument.volume = Math.round(clamp(-Config.volumeRange, 1, -base64CharCodeToInt[compressed.charCodeAt(charIndex++)] * 5.0));
                            }
                            else if (beforeSix && variant == "beepbox") {
                                for (channel = 0; channel < this.getChannelCount(); channel++) {
                                    for (let i = 0; i < this.instrumentsPerChannel; i++) {
                                        const instrument = this.channels[channel].instruments[i];
                                        instrument.volume = Math.round(clamp(-Config.volumeRange, 1, -base64CharCodeToInt[compressed.charCodeAt(charIndex++)] * 5.0));
                                    }
                                }
                            }
                            else if (beforeSeven && variant == "beepbox") {
                                const instrument = this.channels[instrumentChannelIterator].instruments[instrumentIndexIterator];
                                instrument.volume = Math.round(clamp(-Config.volumeRange, 1, -base64CharCodeToInt[compressed.charCodeAt(charIndex++)] * 5.0));
                            }
                            else if (variant == "beepbox") {
                                const instrument = this.channels[instrumentChannelIterator].instruments[instrumentIndexIterator];
                                instrument.volume = Math.round(clamp(-Config.volumeRange / 2, 1, -base64CharCodeToInt[compressed.charCodeAt(charIndex++)] * 25.0 / 7.0));
                            }
                            else {
                                const instrument = this.channels[instrumentChannelIterator].instruments[instrumentIndexIterator];
                                instrument.volume = Math.round(clamp(-Config.volumeRange / 2, Config.volumeRange / 2 + 1, ((base64CharCodeToInt[compressed.charCodeAt(charIndex++)] << 6) | (base64CharCodeToInt[compressed.charCodeAt(charIndex++)])) - Config.volumeRange / 2));
                            }
                        }
                        break;
                    case 76:
                        {
                            const instrument = this.channels[instrumentChannelIterator].instruments[instrumentIndexIterator];
                            if (variant == "beepbox") {
                                instrument.pan = clamp(0, Config.panMax + 1, Math.round(base64CharCodeToInt[compressed.charCodeAt(charIndex++)] * ((Config.panMax) / 8.0)));
                            }
                            else {
                                instrument.pan = clamp(0, Config.panMax + 1, (base64CharCodeToInt[compressed.charCodeAt(charIndex++)] << 6) + base64CharCodeToInt[compressed.charCodeAt(charIndex++)]);
                            }
                            if (variant == "jummbox" && !beforeThree)
                                instrument.panDelay = base64CharCodeToInt[compressed.charCodeAt(charIndex++)];
                        }
                        break;
                    case 68:
                        {
                            const instrument = this.channels[instrumentChannelIterator].instruments[instrumentIndexIterator];
                            instrument.detune = clamp(Config.detuneMin, Config.detuneMax + 1, ((base64CharCodeToInt[compressed.charCodeAt(charIndex++)] << 6) + base64CharCodeToInt[compressed.charCodeAt(charIndex++)]) + Config.detuneMin);
                        }
                        break;
                    case 77:
                        {
                            let instrument = this.channels[instrumentChannelIterator].instruments[instrumentIndexIterator];
                            for (let j = 0; j < 64; j++) {
                                instrument.customChipWave[j]
                                    = clamp(-24, 25, base64CharCodeToInt[compressed.charCodeAt(charIndex++)] - 24);
                            }
                            let sum = 0.0;
                            for (let i = 0; i < instrument.customChipWave.length; i++) {
                                sum += instrument.customChipWave[i];
                            }
                            const average = sum / instrument.customChipWave.length;
                            let cumulative = 0;
                            let wavePrev = 0;
                            for (let i = 0; i < instrument.customChipWave.length; i++) {
                                cumulative += wavePrev;
                                wavePrev = instrument.customChipWave[i] - average;
                                instrument.customChipWaveIntegral[i] = cumulative;
                            }
                            instrument.customChipWaveIntegral[64] = 0.0;
                        }
                        break;
                    case 79:
                        {
                            let nextValue = base64CharCodeToInt[compressed.charCodeAt(charIndex++)];
                            if (nextValue == 0x3f) {
                                this.compressionRatio = 1.0;
                                this.limitRatio = 1.0;
                                this.limitRise = 4000.0;
                                this.limitDecay = 4.0;
                                this.limitThreshold = 1.0;
                                this.compressionThreshold = 1.0;
                                this.masterGain = 1.0;
                            }
                            else {
                                this.compressionRatio = (nextValue < 10 ? nextValue / 10 : (1 + (nextValue - 10) / 60));
                                nextValue = base64CharCodeToInt[compressed.charCodeAt(charIndex++)];
                                this.limitRatio = (nextValue < 10 ? nextValue / 10 : (nextValue - 9));
                                this.limitDecay = base64CharCodeToInt[compressed.charCodeAt(charIndex++)];
                                this.limitRise = (base64CharCodeToInt[compressed.charCodeAt(charIndex++)] * 250.0) + 2000.0;
                                this.compressionThreshold = base64CharCodeToInt[compressed.charCodeAt(charIndex++)] / 20.0;
                                this.limitThreshold = base64CharCodeToInt[compressed.charCodeAt(charIndex++)] / 20.0;
                                this.masterGain = ((base64CharCodeToInt[compressed.charCodeAt(charIndex++)] << 6) + base64CharCodeToInt[compressed.charCodeAt(charIndex++)]) / 50.0;
                            }
                        }
                        break;
                    case 85:
                        {
                            for (let channel = 0; channel < this.getChannelCount(); channel++) {
                                var channelNameLength;
                                if (beforeFour)
                                    channelNameLength = base64CharCodeToInt[compressed.charCodeAt(charIndex++)];
                                else
                                    channelNameLength = ((base64CharCodeToInt[compressed.charCodeAt(charIndex++)] << 6) + base64CharCodeToInt[compressed.charCodeAt(charIndex++)]);
                                this.channels[channel].name = decodeURIComponent(compressed.substring(charIndex, charIndex + channelNameLength));
                                charIndex += channelNameLength;
                            }
                        }
                        break;
                    case 65:
                        {
                            this.channels[instrumentChannelIterator].instruments[instrumentIndexIterator].algorithm = clamp(0, Config.algorithms.length, base64CharCodeToInt[compressed.charCodeAt(charIndex++)]);
                        }
                        break;
                    case 70:
                        {
                            this.channels[instrumentChannelIterator].instruments[instrumentIndexIterator].feedbackType = clamp(0, Config.feedbacks.length, base64CharCodeToInt[compressed.charCodeAt(charIndex++)]);
                        }
                        break;
                    case 66:
                        {
                            this.channels[instrumentChannelIterator].instruments[instrumentIndexIterator].feedbackAmplitude = clamp(0, Config.operatorAmplitudeMax + 1, base64CharCodeToInt[compressed.charCodeAt(charIndex++)]);
                        }
                        break;
                    case 86:
                        {
                            this.channels[instrumentChannelIterator].instruments[instrumentIndexIterator].feedbackEnvelope = clamp(0, Config.envelopes.length, base64CharCodeToInt[compressed.charCodeAt(charIndex++)]);
                        }
                        break;
                    case 81:
                        {
                            for (let o = 0; o < Config.operatorCount; o++) {
                                this.channels[instrumentChannelIterator].instruments[instrumentIndexIterator].operators[o].frequency = clamp(0, Config.operatorFrequencies.length, base64CharCodeToInt[compressed.charCodeAt(charIndex++)]);
                            }
                        }
                        break;
                    case 80:
                        {
                            for (let o = 0; o < Config.operatorCount; o++) {
                                this.channels[instrumentChannelIterator].instruments[instrumentIndexIterator].operators[o].amplitude = clamp(0, Config.operatorAmplitudeMax + 1, base64CharCodeToInt[compressed.charCodeAt(charIndex++)]);
                            }
                        }
                        break;
                    case 69:
                        {
                            for (let o = 0; o < Config.operatorCount; o++) {
                                this.channels[instrumentChannelIterator].instruments[instrumentIndexIterator].operators[o].envelope = clamp(0, Config.envelopes.length, base64CharCodeToInt[compressed.charCodeAt(charIndex++)]);
                            }
                        }
                        break;
                    case 83:
                        {
                            const instrument = this.channels[instrumentChannelIterator].instruments[instrumentIndexIterator];
                            if (instrument.type == 3) {
                                const byteCount = Math.ceil(Config.spectrumControlPoints * Config.spectrumControlPointBits / 6);
                                const bits = new BitFieldReader(compressed, charIndex, charIndex + byteCount);
                                for (let i = 0; i < Config.spectrumControlPoints; i++) {
                                    instrument.spectrumWave.spectrum[i] = bits.read(Config.spectrumControlPointBits);
                                }
                                instrument.spectrumWave.markCustomWaveDirty();
                                charIndex += byteCount;
                            }
                            else if (instrument.type == 4) {
                                const byteCount = Math.ceil(Config.drumCount * Config.spectrumControlPoints * Config.spectrumControlPointBits / 6);
                                const bits = new BitFieldReader(compressed, charIndex, charIndex + byteCount);
                                for (let j = 0; j < Config.drumCount; j++) {
                                    for (let i = 0; i < Config.spectrumControlPoints; i++) {
                                        instrument.drumsetSpectrumWaves[j].spectrum[i] = bits.read(Config.spectrumControlPointBits);
                                    }
                                    instrument.drumsetSpectrumWaves[j].markCustomWaveDirty();
                                }
                                charIndex += byteCount;
                            }
                            else {
                                throw new Error("Unhandled instrument type for spectrum song tag code.");
                            }
                        }
                        break;
                    case 72:
                        {
                            const instrument = this.channels[instrumentChannelIterator].instruments[instrumentIndexIterator];
                            const byteCount = Math.ceil(Config.harmonicsControlPoints * Config.harmonicsControlPointBits / 6);
                            const bits = new BitFieldReader(compressed, charIndex, charIndex + byteCount);
                            for (let i = 0; i < Config.harmonicsControlPoints; i++) {
                                instrument.harmonicsWave.harmonics[i] = bits.read(Config.harmonicsControlPointBits);
                            }
                            instrument.harmonicsWave.markCustomWaveDirty();
                            charIndex += byteCount;
                        }
                        break;
                    case 98:
                        {
                            let subStringLength;
                            if (beforeThree && variant == "beepbox") {
                                channel = base64CharCodeToInt[compressed.charCodeAt(charIndex++)];
                                const barCount = base64CharCodeToInt[compressed.charCodeAt(charIndex++)];
                                subStringLength = Math.ceil(barCount * 0.5);
                                const bits = new BitFieldReader(compressed, charIndex, charIndex + subStringLength);
                                for (let i = 0; i < barCount; i++) {
                                    this.channels[channel].bars[i] = bits.read(3) + 1;
                                }
                            }
                            else if (beforeFive && variant == "beepbox") {
                                let neededBits = 0;
                                while ((1 << neededBits) < this.patternsPerChannel)
                                    neededBits++;
                                subStringLength = Math.ceil(this.getChannelCount() * this.barCount * neededBits / 6);
                                const bits = new BitFieldReader(compressed, charIndex, charIndex + subStringLength);
                                for (let channel = 0; channel < this.getChannelCount(); channel++) {
                                    for (let i = 0; i < this.barCount; i++) {
                                        this.channels[channel].bars[i] = bits.read(neededBits) + 1;
                                    }
                                }
                            }
                            else {
                                let neededBits = 0;
                                while ((1 << neededBits) < this.patternsPerChannel + 1)
                                    neededBits++;
                                subStringLength = Math.ceil(this.getChannelCount() * this.barCount * neededBits / 6);
                                const bits = new BitFieldReader(compressed, charIndex, charIndex + subStringLength);
                                for (let channel = 0; channel < this.getChannelCount(); channel++) {
                                    for (let i = 0; i < this.barCount; i++) {
                                        this.channels[channel].bars[i] = bits.read(neededBits);
                                    }
                                }
                            }
                            charIndex += subStringLength;
                        }
                        break;
                    case 112:
                        {
                            let bitStringLength = 0;
                            let channel;
                            let largerChords = !((beforeFour && variant == "jummbox") || variant == "beepbox");
                            let recentPitchBitLength = (largerChords ? 4 : 3);
                            let recentPitchLength = (largerChords ? 16 : 8);
                            if (beforeThree && variant == "beepbox") {
                                channel = base64CharCodeToInt[compressed.charCodeAt(charIndex++)];
                                charIndex++;
                                bitStringLength = base64CharCodeToInt[compressed.charCodeAt(charIndex++)];
                                bitStringLength = bitStringLength << 6;
                                bitStringLength += base64CharCodeToInt[compressed.charCodeAt(charIndex++)];
                            }
                            else {
                                channel = 0;
                                let bitStringLengthLength = validateRange(1, 4, base64CharCodeToInt[compressed.charCodeAt(charIndex++)]);
                                while (bitStringLengthLength > 0) {
                                    bitStringLength = bitStringLength << 6;
                                    bitStringLength += base64CharCodeToInt[compressed.charCodeAt(charIndex++)];
                                    bitStringLengthLength--;
                                }
                            }
                            const bits = new BitFieldReader(compressed, charIndex, charIndex + bitStringLength);
                            charIndex += bitStringLength;
                            let neededInstrumentBits = 0;
                            while ((1 << neededInstrumentBits) < this.instrumentsPerChannel)
                                neededInstrumentBits++;
                            while (true) {
                                const isNoiseChannel = this.getChannelIsNoise(channel);
                                const isModChannel = this.getChannelIsMod(channel);
                                if (isModChannel) {
                                    for (let instrumentIndex = 0; instrumentIndex < this.instrumentsPerChannel; instrumentIndex++) {
                                        let instrument = this.channels[channel].instruments[instrumentIndex];
                                        for (let mod = 0; mod < Config.modCount; mod++) {
                                            instrument.modStatuses[mod] = bits.read(2);
                                            if (instrument.modStatuses[mod] == ModStatus.msForPitch || instrument.modStatuses[mod] == ModStatus.msForNoise) {
                                                if (instrument.modStatuses[mod] == ModStatus.msForPitch) {
                                                    instrument.modChannels[mod] = clamp(0, this.pitchChannelCount + 1, bits.read(8));
                                                }
                                                else {
                                                    instrument.modChannels[mod] = clamp(0, this.noiseChannelCount + 1, bits.read(8));
                                                }
                                                instrument.modInstruments[mod] = clamp(0, this.instrumentsPerChannel + 1, bits.read(neededInstrumentBits));
                                            }
                                            if (instrument.modStatuses[mod] != ModStatus.msNone) {
                                                instrument.modSettings[mod] = bits.read(6);
                                            }
                                        }
                                    }
                                }
                                const octaveOffset = (isNoiseChannel || isModChannel) ? 0 : this.channels[channel].octave * 12;
                                let note = null;
                                let pin = null;
                                let lastPitch = ((isNoiseChannel || isModChannel) ? 4 : 12) + octaveOffset;
                                const recentPitches = isModChannel ? [0, 1, 2, 3, 4, 5] : (isNoiseChannel ? [4, 6, 7, 2, 3, 8, 0, 10] : [12, 19, 24, 31, 36, 7, 0]);
                                const recentShapes = [];
                                for (let i = 0; i < recentPitches.length; i++) {
                                    recentPitches[i] += octaveOffset;
                                }
                                for (let i = 0; i < this.patternsPerChannel; i++) {
                                    const newPattern = this.channels[channel].patterns[i];
                                    newPattern.reset();
                                    newPattern.instrument = bits.read(neededInstrumentBits);
                                    if (!(variant == "beepbox" && beforeThree) && bits.read(1) == 0)
                                        continue;
                                    let curPart = 0;
                                    const newNotes = newPattern.notes;
                                    while (curPart < this.beatsPerBar * Config.partsPerBeat + (+isModChannel)) {
                                        const useOldShape = bits.read(1) == 1;
                                        let newNote = false;
                                        let shapeIndex = 0;
                                        if (useOldShape) {
                                            shapeIndex = validateRange(0, recentShapes.length - 1, bits.readLongTail(0, 0));
                                        }
                                        else {
                                            newNote = bits.read(1) == 1;
                                        }
                                        if (!useOldShape && !newNote) {
                                            if (isModChannel) {
                                                const isBackwards = bits.read(1) == 1;
                                                const restLength = bits.readPartDuration();
                                                if (isBackwards) {
                                                    curPart -= restLength;
                                                }
                                                else {
                                                    curPart += restLength;
                                                }
                                            }
                                            else {
                                                const restLength = (beforeSeven && variant == "beepbox")
                                                    ? bits.readLegacyPartDuration() * Config.partsPerBeat / Config.rhythms[this.rhythm].stepsPerBeat
                                                    : bits.readPartDuration();
                                                curPart += restLength;
                                            }
                                        }
                                        else {
                                            let shape;
                                            let pinObj;
                                            let pitch;
                                            if (useOldShape) {
                                                shape = recentShapes[shapeIndex];
                                                recentShapes.splice(shapeIndex, 1);
                                            }
                                            else {
                                                shape = {};
                                                if (!largerChords) {
                                                    shape.pitchCount = 1;
                                                    while (shape.pitchCount < 4 && bits.read(1) == 1)
                                                        shape.pitchCount++;
                                                }
                                                else {
                                                    if (bits.read(1) == 1) {
                                                        shape.pitchCount = bits.read(3) + 2;
                                                    }
                                                    else {
                                                        shape.pitchCount = 1;
                                                    }
                                                }
                                                shape.pinCount = bits.readPinCount();
                                                if (variant == "beepbox") {
                                                    shape.initialVolume = bits.read(2) * 2;
                                                }
                                                else if (!isModChannel) {
                                                    shape.initialVolume = bits.read(3);
                                                }
                                                else {
                                                    shape.initialVolume = bits.read(9);
                                                }
                                                shape.pins = [];
                                                shape.length = 0;
                                                shape.bendCount = 0;
                                                for (let j = 0; j < shape.pinCount; j++) {
                                                    pinObj = {};
                                                    pinObj.pitchBend = bits.read(1) == 1;
                                                    if (pinObj.pitchBend)
                                                        shape.bendCount++;
                                                    shape.length += (beforeSeven && variant == "beepbox")
                                                        ? bits.readLegacyPartDuration() * Config.partsPerBeat / Config.rhythms[this.rhythm].stepsPerBeat
                                                        : bits.readPartDuration();
                                                    pinObj.time = shape.length;
                                                    if (variant == "beepbox") {
                                                        pinObj.volume = bits.read(2) * 2;
                                                    }
                                                    else if (!isModChannel) {
                                                        pinObj.volume = bits.read(3);
                                                    }
                                                    else {
                                                        pinObj.volume = bits.read(9);
                                                    }
                                                    shape.pins.push(pinObj);
                                                }
                                            }
                                            recentShapes.unshift(shape);
                                            if (recentShapes.length > 10)
                                                recentShapes.pop();
                                            note = new Note(0, curPart, curPart + shape.length, shape.initialVolume);
                                            note.pitches = [];
                                            note.pins.length = 1;
                                            const pitchBends = [];
                                            for (let j = 0; j < shape.pitchCount + shape.bendCount; j++) {
                                                const useOldPitch = bits.read(1) == 1;
                                                if (!useOldPitch) {
                                                    const interval = bits.readPitchInterval();
                                                    pitch = lastPitch;
                                                    let intervalIter = interval;
                                                    while (intervalIter > 0) {
                                                        pitch++;
                                                        while (recentPitches.indexOf(pitch) != -1)
                                                            pitch++;
                                                        intervalIter--;
                                                    }
                                                    while (intervalIter < 0) {
                                                        pitch--;
                                                        while (recentPitches.indexOf(pitch) != -1)
                                                            pitch--;
                                                        intervalIter++;
                                                    }
                                                }
                                                else {
                                                    const pitchIndex = validateRange(0, recentPitches.length - 1, bits.read(recentPitchBitLength));
                                                    pitch = recentPitches[pitchIndex];
                                                    recentPitches.splice(pitchIndex, 1);
                                                }
                                                recentPitches.unshift(pitch);
                                                if (recentPitches.length > recentPitchLength)
                                                    recentPitches.pop();
                                                if (j < shape.pitchCount) {
                                                    note.pitches.push(pitch);
                                                }
                                                else {
                                                    pitchBends.push(pitch);
                                                }
                                                if (j == shape.pitchCount - 1) {
                                                    lastPitch = note.pitches[0];
                                                }
                                                else {
                                                    lastPitch = pitch;
                                                }
                                            }
                                            pitchBends.unshift(note.pitches[0]);
                                            for (const pinObj of shape.pins) {
                                                if (pinObj.pitchBend)
                                                    pitchBends.shift();
                                                pin = makeNotePin(pitchBends[0] - note.pitches[0], pinObj.time, pinObj.volume);
                                                note.pins.push(pin);
                                            }
                                            curPart = validateRange(0, this.beatsPerBar * Config.partsPerBeat, note.end);
                                            newNotes.push(note);
                                        }
                                    }
                                }
                                if (beforeThree && variant == "beepbox") {
                                    break;
                                }
                                else {
                                    channel++;
                                    if (channel >= this.getChannelCount())
                                        break;
                                }
                            }
                        }
                        break;
                    default:
                        {
                            throw new Error("Unrecognized song tag code " + String.fromCharCode(command) + " at index " + (charIndex - 1));
                        }
                }
            for (let channel = 0; channel < this.getChannelCount(); channel++) {
                if (toSetOctaves[channel] != null) {
                    this.channels[channel].octave = toSetOctaves[channel];
                }
            }
        }
        toJsonObject(enableIntro = true, loopCount = 1, enableOutro = true) {
            const channelArray = [];
            for (let channel = 0; channel < this.getChannelCount(); channel++) {
                const instrumentArray = [];
                const isNoiseChannel = this.getChannelIsNoise(channel);
                const isModChannel = this.getChannelIsMod(channel);
                for (let i = 0; i < this.instrumentsPerChannel; i++) {
                    instrumentArray.push(this.channels[channel].instruments[i].toJsonObject());
                }
                const patternArray = [];
                for (const pattern of this.channels[channel].patterns) {
                    const noteArray = [];
                    for (const note of pattern.notes) {
                        let volumeCap = this.getVolumeCapForSetting(isModChannel, this.channels[channel].instruments[pattern.instrument].modSettings[Config.modCount - note.pitches[0] - 1]);
                        const pointArray = [];
                        for (const pin of note.pins) {
                            let useVol = isModChannel ? Math.round(pin.volume) : Math.round(pin.volume * 100 / volumeCap);
                            pointArray.push({
                                "tick": (pin.time + note.start) * Config.rhythms[this.rhythm].stepsPerBeat / Config.partsPerBeat,
                                "pitchBend": pin.interval,
                                "volume": useVol,
                                "forMod": isModChannel,
                            });
                        }
                        noteArray.push({
                            "pitches": note.pitches,
                            "points": pointArray,
                        });
                    }
                    patternArray.push({
                        "instrument": pattern.instrument + 1,
                        "notes": noteArray,
                    });
                }
                const sequenceArray = [];
                if (enableIntro)
                    for (let i = 0; i < this.loopStart; i++) {
                        sequenceArray.push(this.channels[channel].bars[i]);
                    }
                for (let l = 0; l < loopCount; l++)
                    for (let i = this.loopStart; i < this.loopStart + this.loopLength; i++) {
                        sequenceArray.push(this.channels[channel].bars[i]);
                    }
                if (enableOutro)
                    for (let i = this.loopStart + this.loopLength; i < this.barCount; i++) {
                        sequenceArray.push(this.channels[channel].bars[i]);
                    }
                channelArray.push({
                    "type": isModChannel ? "mod" : (isNoiseChannel ? "drum" : "pitch"),
                    "octaveScrollBar": this.channels[channel].octave,
                    "instruments": instrumentArray,
                    "patterns": patternArray,
                    "sequence": sequenceArray,
                });
            }
            return {
                "name": this.title,
                "format": Song._format,
                "version": Song._latestJummBoxVersion,
                "scale": Config.scales[this.scale].name,
                "key": Config.keys[this.key].name,
                "introBars": this.loopStart,
                "loopBars": this.loopLength,
                "beatsPerBar": this.beatsPerBar,
                "ticksPerBeat": Config.rhythms[this.rhythm].stepsPerBeat,
                "beatsPerMinute": this.tempo,
                "reverb": this.reverb,
                "channels": channelArray,
            };
        }
        fromJsonObject(jsonObject) {
            this.initToDefault(true);
            if (!jsonObject)
                return;
            if (jsonObject["name"] != undefined) {
                this.title = jsonObject["name"];
            }
            this.scale = 0;
            if (jsonObject["scale"] != undefined) {
                const oldScaleNames = {
                    "romani :)": "dbl harmonic :)",
                    "romani :(": "dbl harmonic :(",
                    "enigma": "strange",
                };
                const scaleName = (oldScaleNames[jsonObject["scale"]] != undefined) ? oldScaleNames[jsonObject["scale"]] : jsonObject["scale"];
                const scale = Config.scales.findIndex(scale => scale.name == scaleName);
                if (scale != -1)
                    this.scale = scale;
            }
            if (jsonObject["key"] != undefined) {
                if (typeof (jsonObject["key"]) == "number") {
                    this.key = ((jsonObject["key"] + 1200) >>> 0) % Config.keys.length;
                }
                else if (typeof (jsonObject["key"]) == "string") {
                    const key = jsonObject["key"];
                    const letter = key.charAt(0).toUpperCase();
                    const symbol = key.charAt(1).toLowerCase();
                    const letterMap = { "C": 0, "D": 2, "E": 4, "F": 5, "G": 7, "A": 9, "B": 11 };
                    const accidentalMap = { "#": 1, "♯": 1, "b": -1, "♭": -1 };
                    let index = letterMap[letter];
                    const offset = accidentalMap[symbol];
                    if (index != undefined) {
                        if (offset != undefined)
                            index += offset;
                        if (index < 0)
                            index += 12;
                        index = index % 12;
                        this.key = index;
                    }
                }
            }
            if (jsonObject["beatsPerMinute"] != undefined) {
                this.tempo = clamp(Config.tempoMin, Config.tempoMax + 1, jsonObject["beatsPerMinute"] | 0);
            }
            if (jsonObject["reverb"] != undefined) {
                this.reverb = clamp(0, Config.reverbRange, jsonObject["reverb"] | 0);
            }
            if (jsonObject["beatsPerBar"] != undefined) {
                this.beatsPerBar = Math.max(Config.beatsPerBarMin, Math.min(Config.beatsPerBarMax, jsonObject["beatsPerBar"] | 0));
            }
            let importedPartsPerBeat = 4;
            if (jsonObject["ticksPerBeat"] != undefined) {
                importedPartsPerBeat = (jsonObject["ticksPerBeat"] | 0) || 4;
                this.rhythm = Config.rhythms.findIndex(rhythm => rhythm.stepsPerBeat == importedPartsPerBeat);
                if (this.rhythm == -1) {
                    this.rhythm = 1;
                }
            }
            let maxInstruments = 1;
            let maxPatterns = 1;
            let maxBars = 1;
            if (jsonObject["channels"]) {
                for (const channelObject of jsonObject["channels"]) {
                    if (channelObject["instruments"])
                        maxInstruments = Math.max(maxInstruments, channelObject["instruments"].length | 0);
                    if (channelObject["patterns"])
                        maxPatterns = Math.max(maxPatterns, channelObject["patterns"].length | 0);
                    if (channelObject["sequence"])
                        maxBars = Math.max(maxBars, channelObject["sequence"].length | 0);
                }
            }
            this.instrumentsPerChannel = Math.min(maxInstruments, Config.instrumentsPerChannelMax);
            this.patternsPerChannel = Math.min(maxPatterns, Config.barCountMax);
            this.barCount = Math.min(maxBars, Config.barCountMax);
            if (jsonObject["introBars"] != undefined) {
                this.loopStart = clamp(0, this.barCount, jsonObject["introBars"] | 0);
            }
            if (jsonObject["loopBars"] != undefined) {
                this.loopLength = clamp(1, this.barCount - this.loopStart + 1, jsonObject["loopBars"] | 0);
            }
            const newPitchChannels = [];
            const newNoiseChannels = [];
            const newModChannels = [];
            if (jsonObject["channels"]) {
                for (let channelIndex = 0; channelIndex < jsonObject["channels"].length; channelIndex++) {
                    let channelObject = jsonObject["channels"][channelIndex];
                    const channel = new Channel();
                    let isNoiseChannel = false;
                    let isModChannel = false;
                    if (channelObject["type"] != undefined) {
                        isNoiseChannel = (channelObject["type"] == "drum");
                        isModChannel = (channelObject["type"] == "mod");
                    }
                    else {
                        isNoiseChannel = (channelIndex >= 3);
                    }
                    if (isNoiseChannel) {
                        newNoiseChannels.push(channel);
                    }
                    else if (isModChannel) {
                        newModChannels.push(channel);
                    }
                    else {
                        newPitchChannels.push(channel);
                    }
                    if (channelObject["octaveScrollBar"] != undefined) {
                        channel.octave = clamp(0, Config.maxScrollableOctaves - (+(window.localStorage.getItem("extraOctaves") || "0")) + 1, channelObject["octaveScrollBar"] | 0);
                    }
                    for (let i = channel.instruments.length; i < this.instrumentsPerChannel; i++) {
                        channel.instruments[i] = new Instrument(isNoiseChannel, isModChannel);
                    }
                    channel.instruments.length = this.instrumentsPerChannel;
                    for (let i = channel.patterns.length; i < this.patternsPerChannel; i++) {
                        channel.patterns[i] = new Pattern();
                    }
                    channel.patterns.length = this.patternsPerChannel;
                    for (let i = 0; i < this.barCount; i++) {
                        channel.bars[i] = 1;
                    }
                    channel.bars.length = this.barCount;
                    for (let i = 0; i < this.instrumentsPerChannel; i++) {
                        const instrument = channel.instruments[i];
                        instrument.fromJsonObject(channelObject["instruments"][i], isNoiseChannel, isModChannel, this.rhythm == 0 || this.rhythm == 2, this.rhythm >= 2);
                    }
                    for (let i = 0; i < this.patternsPerChannel; i++) {
                        const pattern = channel.patterns[i];
                        let patternObject = undefined;
                        if (channelObject["patterns"])
                            patternObject = channelObject["patterns"][i];
                        if (patternObject == undefined)
                            continue;
                        pattern.instrument = clamp(0, this.instrumentsPerChannel, (patternObject["instrument"] | 0) - 1);
                        if (patternObject["notes"] && patternObject["notes"].length > 0) {
                            const maxNoteCount = Math.min(this.beatsPerBar * Config.partsPerBeat, patternObject["notes"].length >>> 0);
                            for (let j = 0; j < patternObject["notes"].length; j++) {
                                if (j >= maxNoteCount)
                                    break;
                                const noteObject = patternObject["notes"][j];
                                if (!noteObject || !noteObject["pitches"] || !(noteObject["pitches"].length >= 1) || !noteObject["points"] || !(noteObject["points"].length >= 2)) {
                                    continue;
                                }
                                const note = new Note(0, 0, 0, 0);
                                note.pitches = [];
                                note.pins = [];
                                for (let k = 0; k < noteObject["pitches"].length; k++) {
                                    const pitch = noteObject["pitches"][k] | 0;
                                    if (note.pitches.indexOf(pitch) != -1)
                                        continue;
                                    note.pitches.push(pitch);
                                    if (note.pitches.length >= Config.maxChordSize)
                                        break;
                                }
                                if (note.pitches.length < 1)
                                    continue;
                                let startInterval = 0;
                                for (let k = 0; k < noteObject["points"].length; k++) {
                                    const pointObject = noteObject["points"][k];
                                    if (pointObject == undefined || pointObject["tick"] == undefined)
                                        continue;
                                    const interval = (pointObject["pitchBend"] == undefined) ? 0 : (pointObject["pitchBend"] | 0);
                                    const time = Math.round((+pointObject["tick"]) * Config.partsPerBeat / importedPartsPerBeat);
                                    let volumeCap = this.getVolumeCapForSetting(isModChannel, channel.instruments[pattern.instrument].modSettings[Config.modCount - note.pitches[0] - 1]);
                                    let volume;
                                    if (pointObject["volume"] == undefined) {
                                        volume = volumeCap;
                                    }
                                    else if (pointObject["forMod"] == undefined) {
                                        volume = Math.max(0, Math.min(volumeCap, Math.round((pointObject["volume"] | 0) * volumeCap / 100)));
                                    }
                                    else {
                                        volume = ((pointObject["forMod"] | 0) > 0) ? Math.round(pointObject["volume"] | 0) : Math.max(0, Math.min(volumeCap, Math.round((pointObject["volume"] | 0) * volumeCap / 100)));
                                    }
                                    if (time > this.beatsPerBar * Config.partsPerBeat)
                                        continue;
                                    if (note.pins.length == 0) {
                                        note.start = time;
                                        startInterval = interval;
                                    }
                                    note.pins.push(makeNotePin(interval - startInterval, time - note.start, volume));
                                }
                                if (note.pins.length < 2)
                                    continue;
                                note.end = note.pins[note.pins.length - 1].time + note.start;
                                const maxPitch = isNoiseChannel ? Config.drumCount - 1 : Config.maxPitch;
                                let lowestPitch = maxPitch;
                                let highestPitch = 0;
                                for (let k = 0; k < note.pitches.length; k++) {
                                    note.pitches[k] += startInterval;
                                    if (note.pitches[k] < 0 || note.pitches[k] > maxPitch) {
                                        note.pitches.splice(k, 1);
                                        k--;
                                    }
                                    if (note.pitches[k] < lowestPitch)
                                        lowestPitch = note.pitches[k];
                                    if (note.pitches[k] > highestPitch)
                                        highestPitch = note.pitches[k];
                                }
                                if (note.pitches.length < 1)
                                    continue;
                                for (let k = 0; k < note.pins.length; k++) {
                                    const pin = note.pins[k];
                                    if (pin.interval + lowestPitch < 0)
                                        pin.interval = -lowestPitch;
                                    if (pin.interval + highestPitch > maxPitch)
                                        pin.interval = maxPitch - highestPitch;
                                    if (k >= 2) {
                                        if (pin.interval == note.pins[k - 1].interval &&
                                            pin.interval == note.pins[k - 2].interval &&
                                            pin.volume == note.pins[k - 1].volume &&
                                            pin.volume == note.pins[k - 2].volume) {
                                            note.pins.splice(k - 1, 1);
                                            k--;
                                        }
                                    }
                                }
                                pattern.notes.push(note);
                            }
                        }
                    }
                    for (let i = 0; i < this.barCount; i++) {
                        channel.bars[i] = channelObject["sequence"] ? Math.min(this.patternsPerChannel, channelObject["sequence"][i] >>> 0) : 0;
                    }
                }
            }
            if (newPitchChannels.length > Config.pitchChannelCountMax)
                newPitchChannels.length = Config.pitchChannelCountMax;
            if (newNoiseChannels.length > Config.noiseChannelCountMax)
                newNoiseChannels.length = Config.noiseChannelCountMax;
            if (newModChannels.length > Config.modChannelCountMax)
                newModChannels.length = Config.modChannelCountMax;
            this.pitchChannelCount = newPitchChannels.length;
            this.noiseChannelCount = newNoiseChannels.length;
            this.modChannelCount = newModChannels.length;
            this.channels.length = 0;
            Array.prototype.push.apply(this.channels, newPitchChannels);
            Array.prototype.push.apply(this.channels, newNoiseChannels);
            Array.prototype.push.apply(this.channels, newModChannels);
        }
        getPattern(channel, bar) {
            if (bar < 0 || bar >= this.barCount)
                return null;
            const patternIndex = this.channels[channel].bars[bar];
            if (patternIndex == 0)
                return null;
            return this.channels[channel].patterns[patternIndex - 1];
        }
        getPatternInstrument(channel, bar) {
            const pattern = this.getPattern(channel, bar);
            return pattern == null ? 0 : pattern.instrument;
        }
        getBeatsPerMinute() {
            return this.tempo;
        }
    }
    Song._format = "BeepBox";
    Song._oldestBeepboxVersion = 2;
    Song._latestBeepboxVersion = 8;
    Song._oldestJummBoxVersion = 1;
    Song._latestJummBoxVersion = 4;
    Song._variant = 0x6A;
    class Tone {
        constructor() {
            this.pitches = [0, 0, 0, 0];
            this.pitchCount = 0;
            this.chordSize = 0;
            this.drumsetPitch = 0;
            this.note = null;
            this.prevNote = null;
            this.nextNote = null;
            this.prevNotePitchIndex = 0;
            this.nextNotePitchIndex = 0;
            this.active = false;
            this.noteStart = 0;
            this.noteEnd = 0;
            this.noteLengthTicks = 0;
            this.ticksSinceReleased = 0;
            this.liveInputSamplesHeld = 0;
            this.lastInterval = 0;
            this.lastVolume = 0;
            this.stereoVolume1 = 0.0;
            this.stereoVolume2 = 0.0;
            this.stereoOffset = 0.0;
            this.stereoDelay = 0.0;
            this.sample = 0.0;
            this.phases = [];
            this.phaseDeltas = [];
            this.volumeStarts = [];
            this.volumeDeltas = [];
            this.volumeStart = 0.0;
            this.volumeDelta = 0.0;
            this.phaseDeltaScale = 0.0;
            this.pulseWidth = 0.0;
            this.pulseWidthDelta = 0.0;
            this.filter = 0.0;
            this.filterScale = 0.0;
            this.filterSample0 = 0.0;
            this.filterSample1 = 0.0;
            this.vibratoScale = 0.0;
            this.intervalMult = 0.0;
            this.intervalVolumeMult = 1.0;
            this.feedbackOutputs = [];
            this.feedbackMult = 0.0;
            this.feedbackDelta = 0.0;
            this.stereoVolumeLStart = 0.0;
            this.stereoVolumeRStart = 0.0;
            this.stereoVolumeLDelta = 0.0;
            this.stereoVolumeRDelta = 0.0;
            this.stereoDelayStart = 0.0;
            this.stereoDelayEnd = 0.0;
            this.stereoDelayDelta = 0.0;
            this.customVolumeStart = 0.0;
            this.customVolumeEnd = 0.0;
            this.filterResonanceStart = 0.0;
            this.filterResonanceDelta = 0.0;
            this.isFirstOrder = false;
            this.reset();
        }
        reset() {
            for (let i = 0; i < Config.operatorCount; i++) {
                this.phases[i] = 0.0;
                this.feedbackOutputs[i] = 0.0;
            }
            this.sample = 0.0;
            this.filterSample0 = 0.0;
            this.filterSample1 = 0.0;
            this.liveInputSamplesHeld = 0.0;
        }
    }
    class Synth {
        constructor(song = null) {
            this.samplesPerSecond = 44100;
            this.song = null;
            this.liveInputDuration = 0;
            this.liveInputStarted = false;
            this.liveInputPitches = [];
            this.liveInputChannel = 0;
            this.loopRepeatCount = -1;
            this.volume = 1.0;
            this.wantToSkip = false;
            this.playheadInternal = 0.0;
            this.bar = 0;
            this.beat = 0;
            this.part = 0;
            this.tick = 0;
            this.tickSampleCountdown = 0;
            this.isPlayingSong = false;
            this.liveInputEndTime = 0.0;
            this.tonePool = new Deque();
            this.activeTones = [];
            this.tyingOver = [];
            this.activeModTones = [];
            this.releasedTones = [];
            this.liveInputTones = new Deque();
            this.limit = 0.0;
            this.stereoBufferIndex = 0;
            this.samplesForNone = null;
            this.samplesForReverb = null;
            this.samplesForChorus = null;
            this.samplesForChorusReverb = null;
            this.chorusDelayLine = new Float32Array(2048);
            this.chorusDelayPos = 0;
            this.chorusPhase = 0;
            this.reverbDelayLine = new Float32Array(16384);
            this.reverbDelayPos = 0;
            this.reverbFeedback0 = 0.0;
            this.reverbFeedback1 = 0.0;
            this.reverbFeedback2 = 0.0;
            this.reverbFeedback3 = 0.0;
            this.audioCtx = null;
            this.scriptNode = null;
            this.audioProcessCallback = (audioProcessingEvent) => {
                const outputBuffer = audioProcessingEvent.outputBuffer;
                const outputDataL = outputBuffer.getChannelData(0);
                const outputDataR = outputBuffer.getChannelData(1);
                const isPlayingLiveTones = performance.now() < this.liveInputEndTime;
                if (!isPlayingLiveTones && !this.isPlayingSong) {
                    for (let i = 0; i < outputBuffer.length; i++) {
                        outputDataL[i] = 0.0;
                        outputDataR[i] = 0.0;
                    }
                    this.deactivateAudio();
                }
                else {
                    this.synthesize(outputDataL, outputDataR, outputBuffer.length, this.isPlayingSong);
                }
            };
            if (song != null)
                this.setSong(song);
        }
        warmUpSynthesizer(song) {
            if (song != null) {
                for (let channel = 0; channel < song.getChannelCount(); channel++) {
                    for (let instrument = 0; instrument < song.instrumentsPerChannel; instrument++) {
                        Synth.getInstrumentSynthFunction(song.channels[channel].instruments[instrument]);
                        song.channels[channel].instruments[instrument].warmUp();
                    }
                }
            }
        }
        computeLatestModValues() {
            if (this.song != null && this.song.modChannelCount > 0) {
                let latestModTimes = [];
                let latestModInsTimes = [];
                this.modValues = [];
                this.nextModValues = [];
                this.modInsValues = [];
                this.nextModInsValues = [];
                for (let channel = 0; channel < this.song.pitchChannelCount + this.song.noiseChannelCount; channel++) {
                    latestModInsTimes[channel] = [];
                    this.modInsValues[channel] = [];
                    this.nextModInsValues[channel] = [];
                    for (let instrument = 0; instrument < this.song.instrumentsPerChannel; instrument++) {
                        this.modInsValues[channel][instrument] = [];
                        this.nextModInsValues[channel][instrument] = [];
                        latestModInsTimes[channel][instrument] = [];
                    }
                }
                let currentPart = this.beat * Config.partsPerBeat + this.part;
                for (let channel = this.song.pitchChannelCount + this.song.noiseChannelCount; channel < this.song.getChannelCount(); channel++) {
                    if (!(this.song.channels[channel].muted)) {
                        let pattern;
                        for (let currentBar = this.bar; currentBar >= 0; currentBar--) {
                            pattern = this.song.getPattern(channel, currentBar);
                            if (pattern != null) {
                                let instrumentIdx = this.song.getPatternInstrument(channel, currentBar);
                                let instrument = this.song.channels[channel].instruments[instrumentIdx];
                                let latestPinParts = [];
                                let latestPinValues = [];
                                let partsInBar = (currentBar == this.bar)
                                    ? currentPart
                                    : this.findPartsInBar(currentBar);
                                for (const note of pattern.notes) {
                                    if (note.start < partsInBar && (latestPinParts[Config.modCount - 1 - note.pitches[0]] == null || note.end > latestPinParts[Config.modCount - 1 - note.pitches[0]])) {
                                        if (note.end <= partsInBar) {
                                            latestPinParts[Config.modCount - 1 - note.pitches[0]] = note.end;
                                            latestPinValues[Config.modCount - 1 - note.pitches[0]] = note.pins[note.pins.length - 1].volume;
                                        }
                                        else {
                                            latestPinParts[Config.modCount - 1 - note.pitches[0]] = partsInBar;
                                            for (let pinIdx = 0; pinIdx < note.pins.length; pinIdx++) {
                                                if (note.pins[pinIdx].time + note.start > partsInBar) {
                                                    const transitionLength = note.pins[pinIdx].time - note.pins[pinIdx - 1].time;
                                                    const toNextBarLength = partsInBar - note.start - note.pins[pinIdx - 1].time;
                                                    const deltaVolume = note.pins[pinIdx].volume - note.pins[pinIdx - 1].volume;
                                                    latestPinValues[Config.modCount - 1 - note.pitches[0]] = Math.round(note.pins[pinIdx - 1].volume + deltaVolume * toNextBarLength / transitionLength);
                                                    pinIdx = note.pins.length;
                                                }
                                            }
                                        }
                                    }
                                }
                                for (let mod = 0; mod < Config.modCount; mod++) {
                                    if (latestPinParts[mod] != null) {
                                        if (instrument.modStatuses[mod] == ModStatus.msForSong) {
                                            if (latestModTimes[instrument.modSettings[mod]] == null || currentBar * Config.partsPerBeat * this.song.beatsPerBar + latestPinParts[mod] > latestModTimes[instrument.modSettings[mod]]) {
                                                this.setModValue(latestPinValues[mod], latestPinValues[mod], mod, instrument, instrument.modSettings[mod]);
                                                latestModTimes[instrument.modSettings[mod]] = currentBar * Config.partsPerBeat * this.song.beatsPerBar + latestPinParts[mod];
                                            }
                                        }
                                        else if (latestModInsTimes[instrument.modChannels[mod]][instrument.modInstruments[mod]][instrument.modSettings[mod]] == null || currentBar * Config.partsPerBeat * this.song.beatsPerBar + latestPinParts[mod] > latestModInsTimes[instrument.modChannels[mod]][instrument.modInstruments[mod]][instrument.modSettings[mod]]) {
                                            this.setModValue(latestPinValues[mod], latestPinValues[mod], mod, instrument, instrument.modSettings[mod]);
                                            latestModInsTimes[instrument.modChannels[mod]][instrument.modInstruments[mod]][instrument.modSettings[mod]] = currentBar * Config.partsPerBeat * this.song.beatsPerBar + latestPinParts[mod];
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        static operatorAmplitudeCurve(amplitude) {
            return (Math.pow(16.0, amplitude / 15.0) - 1.0) / 15.0;
        }
        get playing() {
            return this.isPlayingSong;
        }
        get playhead() {
            return this.playheadInternal;
        }
        set playhead(value) {
            if (this.song != null) {
                this.playheadInternal = Math.max(0, Math.min(this.song.barCount, value));
                let remainder = this.playheadInternal;
                this.bar = Math.floor(remainder);
                remainder = this.song.beatsPerBar * (remainder - this.bar);
                this.beat = Math.floor(remainder);
                remainder = Config.partsPerBeat * (remainder - this.beat);
                this.part = Math.floor(remainder);
                remainder = Config.ticksPerPart * (remainder - this.part);
                this.tick = Math.floor(remainder);
                const samplesPerTick = this.getSamplesPerTick();
                remainder = samplesPerTick * (remainder - this.tick);
                this.tickSampleCountdown = samplesPerTick - remainder;
            }
        }
        getSamplesPerBar() {
            if (this.song == null)
                throw new Error();
            return this.getSamplesPerTick() * Config.ticksPerPart * Config.partsPerBeat * this.song.beatsPerBar;
        }
        findPartsInBar(bar) {
            if (this.song == null)
                return 0;
            let partsInBar = Config.partsPerBeat * this.song.beatsPerBar;
            for (let channel = this.song.pitchChannelCount + this.song.noiseChannelCount; channel < this.song.getChannelCount(); channel++) {
                let pattern = this.song.getPattern(channel, bar);
                if (pattern != null) {
                    let instrument = this.song.channels[channel].instruments[pattern.instrument];
                    for (let mod = 0; mod < Config.modCount; mod++) {
                        if (instrument.modSettings[mod] == ModSetting.mstNextBar && instrument.modStatuses[mod] == ModStatus.msForSong) {
                            for (const note of pattern.notes) {
                                if (note.pitches[0] == (Config.modCount - 1 - mod)) {
                                    if (partsInBar > note.start)
                                        partsInBar = note.start;
                                }
                            }
                        }
                    }
                }
            }
            return partsInBar;
        }
        getTotalSamples(enableIntro, enableOutro, loop) {
            if (this.song == null)
                return -1;
            let startBar = enableIntro ? 0 : this.song.loopStart;
            let endBar = enableOutro ? this.song.barCount : (this.song.loopStart + this.song.loopLength);
            let hasTempoMods = false;
            let hasNextBarMods = false;
            let prevTempo = this.song.tempo;
            for (let channel = this.song.pitchChannelCount + this.song.noiseChannelCount; channel < this.song.getChannelCount(); channel++) {
                for (let bar = startBar; bar < endBar; bar++) {
                    let pattern = this.song.getPattern(channel, bar);
                    if (pattern != null) {
                        let instrument = this.song.channels[channel].instruments[pattern.instrument];
                        for (let mod = 0; mod < Config.modCount; mod++) {
                            if (instrument.modSettings[mod] == ModSetting.mstTempo && instrument.modStatuses[mod] == ModStatus.msForSong) {
                                hasTempoMods = true;
                            }
                            if (instrument.modSettings[mod] == ModSetting.mstNextBar && instrument.modStatuses[mod] == ModStatus.msForSong) {
                                hasNextBarMods = true;
                            }
                        }
                    }
                }
            }
            if (startBar > 0) {
                let latestTempoPin = null;
                let latestTempoValue = 0;
                for (let bar = startBar - 1; bar >= 0; bar--) {
                    for (let channel = this.song.pitchChannelCount + this.song.noiseChannelCount; channel < this.song.getChannelCount(); channel++) {
                        let pattern = this.song.getPattern(channel, bar);
                        if (pattern != null) {
                            let instrumentIdx = this.song.getPatternInstrument(channel, bar);
                            let instrument = this.song.channels[channel].instruments[instrumentIdx];
                            let partsInBar = this.findPartsInBar(bar);
                            for (const note of pattern.notes) {
                                if (instrument.modSettings[Config.modCount - 1 - note.pitches[0]] == ModSetting.mstTempo && instrument.modStatuses[Config.modCount - 1 - note.pitches[0]] == ModStatus.msForSong) {
                                    if (note.start < partsInBar && (latestTempoPin == null || note.end > latestTempoPin)) {
                                        if (note.end <= partsInBar) {
                                            latestTempoPin = note.end;
                                            latestTempoValue = note.pins[note.pins.length - 1].volume;
                                        }
                                        else {
                                            latestTempoPin = partsInBar;
                                            for (let pinIdx = 0; pinIdx < note.pins.length; pinIdx++) {
                                                if (note.pins[pinIdx].time + note.start > partsInBar) {
                                                    const transitionLength = note.pins[pinIdx].time - note.pins[pinIdx - 1].time;
                                                    const toNextBarLength = partsInBar - note.start - note.pins[pinIdx - 1].time;
                                                    const deltaVolume = note.pins[pinIdx].volume - note.pins[pinIdx - 1].volume;
                                                    latestTempoValue = Math.round(note.pins[pinIdx - 1].volume + deltaVolume * toNextBarLength / transitionLength);
                                                    pinIdx = note.pins.length;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if (latestTempoPin != null) {
                        prevTempo = this.song.modValueToReal(latestTempoValue, ModSetting.mstTempo);
                        bar = -1;
                    }
                }
            }
            if (hasTempoMods || hasNextBarMods) {
                let bar = startBar;
                let ended = false;
                let totalSamples = 0;
                while (!ended) {
                    let partsInBar = Config.partsPerBeat * this.song.beatsPerBar;
                    let currentPart = 0;
                    if (hasNextBarMods) {
                        partsInBar = this.findPartsInBar(bar);
                    }
                    if (hasTempoMods) {
                        let foundMod = false;
                        for (let channel = this.song.pitchChannelCount + this.song.noiseChannelCount; channel < this.song.getChannelCount(); channel++) {
                            if (foundMod == false) {
                                let pattern = this.song.getPattern(channel, bar);
                                if (pattern != null) {
                                    let instrument = this.song.channels[channel].instruments[pattern.instrument];
                                    for (let mod = 0; mod < Config.modCount; mod++) {
                                        if (foundMod == false && instrument.modSettings[mod] == ModSetting.mstTempo && instrument.modStatuses[mod] == ModStatus.msForSong
                                            && pattern.notes.find(n => n.pitches[0] == (Config.modCount - 1 - mod))) {
                                            foundMod = true;
                                            pattern.notes.sort(function (a, b) { return (a.start == b.start) ? a.pitches[0] - b.pitches[0] : a.start - b.start; });
                                            for (const note of pattern.notes) {
                                                if (note.pitches[0] == (Config.modCount - 1 - mod)) {
                                                    totalSamples += (Math.min(partsInBar - currentPart, note.start - currentPart)) * Config.ticksPerPart * this.getSamplesPerTickSpecificBPM(prevTempo);
                                                    if (note.start < partsInBar) {
                                                        for (let pinIdx = 1; pinIdx < note.pins.length; pinIdx++) {
                                                            if (note.pins[pinIdx - 1].time + note.start <= partsInBar) {
                                                                const tickLength = Config.ticksPerPart * Math.min(partsInBar - (note.start + note.pins[pinIdx - 1].time), note.pins[pinIdx].time - note.pins[pinIdx - 1].time);
                                                                const prevPinTempo = this.song.modValueToReal(note.pins[pinIdx - 1].volume, ModSetting.mstTempo);
                                                                let currPinTempo = this.song.modValueToReal(note.pins[pinIdx].volume, ModSetting.mstTempo);
                                                                if (note.pins[pinIdx].time + note.start > partsInBar) {
                                                                    currPinTempo = this.song.modValueToReal(note.pins[pinIdx - 1].volume + (note.pins[pinIdx].volume - note.pins[pinIdx - 1].volume) * (partsInBar - (note.start + note.pins[pinIdx - 1].time)) / (note.pins[pinIdx].time - note.pins[pinIdx - 1].time), ModSetting.mstTempo);
                                                                }
                                                                let bpmScalar = Config.partsPerBeat * Config.ticksPerPart / 60;
                                                                if (currPinTempo != prevPinTempo) {
                                                                    totalSamples += -this.samplesPerSecond * tickLength * (Math.log(bpmScalar * currPinTempo * tickLength) - Math.log(bpmScalar * prevPinTempo * tickLength)) / (bpmScalar * (prevPinTempo - currPinTempo));
                                                                }
                                                                else {
                                                                    totalSamples += tickLength * this.getSamplesPerTickSpecificBPM(currPinTempo);
                                                                }
                                                                prevTempo = currPinTempo;
                                                            }
                                                            currentPart = Math.min(note.start + note.pins[pinIdx].time, partsInBar);
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    totalSamples += (partsInBar - currentPart) * Config.ticksPerPart * this.getSamplesPerTickSpecificBPM(prevTempo);
                    bar++;
                    if (loop != 0 && bar == this.song.loopStart + this.song.loopLength) {
                        bar = this.song.loopStart;
                        if (loop > 0)
                            loop--;
                    }
                    if (bar >= endBar) {
                        ended = true;
                    }
                }
                return Math.ceil(totalSamples);
            }
            else {
                return this.getSamplesPerBar() * this.getTotalBars(enableIntro, enableOutro, loop);
            }
        }
        getTotalBars(enableIntro, enableOutro, useLoopCount = this.loopRepeatCount) {
            if (this.song == null)
                throw new Error();
            let bars = this.song.loopLength * (useLoopCount + 1);
            if (enableIntro)
                bars += this.song.loopStart;
            if (enableOutro)
                bars += this.song.barCount - (this.song.loopStart + this.song.loopLength);
            return bars;
        }
        setSong(song) {
            if (typeof (song) == "string") {
                this.song = new Song(song);
            }
            else if (song instanceof Song) {
                this.song = song;
            }
        }
        setModValue(volumeStart, volumeEnd, mod, instrument, setting) {
            let val;
            let nextVal;
            switch (setting) {
                case ModSetting.mstSongVolume:
                case ModSetting.mstReverb:
                case ModSetting.mstTempo:
                case ModSetting.mstSongDetune:
                    val = this.song.modValueToReal(volumeStart, setting);
                    nextVal = this.song.modValueToReal(volumeEnd, setting);
                    if (this.modValues[setting] == null || this.modValues[setting] != val || this.nextModValues[setting] != nextVal) {
                        this.modValues[setting] = val;
                        this.nextModValues[setting] = nextVal;
                    }
                    break;
                case ModSetting.mstInsVolume:
                case ModSetting.mstPan:
                case ModSetting.mstPulseWidth:
                case ModSetting.mstFilterCut:
                case ModSetting.mstFilterPeak:
                case ModSetting.mstFMSlider1:
                case ModSetting.mstFMSlider2:
                case ModSetting.mstFMSlider3:
                case ModSetting.mstFMSlider4:
                case ModSetting.mstFMFeedback:
                case ModSetting.mstVibratoDepth:
                case ModSetting.mstVibratoSpeed:
                case ModSetting.mstVibratoDelay:
                case ModSetting.mstArpeggioSpeed:
                case ModSetting.mstPanDelay:
                case ModSetting.mstResetArpeggio:
                case ModSetting.mstDetune:
                    val = this.song.modValueToReal(volumeStart, setting);
                    nextVal = this.song.modValueToReal(volumeEnd, setting);
                    let channelAdjust = instrument.modChannels[mod] + ((instrument.modStatuses[mod] == ModStatus.msForNoise) ? this.song.pitchChannelCount : 0);
                    if (this.modInsValues[channelAdjust][instrument.modInstruments[mod]][setting] == null
                        || this.modInsValues[channelAdjust][instrument.modInstruments[mod]][setting] != val
                        || this.nextModInsValues[channelAdjust][instrument.modInstruments[mod]][setting] != nextVal) {
                        this.modInsValues[channelAdjust][instrument.modInstruments[mod]][setting] = val;
                        this.nextModInsValues[channelAdjust][instrument.modInstruments[mod]][setting] = nextVal;
                    }
                    break;
                case ModSetting.mstNextBar:
                    val = this.song.modValueToReal(volumeStart, setting);
                    break;
                case ModSetting.mstNone:
                default:
                    val = -1;
                    break;
            }
            return val;
        }
        getModValue(setting, forSong, channel, instrument, nextVal) {
            if (forSong) {
                if (this.modValues[setting] != null && this.nextModValues[setting] != null) {
                    return nextVal ? this.nextModValues[setting] : this.modValues[setting];
                }
            }
            else if (channel != undefined && instrument != undefined) {
                if (this.modInsValues[channel][instrument][setting] != null && this.nextModInsValues[channel][instrument][setting] != null) {
                    return nextVal ? this.nextModInsValues[channel][instrument][setting] : this.modInsValues[channel][instrument][setting];
                }
            }
            return -1;
        }
        isAnyModActive(channel, instrument) {
            for (let setting = 0; setting < ModSetting.mstMaxValue; setting++) {
                if ((this.modValues != undefined && this.modValues[setting] != null)
                    || (this.modInsValues != undefined && this.modInsValues[channel] != undefined && this.modInsValues[channel][instrument] != undefined && this.modInsValues[channel][instrument][setting] != null)) {
                    return true;
                }
            }
            return false;
        }
        unsetMod(setting, channel, instrument) {
            if (this.isModActive(setting, true) || (channel != undefined && instrument != undefined && this.isModActive(setting, false, channel, instrument))) {
                this.modValues[setting] = null;
                this.nextModValues[setting] = null;
                if (channel != undefined && instrument != undefined) {
                    this.modInsValues[channel][instrument][setting] = null;
                    this.nextModInsValues[channel][instrument][setting] = null;
                }
            }
        }
        isModActive(setting, forSong, channel, instrument) {
            if (forSong) {
                return (this.modValues != undefined && this.modValues[setting] != null);
            }
            else if (channel != undefined && instrument != undefined && this.modInsValues != undefined && this.modInsValues[channel] != null && this.modInsValues[channel][instrument] != null && this.modInsValues[channel][instrument][setting] != null) {
                return (this.modInsValues[channel][instrument][setting] != null);
            }
            return false;
        }
        activateAudio() {
            if (this.audioCtx == null || this.scriptNode == null) {
                this.audioCtx = this.audioCtx || new (window.AudioContext || window.webkitAudioContext)();
                this.samplesPerSecond = this.audioCtx.sampleRate;
                this.scriptNode = this.audioCtx.createScriptProcessor ? this.audioCtx.createScriptProcessor(2048, 0, 2) : this.audioCtx.createJavaScriptNode(2048, 0, 2);
                this.scriptNode.onaudioprocess = this.audioProcessCallback;
                this.scriptNode.channelCountMode = 'explicit';
                this.scriptNode.channelInterpretation = 'speakers';
                this.scriptNode.connect(this.audioCtx.destination);
            }
            this.audioCtx.resume();
        }
        deactivateAudio() {
            if (this.audioCtx != null && this.scriptNode != null) {
                this.scriptNode.disconnect(this.audioCtx.destination);
                this.scriptNode = null;
                if (this.audioCtx.close)
                    this.audioCtx.close();
                this.audioCtx = null;
            }
        }
        maintainLiveInput() {
            this.activateAudio();
            this.liveInputEndTime = performance.now() + 10000.0;
        }
        play() {
            if (this.isPlayingSong)
                return;
            this.isPlayingSong = true;
            this.warmUpSynthesizer(this.song);
            this.computeLatestModValues();
            this.activateAudio();
        }
        pause() {
            if (!this.isPlayingSong)
                return;
            this.isPlayingSong = false;
            if (this.song != null) {
                this.song.inVolumeCap = 0.0;
                this.song.outVolumeCap = 0.0;
            }
            this.modValues = [];
            this.modInsValues = [];
            this.nextModValues = [];
            this.nextModInsValues = [];
            this.tyingOver = [];
        }
        snapToStart() {
            this.bar = 0;
            this.snapToBar();
        }
        goToBar(bar) {
            this.bar = bar;
            this.playheadInternal = this.bar;
        }
        snapToBar() {
            this.playheadInternal = this.bar;
            this.beat = 0;
            this.part = 0;
            this.tick = 0;
            this.tickSampleCountdown = 0;
        }
        resetEffects() {
            this.reverbDelayPos = 0;
            this.reverbFeedback0 = 0.0;
            this.reverbFeedback1 = 0.0;
            this.reverbFeedback2 = 0.0;
            this.reverbFeedback3 = 0.0;
            this.freeAllTones();
            for (let i = 0; i < this.reverbDelayLine.length; i++)
                this.reverbDelayLine[i] = 0.0;
            for (let i = 0; i < this.chorusDelayLine.length; i++)
                this.chorusDelayLine[i] = 0.0;
            if (this.samplesForNone != null)
                for (let i = 0; i < this.samplesForNone.length; i++)
                    this.samplesForNone[i] = 0.0;
            if (this.samplesForReverb != null)
                for (let i = 0; i < this.samplesForReverb.length; i++)
                    this.samplesForReverb[i] = 0.0;
            if (this.samplesForChorus != null)
                for (let i = 0; i < this.samplesForChorus.length; i++)
                    this.samplesForChorus[i] = 0.0;
            if (this.samplesForChorusReverb != null)
                for (let i = 0; i < this.samplesForChorusReverb.length; i++)
                    this.samplesForChorusReverb[i] = 0.0;
        }
        jumpIntoLoop() {
            if (!this.song)
                return;
            if (this.bar < this.song.loopStart || this.bar >= this.song.loopStart + this.song.loopLength) {
                const oldBar = this.bar;
                this.bar = this.song.loopStart;
                this.playheadInternal += this.bar - oldBar;
                if (this.playing)
                    this.computeLatestModValues();
            }
        }
        nextBar() {
            if (!this.song)
                return;
            const oldBar = this.bar;
            this.bar++;
            if (this.bar >= this.song.barCount) {
                this.bar = 0;
            }
            this.playheadInternal += this.bar - oldBar;
            for (let channel = 0; channel < this.song.pitchChannelCount + this.song.noiseChannelCount; channel++) {
                this.tyingOver[channel] = -1;
            }
            if (this.playing)
                this.computeLatestModValues();
        }
        skipBar() {
            if (!this.song)
                return;
            const samplesPerTick = this.getSamplesPerTick();
            this.bar++;
            this.beat = 0;
            this.part = 0;
            this.tick = 0;
            this.tickSampleCountdown = samplesPerTick;
            if (this.loopRepeatCount != 0 && this.bar == this.song.loopStart + this.song.loopLength) {
                this.bar = this.song.loopStart;
                if (this.loopRepeatCount > 0)
                    this.loopRepeatCount--;
            }
        }
        firstBar() {
            if (!this.song)
                return;
            this.bar = 0;
            this.playheadInternal = 0;
            this.beat = 0;
            this.part = 0;
            for (let channel = 0; channel < this.song.pitchChannelCount + this.song.noiseChannelCount; channel++) {
                this.tyingOver[channel] = -1;
            }
            if (this.playing)
                this.computeLatestModValues();
        }
        jumpToEditingBar(bar) {
            if (!this.song)
                return;
            this.bar = bar;
            this.playheadInternal = bar;
            this.beat = 0;
            this.part = 0;
            for (let channel = 0; channel < this.song.pitchChannelCount + this.song.noiseChannelCount; channel++) {
                this.tyingOver[channel] = -1;
            }
            if (this.playing)
                this.computeLatestModValues();
        }
        prevBar() {
            if (!this.song)
                return;
            const oldBar = this.bar;
            this.bar--;
            if (this.bar < 0 || this.bar >= this.song.barCount) {
                this.bar = this.song.barCount - 1;
            }
            this.playheadInternal += this.bar - oldBar;
            for (let channel = 0; channel < this.song.pitchChannelCount + this.song.noiseChannelCount; channel++) {
                this.tyingOver[channel] = -1;
            }
            if (this.playing)
                this.computeLatestModValues();
        }
        synthesize(outputDataL, outputDataR, outputBufferLength, playSong = true) {
            if (this.song == null) {
                for (let i = 0; i < outputBufferLength; i++) {
                    outputDataL[i] = 0.0;
                    outputDataR[i] = 0.0;
                }
                this.deactivateAudio();
                return;
            }
            this.song.inVolumeCap = 0.0;
            this.song.outVolumeCap = 0.0;
            const channelCount = this.song.pitchChannelCount + this.song.noiseChannelCount;
            for (let i = this.activeTones.length; i < channelCount; i++) {
                this.activeTones[i] = new Deque();
                this.releasedTones[i] = new Deque();
            }
            this.activeTones.length = channelCount;
            this.releasedTones.length = channelCount;
            if (channelCount != this.tyingOver.length) {
                let idx = this.tyingOver.length;
                this.tyingOver.length = channelCount;
                while (idx < this.tyingOver.length) {
                    this.tyingOver[idx++] = -1;
                }
            }
            for (let i = this.activeModTones.length; i < this.song.modChannelCount; i++) {
                this.activeModTones[i] = [];
                for (let mod = 0; mod < Config.modCount; mod++) {
                    this.activeModTones[i][mod] = new Deque();
                }
                this.activeModTones[i].length = Config.modCount;
            }
            this.activeModTones.length = this.song.modChannelCount;
            let samplesPerTick = this.getSamplesPerTick();
            let bufferIndex = 0;
            let ended = false;
            while (this.tickSampleCountdown <= 0)
                this.tickSampleCountdown += samplesPerTick;
            if (this.tickSampleCountdown > samplesPerTick)
                this.tickSampleCountdown = samplesPerTick;
            if (playSong) {
                if (this.beat >= this.song.beatsPerBar) {
                    this.bar++;
                    this.beat = 0;
                    this.part = 0;
                    this.tick = 0;
                    this.tickSampleCountdown = samplesPerTick;
                    if (this.loopRepeatCount != 0 && this.bar == this.song.loopStart + this.song.loopLength) {
                        this.bar = this.song.loopStart;
                        if (this.loopRepeatCount > 0)
                            this.loopRepeatCount--;
                    }
                }
                if (this.bar >= this.song.barCount) {
                    this.bar = 0;
                    if (this.loopRepeatCount != -1) {
                        ended = true;
                        this.pause();
                    }
                }
            }
            const stereoBufferLength = outputBufferLength * 4;
            if (this.samplesForNone == null || this.samplesForNone.length != stereoBufferLength ||
                this.samplesForReverb == null || this.samplesForReverb.length != stereoBufferLength ||
                this.samplesForChorus == null || this.samplesForChorus.length != stereoBufferLength ||
                this.samplesForChorusReverb == null || this.samplesForChorusReverb.length != stereoBufferLength) {
                this.samplesForNone = new Float32Array(stereoBufferLength);
                this.samplesForReverb = new Float32Array(stereoBufferLength);
                this.samplesForChorus = new Float32Array(stereoBufferLength);
                this.samplesForChorusReverb = new Float32Array(stereoBufferLength);
                this.stereoBufferIndex = 0;
            }
            let stereoBufferIndex = this.stereoBufferIndex;
            const samplesForNone = this.samplesForNone;
            const samplesForReverb = this.samplesForReverb;
            const samplesForChorus = this.samplesForChorus;
            const samplesForChorusReverb = this.samplesForChorusReverb;
            const volume = +this.volume;
            const chorusDelayLine = this.chorusDelayLine;
            const reverbDelayLine = this.reverbDelayLine;
            const chorusDuration = 2.0;
            const chorusAngle = Math.PI * 2.0 / (chorusDuration * this.samplesPerSecond);
            const chorusRange = 150 * this.samplesPerSecond / 44100;
            const chorusOffset0 = 0x800 - 1.51 * chorusRange;
            const chorusOffset1 = 0x800 - 2.10 * chorusRange;
            const chorusOffset2 = 0x800 - 3.35 * chorusRange;
            const chorusOffset3 = 0x800 - 1.47 * chorusRange;
            const chorusOffset4 = 0x800 - 2.15 * chorusRange;
            const chorusOffset5 = 0x800 - 3.25 * chorusRange;
            let chorusPhase = this.chorusPhase % (Math.PI * 2.0);
            let chorusDelayPos = this.chorusDelayPos & 0x7FF;
            let reverbDelayPos = this.reverbDelayPos & 0x3FFF;
            let reverbFeedback0 = +this.reverbFeedback0;
            let reverbFeedback1 = +this.reverbFeedback1;
            let reverbFeedback2 = +this.reverbFeedback2;
            let reverbFeedback3 = +this.reverbFeedback3;
            let useReverb = this.song.reverb;
            if (this.isModActive(ModSetting.mstReverb, true)) {
                useReverb = this.getModValue(ModSetting.mstReverb, true);
            }
            let reverb = Math.pow(useReverb / Config.reverbRange, 0.667) * 0.425;
            const limitDecay = 1.0 - Math.pow(0.5, this.song.limitDecay / this.samplesPerSecond);
            const limitRise = 1.0 - Math.pow(0.5, this.song.limitRise / this.samplesPerSecond);
            const compressionThreshold = this.song.compressionThreshold;
            const limitThreshold = this.song.limitThreshold;
            const compressionRatio = this.song.compressionRatio;
            const limitRatio = this.song.limitRatio;
            const masterGain = this.song.masterGain;
            let limit = +this.limit;
            while (bufferIndex < outputBufferLength && !ended) {
                const samplesLeftInBuffer = outputBufferLength - bufferIndex;
                const runLength = Math.min(Math.ceil(this.tickSampleCountdown), samplesLeftInBuffer);
                for (let modChannel = 0, channel = this.song.pitchChannelCount + this.song.noiseChannelCount; modChannel < this.song.modChannelCount; modChannel++, channel++) {
                    this.determineCurrentActiveTones(this.song, channel, playSong);
                    for (let mod = 0; mod < Config.modCount; mod++) {
                        for (let i = 0; i < this.activeModTones[modChannel][mod].count(); i++) {
                            const tone = this.activeModTones[modChannel][mod].get(i);
                            if (this.song.channels[channel].muted == false)
                                this.playTone(this.song, stereoBufferIndex, stereoBufferLength, channel, samplesPerTick, runLength, tone, false, false);
                        }
                    }
                }
                if (this.wantToSkip) {
                    this.wantToSkip = false;
                    this.skipBar();
                }
                if (this.isModActive(ModSetting.mstReverb, true)) {
                    reverb = Math.pow(this.getModValue(ModSetting.mstReverb, true) / Config.reverbRange, 0.667) * 0.425;
                }
                const tickSampleCountdown = this.tickSampleCountdown;
                const startRatio = 1.0 - (tickSampleCountdown) / samplesPerTick;
                const endRatio = 1.0 - (tickSampleCountdown - runLength) / samplesPerTick;
                const ticksIntoBar = (this.beat * Config.partsPerBeat + this.part) * Config.ticksPerPart + this.tick;
                const partTimeTickStart = (ticksIntoBar) / Config.ticksPerPart;
                const partTimeTickEnd = (ticksIntoBar + 1) / Config.ticksPerPart;
                const partTimeStart = partTimeTickStart + (partTimeTickEnd - partTimeTickStart) * startRatio;
                const partTimeEnd = partTimeTickStart + (partTimeTickEnd - partTimeTickStart) * endRatio;
                for (let channel = 0; channel < this.song.pitchChannelCount + this.song.noiseChannelCount; channel++) {
                    for (let instrumentIdx = 0; instrumentIdx < this.song.instrumentsPerChannel; instrumentIdx++) {
                        let instrument = this.song.channels[channel].instruments[instrumentIdx];
                        let useVibratoSpeed = instrument.vibratoSpeed;
                        instrument.LFOtime = instrument.nextLFOtime;
                        if (this.isModActive(ModSetting.mstVibratoSpeed, false, channel, instrumentIdx)) {
                            useVibratoSpeed = this.getModValue(ModSetting.mstVibratoSpeed, false, channel, instrumentIdx, false);
                        }
                        if (useVibratoSpeed == 0) {
                            instrument.LFOtime = 0;
                            instrument.nextLFOtime = 0;
                        }
                        else {
                            instrument.nextLFOtime += useVibratoSpeed * 0.1 * (partTimeEnd - partTimeStart);
                        }
                    }
                }
                for (let channel = 0; channel < this.song.pitchChannelCount + this.song.noiseChannelCount; channel++) {
                    if (channel == this.liveInputChannel) {
                        this.determineLiveInputTones(this.song);
                        for (let i = 0; i < this.liveInputTones.count(); i++) {
                            const tone = this.liveInputTones.get(i);
                            this.playTone(this.song, stereoBufferIndex, stereoBufferLength, channel, samplesPerTick, runLength, tone, false, false);
                        }
                    }
                    this.determineCurrentActiveTones(this.song, channel, playSong);
                    for (let i = 0; i < this.activeTones[channel].count(); i++) {
                        const tone = this.activeTones[channel].get(i);
                        this.playTone(this.song, stereoBufferIndex, stereoBufferLength, channel, samplesPerTick, runLength, tone, false, false);
                    }
                    for (let i = 0; i < this.releasedTones[channel].count(); i++) {
                        const tone = this.releasedTones[channel].get(i);
                        if (tone.ticksSinceReleased >= tone.instrument.getTransition().releaseTicks) {
                            this.freeReleasedTone(channel, i);
                            i--;
                            continue;
                        }
                        const shouldFadeOutFast = (i + this.activeTones[channel].count() >= Config.maximumTonesPerChannel);
                        this.playTone(this.song, stereoBufferIndex, stereoBufferLength, channel, samplesPerTick, runLength, tone, true, shouldFadeOutFast);
                    }
                }
                let chorusTap0Index = chorusDelayPos + chorusOffset0 - chorusRange * Math.sin(chorusPhase + 0);
                let chorusTap1Index = chorusDelayPos + chorusOffset1 - chorusRange * Math.sin(chorusPhase + 2.1);
                let chorusTap2Index = chorusDelayPos + chorusOffset2 - chorusRange * Math.sin(chorusPhase + 4.2);
                let chorusTap3Index = chorusDelayPos + 0x400 + chorusOffset3 - chorusRange * Math.sin(chorusPhase + 3.2);
                let chorusTap4Index = chorusDelayPos + 0x400 + chorusOffset4 - chorusRange * Math.sin(chorusPhase + 5.3);
                let chorusTap5Index = chorusDelayPos + 0x400 + chorusOffset5 - chorusRange * Math.sin(chorusPhase + 1.0);
                chorusPhase += chorusAngle * runLength;
                const chorusTap0End = chorusDelayPos + runLength + chorusOffset0 - chorusRange * Math.sin(chorusPhase + 0);
                const chorusTap1End = chorusDelayPos + runLength + chorusOffset1 - chorusRange * Math.sin(chorusPhase + 2.1);
                const chorusTap2End = chorusDelayPos + runLength + chorusOffset2 - chorusRange * Math.sin(chorusPhase + 4.2);
                const chorusTap3End = chorusDelayPos + runLength + 0x400 + chorusOffset3 - chorusRange * Math.sin(chorusPhase + 3.2);
                const chorusTap4End = chorusDelayPos + runLength + 0x400 + chorusOffset4 - chorusRange * Math.sin(chorusPhase + 5.3);
                const chorusTap5End = chorusDelayPos + runLength + 0x400 + chorusOffset5 - chorusRange * Math.sin(chorusPhase + 1.0);
                const chorusTap0Delta = (chorusTap0End - chorusTap0Index) / runLength;
                const chorusTap1Delta = (chorusTap1End - chorusTap1Index) / runLength;
                const chorusTap2Delta = (chorusTap2End - chorusTap2Index) / runLength;
                const chorusTap3Delta = (chorusTap3End - chorusTap3Index) / runLength;
                const chorusTap4Delta = (chorusTap4End - chorusTap4Index) / runLength;
                const chorusTap5Delta = (chorusTap5End - chorusTap5Index) / runLength;
                const runEnd = bufferIndex + runLength;
                for (let i = bufferIndex; i < runEnd; i++) {
                    const bufferIndexL = stereoBufferIndex;
                    const bufferIndexR = stereoBufferIndex + 1;
                    const sampleForNoneL = samplesForNone[bufferIndexL];
                    samplesForNone[bufferIndexL] = 0.0;
                    const sampleForNoneR = samplesForNone[bufferIndexR];
                    samplesForNone[bufferIndexR] = 0.0;
                    const sampleForReverbL = samplesForReverb[bufferIndexL];
                    samplesForReverb[bufferIndexL] = 0.0;
                    const sampleForReverbR = samplesForReverb[bufferIndexR];
                    samplesForReverb[bufferIndexR] = 0.0;
                    const sampleForChorusL = samplesForChorus[bufferIndexL];
                    samplesForChorus[bufferIndexL] = 0.0;
                    const sampleForChorusR = samplesForChorus[bufferIndexR];
                    samplesForChorus[bufferIndexR] = 0.0;
                    const sampleForChorusReverbL = samplesForChorusReverb[bufferIndexL];
                    samplesForChorusReverb[bufferIndexL] = 0.0;
                    const sampleForChorusReverbR = samplesForChorusReverb[bufferIndexR];
                    samplesForChorusReverb[bufferIndexR] = 0.0;
                    stereoBufferIndex += 2;
                    const combinedChorusL = sampleForChorusL + sampleForChorusReverbL;
                    const combinedChorusR = sampleForChorusR + sampleForChorusReverbR;
                    const chorusTap0Ratio = chorusTap0Index % 1;
                    const chorusTap1Ratio = chorusTap1Index % 1;
                    const chorusTap2Ratio = chorusTap2Index % 1;
                    const chorusTap3Ratio = chorusTap3Index % 1;
                    const chorusTap4Ratio = chorusTap4Index % 1;
                    const chorusTap5Ratio = chorusTap5Index % 1;
                    const chorusTap0A = chorusDelayLine[(chorusTap0Index) & 0x7FF];
                    const chorusTap0B = chorusDelayLine[(chorusTap0Index + 1) & 0x7FF];
                    const chorusTap1A = chorusDelayLine[(chorusTap1Index) & 0x7FF];
                    const chorusTap1B = chorusDelayLine[(chorusTap1Index + 1) & 0x7FF];
                    const chorusTap2A = chorusDelayLine[(chorusTap2Index) & 0x7FF];
                    const chorusTap2B = chorusDelayLine[(chorusTap2Index + 1) & 0x7FF];
                    const chorusTap3A = chorusDelayLine[(chorusTap3Index) & 0x7FF];
                    const chorusTap3B = chorusDelayLine[(chorusTap3Index + 1) & 0x7FF];
                    const chorusTap4A = chorusDelayLine[(chorusTap4Index) & 0x7FF];
                    const chorusTap4B = chorusDelayLine[(chorusTap4Index + 1) & 0x7FF];
                    const chorusTap5A = chorusDelayLine[(chorusTap5Index) & 0x7FF];
                    const chorusTap5B = chorusDelayLine[(chorusTap5Index + 1) & 0x7FF];
                    const chorusTap0 = chorusTap0A + (chorusTap0B - chorusTap0A) * chorusTap0Ratio;
                    const chorusTap1 = chorusTap1A + (chorusTap1B - chorusTap1A) * chorusTap1Ratio;
                    const chorusTap2 = chorusTap2A + (chorusTap2B - chorusTap2A) * chorusTap2Ratio;
                    const chorusTap3 = chorusTap3A + (chorusTap3B - chorusTap3A) * chorusTap3Ratio;
                    const chorusTap4 = chorusTap4A + (chorusTap4B - chorusTap4A) * chorusTap4Ratio;
                    const chorusTap5 = chorusTap5A + (chorusTap5B - chorusTap5A) * chorusTap5Ratio;
                    const chorusSampleL = 0.5 * (combinedChorusL - chorusTap0 + chorusTap1 - chorusTap2);
                    const chorusSampleR = 0.5 * (combinedChorusR - chorusTap3 + chorusTap4 - chorusTap5);
                    chorusDelayLine[chorusDelayPos] = combinedChorusL;
                    chorusDelayLine[(chorusDelayPos + 0x400) & 0x7FF] = combinedChorusR;
                    chorusDelayPos = (chorusDelayPos + 1) & 0x7FF;
                    chorusTap0Index += chorusTap0Delta;
                    chorusTap1Index += chorusTap1Delta;
                    chorusTap2Index += chorusTap2Delta;
                    chorusTap3Index += chorusTap3Delta;
                    chorusTap4Index += chorusTap4Delta;
                    chorusTap5Index += chorusTap5Delta;
                    const reverbDelayPos1 = (reverbDelayPos + 3041) & 0x3FFF;
                    const reverbDelayPos2 = (reverbDelayPos + 6426) & 0x3FFF;
                    const reverbDelayPos3 = (reverbDelayPos + 10907) & 0x3FFF;
                    const reverbSample0 = (reverbDelayLine[reverbDelayPos]);
                    const reverbSample1 = reverbDelayLine[reverbDelayPos1];
                    const reverbSample2 = reverbDelayLine[reverbDelayPos2];
                    const reverbSample3 = reverbDelayLine[reverbDelayPos3];
                    const reverbTemp0 = -(reverbSample0 + sampleForChorusReverbL + sampleForReverbL) + reverbSample1;
                    const reverbTemp1 = -(reverbSample0 + sampleForChorusReverbR + sampleForReverbR) - reverbSample1;
                    const reverbTemp2 = -reverbSample2 + reverbSample3;
                    const reverbTemp3 = -reverbSample2 - reverbSample3;
                    reverbFeedback0 += ((reverbTemp0 + reverbTemp2) * reverb - reverbFeedback0) * 0.5;
                    reverbFeedback1 += ((reverbTemp1 + reverbTemp3) * reverb - reverbFeedback1) * 0.5;
                    reverbFeedback2 += ((reverbTemp0 - reverbTemp2) * reverb - reverbFeedback2) * 0.5;
                    reverbFeedback3 += ((reverbTemp1 - reverbTemp3) * reverb - reverbFeedback3) * 0.5;
                    reverbDelayLine[reverbDelayPos1] = reverbFeedback0;
                    reverbDelayLine[reverbDelayPos2] = reverbFeedback1;
                    reverbDelayLine[reverbDelayPos3] = reverbFeedback2;
                    reverbDelayLine[reverbDelayPos] = reverbFeedback3;
                    reverbDelayPos = (reverbDelayPos + 1) & 0x3FFF;
                    const sampleL = masterGain * masterGain * (sampleForNoneL + chorusSampleL + sampleForReverbL + reverbSample1 + reverbSample2 + reverbSample3);
                    const sampleR = masterGain * masterGain * (sampleForNoneR + chorusSampleR + sampleForReverbR + reverbSample0 + reverbSample2 - reverbSample3);
                    const absL = sampleL < 0.0 ? -sampleL : sampleL;
                    const absR = sampleR < 0.0 ? -sampleR : sampleR;
                    const abs = absL > absR ? absL : absR;
                    this.song.inVolumeCap = (this.song.inVolumeCap > abs ? this.song.inVolumeCap : abs);
                    const limitRange = (+(abs > compressionThreshold)) + (+(abs > limitThreshold));
                    const limitTarget = (+(limitRange == 0)) * (((abs + 1 - compressionThreshold) * 0.8 + 0.25) * compressionRatio + 1.05 * (1 - compressionRatio))
                        + (+(limitRange == 1)) * (1.05)
                        + (+(limitRange == 2)) * (1.05 * ((abs + 1 - limitThreshold) * limitRatio + (1 - limitThreshold)));
                    limit += ((limitTarget - limit) * (limit < limitTarget ? limitRise : limitDecay));
                    const limitedVolume = volume / (limit >= 1 ? limit * 1.05 : limit * 0.8 + 0.25);
                    outputDataL[i] = sampleL * limitedVolume;
                    outputDataR[i] = sampleR * limitedVolume;
                    this.song.outVolumeCap = (this.song.outVolumeCap > abs * limitedVolume ? this.song.outVolumeCap : abs * limitedVolume);
                }
                bufferIndex += runLength;
                this.tickSampleCountdown -= runLength;
                if (this.tickSampleCountdown <= 0) {
                    for (let channel = 0; channel < this.song.pitchChannelCount + this.song.noiseChannelCount; channel++) {
                        for (let i = 0; i < this.releasedTones[channel].count(); i++) {
                            const tone = this.releasedTones[channel].get(i);
                            tone.ticksSinceReleased++;
                            const shouldFadeOutFast = (i + this.activeTones[channel].count() >= Config.maximumTonesPerChannel);
                            if (shouldFadeOutFast) {
                                this.freeReleasedTone(channel, i);
                                i--;
                            }
                        }
                    }
                    for (let channel = 0; channel < this.song.pitchChannelCount + this.song.noiseChannelCount; channel++) {
                        for (let instrumentIdx = 0; instrumentIdx < this.song.channels[channel].instruments.length; instrumentIdx++) {
                            let instrument = this.song.channels[channel].instruments[instrumentIdx];
                            let useArpeggioSpeed = instrument.arpeggioSpeed;
                            if (this.isModActive(ModSetting.mstArpeggioSpeed, false, channel, instrumentIdx)) {
                                useArpeggioSpeed = this.getModValue(ModSetting.mstArpeggioSpeed, false, channel, instrumentIdx, false);
                                if (Number.isInteger(useArpeggioSpeed)) {
                                    instrument.arpTime += Config.arpSpeedScale[useArpeggioSpeed];
                                }
                                else {
                                    instrument.arpTime += (1 - (useArpeggioSpeed % 1)) * Config.arpSpeedScale[Math.floor(useArpeggioSpeed)] + (useArpeggioSpeed % 1) * Config.arpSpeedScale[Math.ceil(useArpeggioSpeed)];
                                }
                            }
                            else {
                                instrument.arpTime += Config.arpSpeedScale[useArpeggioSpeed];
                            }
                        }
                    }
                    this.tick++;
                    this.tickSampleCountdown += samplesPerTick;
                    if (this.tick == Config.ticksPerPart) {
                        this.tick = 0;
                        this.part++;
                        this.liveInputDuration--;
                        var atEnd = this.part + this.beat * Config.partsPerBeat >= this.findPartsInBar(this.bar) - 1;
                        for (let channel = 0; channel < this.song.pitchChannelCount + this.song.noiseChannelCount; channel++) {
                            var carryOver = false;
                            var toneCount = this.activeTones[channel].count();
                            var pattern = this.song.getPattern(channel, this.bar);
                            if (pattern != null && atEnd) {
                                var instrument = pattern.instrument;
                                if (this.song.channels[channel].instruments[instrument].tieNoteTransition && toneCount > 0) {
                                    var targetBar = this.bar + 1;
                                    if (targetBar >= this.song.barCount || (targetBar >= this.song.loopStart + this.song.loopLength && this.loopRepeatCount != 0)) {
                                        targetBar = this.song.loopStart;
                                    }
                                    var nextPattern = this.song.getPattern(channel, targetBar);
                                    var currNote = this.activeTones[channel].get(0).note;
                                    if (currNote != null) {
                                        var pin = 0;
                                        while (currNote.pins[pin].time + currNote.start < this.part + this.beat * Config.partsPerBeat && pin < currNote.pins.length - 1)
                                            pin++;
                                        var currVolume = currNote.pins[pin].volume;
                                        var lastInterval = currNote.pins[pin].interval;
                                        if (nextPattern != null && nextPattern.instrument == instrument) {
                                            for (let i = 0; i < nextPattern.notes.length; i++) {
                                                if (nextPattern.notes[i].start == 0
                                                    && nextPattern.notes[i].pins[0].volume == currVolume
                                                    && nextPattern.notes[i].pitches.length == currNote.pitches.length) {
                                                    carryOver = true;
                                                    for (let j = 0; j < currNote.pitches.length; j++) {
                                                        if (nextPattern.notes[i].pitches.findIndex((p) => p == currNote.pitches[j] + lastInterval) == -1) {
                                                            carryOver = false;
                                                            j = currNote.pitches.length;
                                                        }
                                                    }
                                                    i = nextPattern.notes.length;
                                                    if (carryOver) {
                                                        if (this.part + this.beat * Config.partsPerBeat < this.findPartsInBar(this.bar)) {
                                                            if (this.tyingOver[channel] < 0) {
                                                                this.tyingOver[channel] = 0;
                                                            }
                                                        }
                                                        else if (currNote.start == 0 && this.tyingOver[channel] >= 0) {
                                                            this.tyingOver[channel] += this.part + this.beat * Config.partsPerBeat;
                                                        }
                                                        else {
                                                            this.tyingOver[channel] = this.part + this.beat * Config.partsPerBeat - currNote.start;
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            for (let i = 0; i < this.activeTones[channel].count(); i++) {
                                const tone = this.activeTones[channel].get(i);
                                const transition = tone.instrument.getTransition();
                                if (tone.note != null && tone.note.end == this.part + this.beat * Config.partsPerBeat) {
                                    if (!(transition.isSeamless || tone.instrument.clicklessTransition || this.tyingOver[channel] >= 0)) {
                                        if (transition.releases) {
                                            this.releaseTone(channel, tone);
                                        }
                                        else {
                                            this.freeTone(tone);
                                        }
                                        this.activeTones[channel].remove(i);
                                        i--;
                                    }
                                    if (!carryOver) {
                                        this.tyingOver[channel] = -1;
                                    }
                                }
                            }
                        }
                        for (let channel = 0; channel < this.song.modChannelCount; channel++) {
                            for (let mod = 0; mod < Config.modCount; mod++) {
                                for (let i = 0; i < this.activeModTones[channel][mod].count(); i++) {
                                    const tone = this.activeModTones[channel][mod].get(i);
                                    const transition = tone.instrument.getTransition();
                                    if (!transition.isSeamless && tone.note != null && tone.note.end == this.part + this.beat * Config.partsPerBeat) {
                                        this.freeTone(tone);
                                        this.activeModTones[channel][mod].remove(i);
                                        i--;
                                    }
                                }
                            }
                        }
                        if (this.part == Config.partsPerBeat) {
                            this.part = 0;
                            if (playSong) {
                                this.beat++;
                                if (this.beat == this.song.beatsPerBar) {
                                    this.beat = 0;
                                    this.bar++;
                                    if (this.loopRepeatCount != 0 && this.bar == this.song.loopStart + this.song.loopLength) {
                                        this.bar = this.song.loopStart;
                                        if (this.loopRepeatCount > 0)
                                            this.loopRepeatCount--;
                                    }
                                    if (this.bar >= this.song.barCount) {
                                        this.bar = 0;
                                        if (this.loopRepeatCount != -1) {
                                            ended = true;
                                            this.resetEffects();
                                            this.pause();
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                for (let setting = 0; setting < ModSetting.mstMaxValue; setting++) {
                    if (this.nextModValues != null && this.nextModValues[setting] != null)
                        this.modValues[setting] = this.nextModValues[setting];
                }
                if (this.isModActive(ModSetting.mstTempo, true)) {
                    samplesPerTick = this.getSamplesPerTick();
                    this.tickSampleCountdown = Math.min(this.tickSampleCountdown, samplesPerTick);
                }
                for (let channel = 0; channel < this.song.pitchChannelCount; channel++) {
                    for (let instrument of this.song.channels[channel].instruments) {
                        instrument.nextLFOtime = (instrument.nextLFOtime % (Config.vibratoTypes[instrument.vibratoType].period / (Config.ticksPerPart * samplesPerTick / this.samplesPerSecond)));
                        instrument.arpTime = (instrument.arpTime % (2520 * Config.ticksPerArpeggio));
                    }
                }
                for (let setting = 0; setting < ModSetting.mstMaxValue; setting++) {
                    for (let channel = 0; channel < channelCount; channel++) {
                        for (let instrument = 0; instrument < this.song.instrumentsPerChannel; instrument++) {
                            if (this.nextModInsValues != null && this.nextModInsValues[channel] != null && this.nextModInsValues[channel][instrument] != null && this.nextModInsValues[channel][instrument][setting] != null) {
                                this.modInsValues[channel][instrument][setting] = this.nextModInsValues[channel][instrument][setting];
                            }
                        }
                    }
                }
            }
            const epsilon = (1.0e-24);
            if (-epsilon < reverbFeedback0 && reverbFeedback0 < epsilon)
                reverbFeedback0 = 0.0;
            if (-epsilon < reverbFeedback1 && reverbFeedback1 < epsilon)
                reverbFeedback1 = 0.0;
            if (-epsilon < reverbFeedback2 && reverbFeedback2 < epsilon)
                reverbFeedback2 = 0.0;
            if (-epsilon < reverbFeedback3 && reverbFeedback3 < epsilon)
                reverbFeedback3 = 0.0;
            if (-epsilon < limit && limit < epsilon)
                limit = 0.0;
            this.stereoBufferIndex = (this.stereoBufferIndex + outputBufferLength * 2) % stereoBufferLength;
            this.chorusPhase = chorusPhase;
            this.chorusDelayPos = chorusDelayPos;
            this.reverbDelayPos = reverbDelayPos;
            this.reverbFeedback0 = reverbFeedback0;
            this.reverbFeedback1 = reverbFeedback1;
            this.reverbFeedback2 = reverbFeedback2;
            this.reverbFeedback3 = reverbFeedback3;
            this.limit = limit;
            if (playSong) {
                this.playheadInternal = (((this.tick + 1.0 - this.tickSampleCountdown / samplesPerTick) / 2.0 + this.part) / Config.partsPerBeat + this.beat) / this.song.beatsPerBar + this.bar;
            }
        }
        freeTone(tone) {
            this.tonePool.pushBack(tone);
        }
        newTone() {
            if (this.tonePool.count() > 0) {
                const tone = this.tonePool.popBack();
                tone.reset();
                tone.active = false;
                return tone;
            }
            return new Tone();
        }
        releaseTone(channel, tone) {
            if (this.song == null || !this.song.getChannelIsMod(channel)) {
                this.releasedTones[channel].pushFront(tone);
            }
        }
        freeReleasedTone(channel, toneIndex) {
            if (this.song == null || !this.song.getChannelIsMod(channel)) {
                this.freeTone(this.releasedTones[channel].get(toneIndex));
                this.releasedTones[channel].remove(toneIndex);
            }
        }
        freeAllTones() {
            while (this.liveInputTones.count() > 0) {
                this.freeTone(this.liveInputTones.popBack());
            }
            for (let i = 0; i < this.activeTones.length; i++) {
                while (this.activeTones[i].count() > 0) {
                    this.freeTone(this.activeTones[i].popBack());
                }
            }
            for (let i = 0; i < this.releasedTones.length; i++) {
                while (this.releasedTones[i].count() > 0) {
                    this.freeTone(this.releasedTones[i].popBack());
                }
            }
            for (let i = 0; i < this.activeModTones.length; i++) {
                for (let mod = 0; mod < this.activeModTones[i].length; mod++) {
                    while (this.activeModTones[i][mod].count() > 0) {
                        this.freeTone(this.activeModTones[i][mod].popBack());
                    }
                }
            }
        }
        determineLiveInputTones(song) {
            const toneList = this.liveInputTones;
            const pitches = this.liveInputPitches;
            let toneCount = 0;
            if (this.liveInputDuration > 0) {
                const instrument = song.channels[this.liveInputChannel].instruments[song.getPatternInstrument(this.liveInputChannel, this.bar)];
                if (instrument.getChord().arpeggiates) {
                    let tone;
                    if (toneList.count() == 0) {
                        tone = this.newTone();
                        toneList.pushBack(tone);
                    }
                    else if (!instrument.getTransition().isSeamless && this.liveInputStarted) {
                        this.releaseTone(this.liveInputChannel, toneList.popFront());
                        tone = this.newTone();
                        toneList.pushBack(tone);
                    }
                    else {
                        tone = toneList.get(0);
                    }
                    toneCount = 1;
                    for (let i = 0; i < pitches.length; i++) {
                        tone.pitches[i] = pitches[i];
                    }
                    tone.pitchCount = pitches.length;
                    tone.chordSize = 1;
                    tone.instrument = instrument;
                    tone.note = tone.prevNote = tone.nextNote = null;
                }
                else {
                    for (let i = 0; i < pitches.length; i++) {
                        let tone;
                        if (toneList.count() <= i) {
                            tone = this.newTone();
                            toneList.pushBack(tone);
                        }
                        else if (!instrument.getTransition().isSeamless && this.liveInputStarted) {
                            this.releaseTone(this.liveInputChannel, toneList.get(i));
                            tone = this.newTone();
                            toneList.set(i, tone);
                        }
                        else {
                            tone = toneList.get(i);
                        }
                        toneCount++;
                        tone.pitches[0] = pitches[i];
                        tone.pitchCount = 1;
                        tone.chordSize = pitches.length;
                        tone.instrument = instrument;
                        tone.note = tone.prevNote = tone.nextNote = null;
                    }
                }
            }
            while (toneList.count() > toneCount) {
                this.releaseTone(this.liveInputChannel, toneList.popBack());
            }
            this.liveInputStarted = false;
        }
        determineCurrentActiveTones(song, channel, playSong) {
            const instrument = song.channels[channel].instruments[song.getPatternInstrument(channel, this.bar)];
            const pattern = song.getPattern(channel, this.bar);
            const time = this.part + this.beat * Config.partsPerBeat;
            if (playSong && song.getChannelIsMod(channel) && !song.channels[channel].muted) {
                let modChannelIdx = channel - (song.pitchChannelCount + song.noiseChannelCount);
                let notes = [];
                let prevNotes = [];
                let nextNotes = [];
                let fillCount = Config.modCount;
                while (fillCount--) {
                    notes.push(null);
                    prevNotes.push(null);
                    nextNotes.push(null);
                }
                if (pattern != null) {
                    for (let i = 0; i < pattern.notes.length; i++) {
                        if (pattern.notes[i].end <= time) {
                            if (prevNotes[pattern.notes[i].pitches[0]] == null || pattern.notes[i].end > prevNotes[pattern.notes[i].pitches[0]].start) {
                                prevNotes[pattern.notes[i].pitches[0]] = pattern.notes[i];
                            }
                        }
                        else if (pattern.notes[i].start <= time && pattern.notes[i].end > time) {
                            notes[pattern.notes[i].pitches[0]] = pattern.notes[i];
                        }
                        else if (pattern.notes[i].start > time) {
                            if (nextNotes[pattern.notes[i].pitches[0]] == null || pattern.notes[i].start < nextNotes[pattern.notes[i].pitches[0]].start) {
                                nextNotes[pattern.notes[i].pitches[0]] = pattern.notes[i];
                            }
                        }
                    }
                }
                for (let mod = 0; mod < Config.modCount; mod++) {
                    const toneList = this.activeModTones[modChannelIdx][mod];
                    if (notes[mod] != null) {
                        if (prevNotes[mod] != null && prevNotes[mod].end != notes[mod].start)
                            prevNotes[mod] = null;
                        if (nextNotes[mod] != null && nextNotes[mod].start != notes[mod].end)
                            nextNotes[mod] = null;
                        this.syncTones(channel, toneList, instrument, notes[mod].pitches, notes[mod], prevNotes[mod], nextNotes[mod], time);
                    }
                    else {
                        while (toneList.count() > 0) {
                            this.freeTone(toneList.popBack());
                        }
                    }
                }
            }
            else if (!song.getChannelIsMod(channel)) {
                let note = null;
                let prevNote = null;
                let nextNote = null;
                if (playSong && pattern != null && !song.channels[channel].muted) {
                    for (let i = 0; i < pattern.notes.length; i++) {
                        if (pattern.notes[i].end <= time) {
                            prevNote = pattern.notes[i];
                        }
                        else if (pattern.notes[i].start <= time && pattern.notes[i].end > time) {
                            note = pattern.notes[i];
                        }
                        else if (pattern.notes[i].start > time) {
                            nextNote = pattern.notes[i];
                            break;
                        }
                    }
                }
                const toneList = this.activeTones[channel];
                if (note != null) {
                    if (prevNote != null && prevNote.end != note.start)
                        prevNote = null;
                    if (nextNote != null && nextNote.start != note.end)
                        nextNote = null;
                    this.syncTones(channel, toneList, instrument, note.pitches, note, prevNote, nextNote, time);
                }
                else {
                    while (toneList.count() > 0) {
                        if (toneList.peakBack().instrument.getTransition().releases && this.tyingOver[channel] < 0) {
                            this.releaseTone(channel, toneList.popBack());
                        }
                        else {
                            this.freeTone(toneList.popBack());
                        }
                    }
                }
            }
        }
        syncTones(channel, toneList, instrument, pitches, note, prevNote, nextNote, currentPart) {
            let toneCount = 0;
            if (instrument.getChord().arpeggiates) {
                let tone;
                if (toneList.count() == 0) {
                    tone = this.newTone();
                    toneList.pushBack(tone);
                }
                else {
                    tone = toneList.get(0);
                }
                toneCount = 1;
                for (let i = 0; i < pitches.length; i++) {
                    tone.pitches[i] = pitches[i];
                }
                tone.pitchCount = pitches.length;
                tone.chordSize = 1;
                tone.instrument = instrument;
                tone.note = note;
                tone.noteStart = note.start - Math.max(0, this.tyingOver[channel]);
                tone.noteEnd = note.end;
                tone.prevNote = prevNote;
                tone.nextNote = nextNote;
                tone.prevNotePitchIndex = 0;
                tone.nextNotePitchIndex = 0;
            }
            else {
                const transition = instrument.getTransition();
                for (let i = 0; i < pitches.length; i++) {
                    const strumOffsetParts = i * instrument.getChord().strumParts;
                    let prevNoteForThisTone = (prevNote && prevNote.pitches.length > i) ? prevNote : null;
                    let noteForThisTone = note;
                    let nextNoteForThisTone = (nextNote && nextNote.pitches.length > i) ? nextNote : null;
                    let noteStart = noteForThisTone.start + strumOffsetParts - Math.max(0, this.tyingOver[channel]);
                    if (noteStart > currentPart) {
                        if (toneList.count() > i && (transition.isSeamless || this.tyingOver[channel] >= 0) && prevNoteForThisTone != null) {
                            nextNoteForThisTone = noteForThisTone;
                            noteForThisTone = prevNoteForThisTone;
                            prevNoteForThisTone = null;
                            noteStart = noteForThisTone.start + strumOffsetParts - Math.max(0, this.tyingOver[channel]);
                        }
                        else {
                            break;
                        }
                    }
                    let noteEnd = noteForThisTone.end;
                    if ((transition.isSeamless || this.tyingOver[channel] >= 0) && nextNoteForThisTone != null) {
                        noteEnd = Math.min(Config.partsPerBeat * this.song.beatsPerBar, noteEnd + strumOffsetParts);
                    }
                    let tone;
                    if (toneList.count() <= i) {
                        tone = this.newTone();
                        toneList.pushBack(tone);
                    }
                    else {
                        tone = toneList.get(i);
                    }
                    toneCount++;
                    tone.pitches[0] = noteForThisTone.pitches[i];
                    tone.pitchCount = 1;
                    tone.chordSize = noteForThisTone.pitches.length;
                    tone.instrument = instrument;
                    tone.note = noteForThisTone;
                    tone.noteStart = noteStart;
                    tone.noteEnd = noteEnd;
                    tone.prevNote = prevNoteForThisTone;
                    tone.nextNote = nextNoteForThisTone;
                    tone.prevNotePitchIndex = i;
                    tone.nextNotePitchIndex = i;
                }
            }
            while (toneList.count() > toneCount) {
                if (toneList.peakBack().instrument.getTransition().releases && this.tyingOver[channel] < 0) {
                    this.releaseTone(channel, toneList.popBack());
                }
                else {
                    this.freeTone(toneList.popBack());
                }
            }
        }
        playTone(song, stereoBufferIndex, stereoBufferLength, channel, samplesPerTick, runLength, tone, released, shouldFadeOutFast) {
            Synth.computeTone(this, song, channel, samplesPerTick, runLength, tone, released, shouldFadeOutFast);
            let synthBuffer;
            switch (tone.instrument.effects) {
                case 0:
                    synthBuffer = this.samplesForNone;
                    break;
                case 1:
                    synthBuffer = this.samplesForReverb;
                    break;
                case 2:
                    synthBuffer = this.samplesForChorus;
                    break;
                case 3:
                    synthBuffer = this.samplesForChorusReverb;
                    break;
                default: throw new Error();
            }
            const synthesizer = Synth.getInstrumentSynthFunction(tone.instrument);
            synthesizer(this, synthBuffer, stereoBufferIndex, stereoBufferLength, runLength * 2, tone, tone.instrument);
        }
        static computeEnvelope(envelope, time, beats, customVolume) {
            switch (envelope.type) {
                case 0: return customVolume;
                case 1: return 1.0;
                case 4:
                    return 1.0 / (1.0 + time * envelope.speed);
                case 5:
                    return 1.0 - 1.0 / (1.0 + time * envelope.speed);
                case 6:
                    return 0.5 - Math.cos(beats * 2.0 * Math.PI * envelope.speed) * 0.5;
                case 7:
                    return 0.75 - Math.cos(beats * 2.0 * Math.PI * envelope.speed) * 0.25;
                case 2:
                    return Math.max(1.0, 2.0 - time * 10.0);
                case 3:
                    const speed = envelope.speed;
                    const attack = 0.25 / Math.sqrt(speed);
                    return time < attack ? time / attack : 1.0 / (1.0 + (time - attack) * speed);
                case 8:
                    return Math.pow(2, -envelope.speed * time);
                case 9:
                    let temp = 0.5 - Math.cos(beats * envelope.speed) * 0.5;
                    temp = 1.0 / (1.0 + time * (envelope.speed - (temp / (1.5 / envelope.speed))));
                    temp = temp > 0.0 ? temp : 0.0;
                    return temp;
                case 10:
                    return time < 8 / envelope.speed ? 1.0 : 0.0;
                case 11:
                    let lin = (1.0 - (time / (16 / envelope.speed)));
                    lin = lin > 0.0 ? lin : 0.0;
                    return lin;
                default: throw new Error("Unrecognized operator envelope type.");
            }
        }
        static computeChordVolume(chordSize) {
            return 1.0 / ((chordSize - 1) * 0.25 + 1.0);
        }
        static computeTone(synth, song, channel, samplesPerTick, runLength, tone, released, shouldFadeOutFast) {
            const instrument = tone.instrument;
            const transition = instrument.getTransition();
            const chord = instrument.getChord();
            const chordVolume = chord.arpeggiates ? 1 : Synth.computeChordVolume(tone.chordSize);
            const isNoiseChannel = song.getChannelIsNoise(channel);
            const intervalScale = isNoiseChannel ? Config.noiseInterval : 1;
            const secondsPerPart = Config.ticksPerPart * samplesPerTick / synth.samplesPerSecond;
            const beatsPerPart = 1.0 / Config.partsPerBeat;
            const toneWasActive = tone.active;
            const tickSampleCountdown = synth.tickSampleCountdown;
            const startRatio = 1.0 - (tickSampleCountdown) / samplesPerTick;
            const endRatio = 1.0 - (tickSampleCountdown - runLength) / samplesPerTick;
            const ticksIntoBar = (synth.beat * Config.partsPerBeat + synth.part) * Config.ticksPerPart + synth.tick;
            const partTimeTickStart = (ticksIntoBar) / Config.ticksPerPart;
            const partTimeTickEnd = (ticksIntoBar + 1) / Config.ticksPerPart;
            const partTimeStart = partTimeTickStart + (partTimeTickEnd - partTimeTickStart) * startRatio;
            const partTimeEnd = partTimeTickStart + (partTimeTickEnd - partTimeTickStart) * endRatio;
            const instrumentIdx = synth.song.channels[channel].instruments.findIndex(i => i == instrument);
            const treatAsSeamless = transition.isSeamless || synth.tyingOver[channel] >= 0;
            tone.phaseDeltaScale = 0.0;
            tone.filter = 1.0;
            tone.filterScale = 1.0;
            tone.vibratoScale = 0.0;
            tone.intervalMult = 1.0;
            tone.intervalVolumeMult = 1.0;
            tone.active = false;
            let startPan = instrument.pan;
            let endPan = instrument.pan;
            if (synth.isModActive(ModSetting.mstPan, false, channel, instrumentIdx)) {
                startPan = synth.getModValue(ModSetting.mstPan, false, channel, instrumentIdx, false);
                endPan = synth.getModValue(ModSetting.mstPan, false, channel, instrumentIdx, true);
            }
            let startPanDelay = instrument.panDelay;
            let endPanDelay = instrument.panDelay;
            if (synth.isModActive(ModSetting.mstPanDelay, false, channel, instrumentIdx)) {
                startPanDelay = synth.getModValue(ModSetting.mstPanDelay, false, channel, instrumentIdx, false);
                endPanDelay = synth.getModValue(ModSetting.mstPanDelay, false, channel, instrumentIdx, true);
            }
            const useStartPan = (startPan - Config.panCenter) / Config.panCenter;
            const useEndPan = (endPan - Config.panCenter) / Config.panCenter;
            const maxDelayStart = startPanDelay * 0.00013 * synth.samplesPerSecond;
            const maxDelayEnd = endPanDelay * 0.00013 * synth.samplesPerSecond;
            tone.stereoDelayStart = -useStartPan * maxDelayStart;
            const delayEnd = -useEndPan * maxDelayEnd;
            tone.stereoDelayDelta = (delayEnd - tone.stereoDelayStart) / runLength;
            tone.stereoVolumeLStart = Math.cos((1 + useStartPan) * Math.PI * 0.25) * 1.414;
            tone.stereoVolumeRStart = Math.cos((1 - useStartPan) * Math.PI * 0.25) * 1.414;
            const stereoVolumeLEnd = Math.cos((1 + useEndPan) * Math.PI * 0.25) * 1.414;
            const stereoVolumeREnd = Math.cos((1 - useEndPan) * Math.PI * 0.25) * 1.414;
            tone.stereoVolumeLDelta = (stereoVolumeLEnd - tone.stereoVolumeLStart) / runLength;
            tone.stereoVolumeRDelta = (stereoVolumeREnd - tone.stereoVolumeRStart) / runLength;
            let resetPhases = true;
            let partsSinceStart = 0.0;
            let intervalStart = 0.0;
            let intervalEnd = 0.0;
            let transitionVolumeStart = 1.0;
            let transitionVolumeEnd = 1.0;
            let chordVolumeStart = chordVolume;
            let chordVolumeEnd = chordVolume;
            let customVolumeStart = 0.0;
            let customVolumeEnd = 0.0;
            let decayTimeStart = 0.0;
            let decayTimeEnd = 0.0;
            let volumeReferencePitch;
            let basePitch;
            let baseVolume;
            let pitchDamping;
            if (instrument.type == 3) {
                if (isNoiseChannel) {
                    basePitch = Config.spectrumBasePitch;
                    baseVolume = 0.6;
                }
                else {
                    basePitch = Config.keys[song.key].basePitch;
                    baseVolume = 0.3;
                }
                volumeReferencePitch = Config.spectrumBasePitch;
                pitchDamping = 28;
            }
            else if (instrument.type == 4) {
                basePitch = Config.spectrumBasePitch;
                baseVolume = 0.45;
                volumeReferencePitch = basePitch;
                pitchDamping = 48;
            }
            else if (instrument.type == 2) {
                basePitch = Config.chipNoises[instrument.chipNoise].basePitch;
                baseVolume = 0.19;
                volumeReferencePitch = basePitch;
                pitchDamping = Config.chipNoises[instrument.chipNoise].isSoft ? 24.0 : 60.0;
            }
            else if (instrument.type == 1) {
                basePitch = Config.keys[song.key].basePitch;
                baseVolume = 0.03;
                volumeReferencePitch = 16;
                pitchDamping = 48;
            }
            else if (instrument.type == 0 || instrument.type == 7) {
                basePitch = Config.keys[song.key].basePitch;
                baseVolume = 0.03375;
                volumeReferencePitch = 16;
                pitchDamping = 48;
            }
            else if (instrument.type == 5) {
                basePitch = Config.keys[song.key].basePitch;
                baseVolume = 0.025;
                volumeReferencePitch = 16;
                pitchDamping = 48;
            }
            else if (instrument.type == 6) {
                basePitch = Config.keys[song.key].basePitch;
                baseVolume = 0.04725;
                volumeReferencePitch = 16;
                pitchDamping = 48;
            }
            else if (instrument.type == 8) {
                baseVolume = 1.0;
                volumeReferencePitch = 0;
                pitchDamping = 1.0;
                basePitch = 0;
            }
            else {
                throw new Error("Unknown instrument type in computeTone.");
            }
            for (let i = 0; i < Config.operatorCount; i++) {
                tone.phaseDeltas[i] = 0.0;
                tone.volumeStarts[i] = 0.0;
                tone.volumeDeltas[i] = 0.0;
            }
            if (released) {
                const ticksSoFar = tone.noteLengthTicks + tone.ticksSinceReleased;
                const startTicksSinceReleased = tone.ticksSinceReleased + startRatio;
                const endTicksSinceReleased = tone.ticksSinceReleased + endRatio;
                const startTick = tone.noteLengthTicks + startTicksSinceReleased;
                const endTick = tone.noteLengthTicks + endTicksSinceReleased;
                const toneTransition = tone.instrument.getTransition();
                resetPhases = false;
                partsSinceStart = Math.floor(ticksSoFar / Config.ticksPerPart);
                intervalStart = intervalEnd = tone.lastInterval;
                customVolumeStart = customVolumeEnd = Synth.expressionToVolumeMult(tone.lastVolume);
                transitionVolumeStart = Synth.expressionToVolumeMult((1.0 - startTicksSinceReleased / toneTransition.releaseTicks) * 6.0);
                transitionVolumeEnd = Synth.expressionToVolumeMult((1.0 - endTicksSinceReleased / toneTransition.releaseTicks) * 6.0);
                decayTimeStart = startTick / Config.ticksPerPart;
                decayTimeEnd = endTick / Config.ticksPerPart;
                if (shouldFadeOutFast) {
                    transitionVolumeStart *= 1.0 - startRatio;
                    transitionVolumeEnd *= 1.0 - endRatio;
                }
            }
            else if (tone.note == null) {
                transitionVolumeStart = transitionVolumeEnd = 1;
                customVolumeStart = customVolumeEnd = 1;
                tone.lastInterval = 0;
                tone.lastVolume = 6;
                tone.ticksSinceReleased = 0;
                resetPhases = false;
                const heldTicksStart = tone.liveInputSamplesHeld / samplesPerTick;
                tone.liveInputSamplesHeld += runLength;
                const heldTicksEnd = tone.liveInputSamplesHeld / samplesPerTick;
                tone.noteLengthTicks = heldTicksEnd;
                const heldPartsStart = heldTicksStart / Config.ticksPerPart;
                const heldPartsEnd = heldTicksEnd / Config.ticksPerPart;
                partsSinceStart = Math.floor(heldPartsStart);
                decayTimeStart = heldPartsStart;
                decayTimeEnd = heldPartsEnd;
            }
            else {
                const note = tone.note;
                const prevNote = tone.prevNote;
                const nextNote = tone.nextNote;
                const time = synth.part + synth.beat * Config.partsPerBeat;
                const partsPerBar = Config.partsPerBeat * song.beatsPerBar;
                const noteStart = tone.noteStart;
                const noteEnd = tone.noteEnd;
                partsSinceStart = time - noteStart;
                let endPinIndex;
                for (endPinIndex = 1; endPinIndex < note.pins.length - 1; endPinIndex++) {
                    if (note.pins[endPinIndex].time + note.start > time)
                        break;
                }
                const startPin = note.pins[endPinIndex - 1];
                const endPin = note.pins[endPinIndex];
                const noteStartTick = noteStart * Config.ticksPerPart;
                const noteEndTick = noteEnd * Config.ticksPerPart;
                const noteLengthTicks = noteEndTick - noteStartTick;
                const pinStart = (note.start + startPin.time) * Config.ticksPerPart;
                const pinEnd = (note.start + endPin.time) * Config.ticksPerPart;
                tone.lastInterval = note.pins[note.pins.length - 1].interval;
                tone.lastVolume = note.pins[note.pins.length - 1].volume;
                tone.ticksSinceReleased = 0;
                tone.noteLengthTicks = noteLengthTicks;
                const tickTimeStart = time * Config.ticksPerPart + synth.tick;
                const tickTimeEnd = time * Config.ticksPerPart + synth.tick + 1;
                const noteTicksPassedTickStart = tickTimeStart - noteStartTick;
                const noteTicksPassedTickEnd = tickTimeEnd - noteStartTick;
                const pinRatioStart = Math.min(1.0, (tickTimeStart - pinStart) / (pinEnd - pinStart));
                const pinRatioEnd = Math.min(1.0, (tickTimeEnd - pinStart) / (pinEnd - pinStart));
                let customVolumeTickStart = startPin.volume + (endPin.volume - startPin.volume) * pinRatioStart;
                let customVolumeTickEnd = startPin.volume + (endPin.volume - startPin.volume) * pinRatioEnd;
                let transitionVolumeTickStart = 1.0;
                let transitionVolumeTickEnd = 1.0;
                let chordVolumeTickStart = chordVolume;
                let chordVolumeTickEnd = chordVolume;
                let intervalTickStart = startPin.interval + (endPin.interval - startPin.interval) * pinRatioStart;
                let intervalTickEnd = startPin.interval + (endPin.interval - startPin.interval) * pinRatioEnd;
                let decayTimeTickStart = partTimeTickStart - noteStart;
                let decayTimeTickEnd = partTimeTickEnd - noteStart;
                resetPhases = (tickTimeStart + startRatio - noteStartTick == 0.0) || !toneWasActive;
                const maximumSlideTicks = noteLengthTicks * 0.5;
                if (treatAsSeamless && !transition.slides && note.start == 0) {
                    resetPhases = !toneWasActive;
                }
                else if (treatAsSeamless && prevNote != null) {
                    resetPhases = !toneWasActive;
                    if (transition.slides) {
                        const slideTicks = Math.min(maximumSlideTicks, transition.slideTicks);
                        const slideRatioStartTick = Math.max(0.0, 1.0 - noteTicksPassedTickStart / slideTicks);
                        const slideRatioEndTick = Math.max(0.0, 1.0 - noteTicksPassedTickEnd / slideTicks);
                        const intervalDiff = ((prevNote.pitches[tone.prevNotePitchIndex] + prevNote.pins[prevNote.pins.length - 1].interval) - tone.pitches[0]) * 0.5;
                        const volumeDiff = (prevNote.pins[prevNote.pins.length - 1].volume - note.pins[0].volume) * 0.5;
                        const decayTimeDiff = (prevNote.end - prevNote.start) * 0.5;
                        intervalTickStart += slideRatioStartTick * intervalDiff;
                        intervalTickEnd += slideRatioEndTick * intervalDiff;
                        customVolumeTickStart += slideRatioStartTick * volumeDiff;
                        customVolumeTickEnd += slideRatioEndTick * volumeDiff;
                        decayTimeTickStart += slideRatioStartTick * decayTimeDiff;
                        decayTimeTickEnd += slideRatioEndTick * decayTimeDiff;
                        if (!chord.arpeggiates) {
                            const chordSizeDiff = (prevNote.pitches.length - tone.chordSize) * 0.5;
                            chordVolumeTickStart = Synth.computeChordVolume(tone.chordSize + slideRatioStartTick * chordSizeDiff);
                            chordVolumeTickEnd = Synth.computeChordVolume(tone.chordSize + slideRatioEndTick * chordSizeDiff);
                        }
                    }
                }
                if (treatAsSeamless && !transition.slides && note.end == partsPerBar) ;
                else if (treatAsSeamless && nextNote != null) {
                    if (transition.slides) {
                        const slideTicks = Math.min(maximumSlideTicks, transition.slideTicks);
                        const slideRatioStartTick = Math.max(0.0, 1.0 - (noteLengthTicks - noteTicksPassedTickStart) / slideTicks);
                        const slideRatioEndTick = Math.max(0.0, 1.0 - (noteLengthTicks - noteTicksPassedTickEnd) / slideTicks);
                        const intervalDiff = (nextNote.pitches[tone.nextNotePitchIndex] - (tone.pitches[0] + note.pins[note.pins.length - 1].interval)) * 0.5;
                        const volumeDiff = (nextNote.pins[0].volume - note.pins[note.pins.length - 1].volume) * 0.5;
                        const decayTimeDiff = -(noteEnd - noteStart) * 0.5;
                        intervalTickStart += slideRatioStartTick * intervalDiff;
                        intervalTickEnd += slideRatioEndTick * intervalDiff;
                        customVolumeTickStart += slideRatioStartTick * volumeDiff;
                        customVolumeTickEnd += slideRatioEndTick * volumeDiff;
                        decayTimeTickStart += slideRatioStartTick * decayTimeDiff;
                        decayTimeTickEnd += slideRatioEndTick * decayTimeDiff;
                        if (!chord.arpeggiates) {
                            const chordSizeDiff = (nextNote.pitches.length - tone.chordSize) * 0.5;
                            chordVolumeTickStart = Synth.computeChordVolume(tone.chordSize + slideRatioStartTick * chordSizeDiff);
                            chordVolumeTickEnd = Synth.computeChordVolume(tone.chordSize + slideRatioEndTick * chordSizeDiff);
                        }
                    }
                }
                else if (!(transition.releases && synth.tyingOver[channel] < 0)) {
                    const releaseTicks = transition.releaseTicks;
                    if (releaseTicks > 0.0) {
                        transitionVolumeTickStart *= Math.min(1.0, (noteLengthTicks - noteTicksPassedTickStart) / releaseTicks);
                        transitionVolumeTickEnd *= Math.min(1.0, (noteLengthTicks - noteTicksPassedTickEnd) / releaseTicks);
                    }
                }
                intervalStart = intervalTickStart + (intervalTickEnd - intervalTickStart) * startRatio;
                intervalEnd = intervalTickStart + (intervalTickEnd - intervalTickStart) * endRatio;
                if (instrument.type != 8) {
                    customVolumeStart = Synth.expressionToVolumeMult(customVolumeTickStart + (customVolumeTickEnd - customVolumeTickStart) * startRatio);
                    customVolumeEnd = Synth.expressionToVolumeMult(customVolumeTickStart + (customVolumeTickEnd - customVolumeTickStart) * endRatio);
                }
                else {
                    customVolumeStart = customVolumeTickStart + (customVolumeTickEnd - customVolumeTickStart) * Math.max(0.0, startRatio);
                    customVolumeEnd = customVolumeTickStart + (customVolumeTickEnd - customVolumeTickStart) * Math.min(1.0, endRatio);
                    tone.customVolumeStart = customVolumeStart;
                    tone.customVolumeEnd = customVolumeEnd;
                }
                transitionVolumeStart = transitionVolumeTickStart + (transitionVolumeTickEnd - transitionVolumeTickStart) * startRatio;
                transitionVolumeEnd = transitionVolumeTickStart + (transitionVolumeTickEnd - transitionVolumeTickStart) * endRatio;
                chordVolumeStart = chordVolumeTickStart + (chordVolumeTickEnd - chordVolumeTickStart) * startRatio;
                chordVolumeEnd = chordVolumeTickStart + (chordVolumeTickEnd - chordVolumeTickStart) * endRatio;
                decayTimeStart = decayTimeTickStart + (decayTimeTickEnd - decayTimeTickStart) * startRatio;
                decayTimeEnd = decayTimeTickStart + (decayTimeTickEnd - decayTimeTickStart) * endRatio;
            }
            const sampleTime = 1.0 / synth.samplesPerSecond;
            tone.active = true;
            if (instrument.type == 0 || instrument.type == 1 || instrument.type == 5 || instrument.type == 6 || instrument.type == 7 || instrument.type == 3) {
                const lfoEffectStart = Synth.getLFOAmplitude(instrument, secondsPerPart * instrument.LFOtime);
                const lfoEffectEnd = Synth.getLFOAmplitude(instrument, secondsPerPart * instrument.nextLFOtime);
                let useVibratoStart = instrument.vibratoDepth;
                let useVibratoEnd = instrument.vibratoDepth;
                if (synth.isModActive(ModSetting.mstVibratoDepth, false, channel, instrumentIdx)) {
                    useVibratoStart = synth.getModValue(ModSetting.mstVibratoDepth, false, channel, instrumentIdx, false) / 25;
                    useVibratoEnd = synth.getModValue(ModSetting.mstVibratoDepth, false, channel, instrumentIdx, true) / 25;
                }
                let partsStart;
                let partsEnd;
                const activeVibratoDelayMods = synth.isModActive(ModSetting.mstVibratoDelay, false, channel, instrumentIdx);
                if (instrument.vibrato != Config.vibratos.length && !activeVibratoDelayMods) {
                    partsStart = Config.vibratos[instrument.vibrato].delayParts;
                    partsEnd = Config.vibratos[instrument.vibrato].delayParts;
                }
                else {
                    let vibratoDelayStart = instrument.vibratoDelay;
                    let vibratoDelayEnd = instrument.vibratoDelay;
                    if (activeVibratoDelayMods) {
                        vibratoDelayStart = synth.getModValue(ModSetting.mstVibratoDelay, false, channel, instrumentIdx, false);
                        vibratoDelayEnd = synth.getModValue(ModSetting.mstVibratoDelay, false, channel, instrumentIdx, true);
                        if (vibratoDelayStart == synth.song.mstMaxVols.get(ModSetting.mstVibratoDelay)) {
                            vibratoDelayStart = Number.MAX_VALUE;
                        }
                        if (vibratoDelayEnd == synth.song.mstMaxVols.get(ModSetting.mstVibratoDelay)) {
                            vibratoDelayEnd = Number.MAX_VALUE;
                        }
                    }
                    partsStart = vibratoDelayStart;
                    partsEnd = vibratoDelayEnd;
                }
                const vibratoScaleStart = (partsSinceStart < partsStart) ? 0.0 : useVibratoStart;
                const vibratoScaleEnd = (partsSinceStart < partsEnd) ? 0.0 : useVibratoEnd;
                const vibratoStart = vibratoScaleStart * lfoEffectStart;
                const vibratoEnd = vibratoScaleEnd * lfoEffectEnd;
                intervalStart += vibratoStart;
                intervalEnd += vibratoEnd;
            }
            if (!treatAsSeamless || (!(!transition.slides && tone.note != null && tone.note.start == 0) && !(tone.prevNote != null))) {
                const attackSeconds = transition.attackSeconds;
                if (attackSeconds > 0.0) {
                    transitionVolumeStart *= Math.min(1.0, secondsPerPart * decayTimeStart / attackSeconds);
                    transitionVolumeEnd *= Math.min(1.0, secondsPerPart * decayTimeEnd / attackSeconds);
                }
            }
            const instrumentVolumeMult = Synth.instrumentVolumeToVolumeMult(instrument.volume);
            if (instrument.type == 4) {
                tone.drumsetPitch = tone.pitches[0];
                if (tone.note != null)
                    tone.drumsetPitch += tone.note.pickMainInterval();
                tone.drumsetPitch = Math.max(0, Math.min(Config.drumCount - 1, tone.drumsetPitch));
            }
            let filterCutModStart = instrument.filterCutoff;
            let filterCutModEnd = instrument.filterCutoff;
            if (synth.isModActive(ModSetting.mstFilterCut, false, channel, instrumentIdx)) {
                filterCutModStart = song.modValueToReal(synth.getModValue(ModSetting.mstFilterCut, false, channel, instrumentIdx, false), ModSetting.mstFilterCut);
                filterCutModEnd = song.modValueToReal(synth.getModValue(ModSetting.mstFilterCut, false, channel, instrumentIdx, true), ModSetting.mstFilterCut);
            }
            let cutoffOctavesModStart;
            let cutoffOctavesModEnd;
            if (instrument.type == 4) {
                cutoffOctavesModStart = 0;
                cutoffOctavesModEnd = 0;
            }
            else {
                cutoffOctavesModStart = (filterCutModStart - (Config.filterCutoffRange - 1)) * 0.5;
                cutoffOctavesModEnd = (filterCutModEnd - (Config.filterCutoffRange - 1)) * 0.5;
            }
            const filterEnvelope = (instrument.type == 4) ? instrument.getDrumsetEnvelope(tone.drumsetPitch) : instrument.getFilterEnvelope();
            const filterCutoffHzStart = Config.filterCutoffMaxHz * Math.pow(2.0, cutoffOctavesModStart);
            const filterCutoffHzEnd = Config.filterCutoffMaxHz * Math.pow(2.0, cutoffOctavesModEnd);
            const filterBaseStart = 2.0 * Math.sin(Math.PI * filterCutoffHzStart / synth.samplesPerSecond);
            const filterBaseEnd = 2.0 * Math.sin(Math.PI * filterCutoffHzEnd / synth.samplesPerSecond);
            const filterMin = 2.0 * Math.sin(Math.PI * Config.filterCutoffMinHz / synth.samplesPerSecond);
            tone.filter = filterBaseStart * Synth.computeEnvelope(filterEnvelope, secondsPerPart * decayTimeStart, beatsPerPart * partTimeStart, customVolumeStart);
            let endFilter = filterBaseEnd * Synth.computeEnvelope(filterEnvelope, secondsPerPart * decayTimeEnd, beatsPerPart * partTimeEnd, customVolumeEnd);
            tone.filter = Math.min(Config.filterMax, Math.max(filterMin, tone.filter));
            endFilter = Math.min(Config.filterMax, Math.max(filterMin, endFilter));
            tone.filterScale = Math.pow(endFilter / tone.filter, 1.0 / runLength);
            let filterVolumeStart = Math.pow(0.5, cutoffOctavesModStart * 0.35);
            let filterVolumeEnd = Math.pow(0.5, cutoffOctavesModEnd * 0.35);
            tone.filterResonanceStart = instrument.getFilterResonance();
            tone.filterResonanceDelta = 0.0;
            let useFilterResonanceStart = instrument.filterResonance;
            let useFilterResonanceEnd = instrument.filterResonance;
            tone.isFirstOrder = (instrument.type == 4) ? false : (useFilterResonanceStart == 0);
            if (synth.isModActive(ModSetting.mstFilterPeak, false, channel, instrumentIdx)) {
                tone.isFirstOrder = false;
                useFilterResonanceStart = song.modValueToReal(synth.getModValue(ModSetting.mstFilterPeak, false, channel, instrumentIdx, false), ModSetting.mstFilterPeak);
                useFilterResonanceEnd = song.modValueToReal(synth.getModValue(ModSetting.mstFilterPeak, false, channel, instrumentIdx, true), ModSetting.mstFilterPeak);
                tone.filterResonanceStart = Config.filterMaxResonance * Math.pow(Math.max(0, useFilterResonanceStart - 1) / (Config.filterResonanceRange - 2), 0.5);
                const filterResonanceEnd = Config.filterMaxResonance * Math.pow(Math.max(0, useFilterResonanceEnd - 1) / (Config.filterResonanceRange - 2), 0.5);
                tone.filterResonanceDelta = (filterResonanceEnd - tone.filterResonanceStart) / runLength;
            }
            else {
                tone.filterResonanceStart = Config.filterMaxResonance * Math.pow(Math.max(0, useFilterResonanceStart - 1) / (Config.filterResonanceRange - 2), 0.5);
            }
            if (tone.isFirstOrder == false) {
                filterVolumeStart = Math.pow(filterVolumeStart, 1.7) * Math.pow(0.5, 0.125 * (useFilterResonanceStart - 1));
                filterVolumeEnd = Math.pow(filterVolumeEnd, 1.7) * Math.pow(0.5, 0.125 * (useFilterResonanceEnd - 1));
            }
            if (filterEnvelope.type == 8) {
                filterVolumeStart *= (1.25 + .025 * filterEnvelope.speed);
                filterVolumeEnd *= (1.25 + .025 * filterEnvelope.speed);
            }
            else if (filterEnvelope.type == 4) {
                filterVolumeStart *= (1 + .02 * filterEnvelope.speed);
                filterVolumeEnd *= (1 + .02 * filterEnvelope.speed);
            }
            if (resetPhases) {
                tone.reset();
            }
            if (instrument.type == 1) {
                let sineVolumeBoostStart = 1.0;
                let sineVolumeBoostEnd = 1.0;
                let totalCarrierVolumeStart = 0.0;
                let totalCarrierVolumeEnd = 0.0;
                let arpeggioInterval = 0;
                if (tone.pitchCount > 1 && !chord.harmonizes) {
                    const arpeggio = Math.floor((instrument.arpTime) / Config.ticksPerArpeggio);
                    arpeggioInterval = tone.pitches[getArpeggioPitchIndex(tone.pitchCount, instrument.fastTwoNoteArp, arpeggio)] - tone.pitches[0];
                }
                let detuneStart = instrument.detune / 25;
                let detuneEnd = instrument.detune / 25;
                if (synth.isModActive(ModSetting.mstDetune, false, channel, instrumentIdx)) {
                    detuneStart = synth.getModValue(ModSetting.mstDetune, false, channel, instrumentIdx, false) / 25;
                    detuneEnd = synth.getModValue(ModSetting.mstDetune, false, channel, instrumentIdx, true) / 25;
                }
                if (synth.isModActive(ModSetting.mstSongDetune, true)) {
                    detuneStart += synth.getModValue(ModSetting.mstSongDetune, true, null, null, false) / 25;
                    detuneEnd += synth.getModValue(ModSetting.mstSongDetune, true, null, null, true) / 25;
                }
                const carrierCount = Config.algorithms[instrument.algorithm].carrierCount;
                for (let i = 0; i < Config.operatorCount; i++) {
                    const associatedCarrierIndex = Config.algorithms[instrument.algorithm].associatedCarrier[i] - 1;
                    const pitch = tone.pitches[!chord.harmonizes ? 0 : ((i < tone.pitchCount) ? i : ((associatedCarrierIndex < tone.pitchCount) ? associatedCarrierIndex : 0))];
                    const freqMult = Config.operatorFrequencies[instrument.operators[i].frequency].mult;
                    const interval = Config.operatorCarrierInterval[associatedCarrierIndex] + arpeggioInterval;
                    const startPitch = basePitch + (pitch + intervalStart + detuneStart) * intervalScale + interval;
                    const startFreq = freqMult * (Instrument.frequencyFromPitch(startPitch)) + Config.operatorFrequencies[instrument.operators[i].frequency].hzOffset;
                    tone.phaseDeltas[i] = startFreq * sampleTime * Config.sineWaveLength;
                    let amplitudeStart = instrument.operators[i].amplitude;
                    let amplitudeEnd = instrument.operators[i].amplitude;
                    if (synth.isModActive(ModSetting.mstFMSlider1 + i, false, channel, instrumentIdx)) {
                        amplitudeStart *= synth.getModValue(ModSetting.mstFMSlider1 + i, false, channel, instrumentIdx, false) / 15.0;
                        amplitudeEnd *= synth.getModValue(ModSetting.mstFMSlider1 + i, false, channel, instrumentIdx, true) / 15.0;
                    }
                    const amplitudeCurveStart = Synth.operatorAmplitudeCurve(amplitudeStart);
                    const amplitudeCurveEnd = Synth.operatorAmplitudeCurve(amplitudeEnd);
                    const amplitudeMultStart = amplitudeCurveStart * Config.operatorFrequencies[instrument.operators[i].frequency].amplitudeSign;
                    const amplitudeMultEnd = amplitudeCurveEnd * Config.operatorFrequencies[instrument.operators[i].frequency].amplitudeSign;
                    let volumeStart = amplitudeMultStart;
                    let volumeEnd = amplitudeMultEnd;
                    if (synth.isModActive(ModSetting.mstInsVolume, false, channel, instrumentIdx)) {
                        const startVal = synth.getModValue(ModSetting.mstInsVolume, false, channel, instrumentIdx, false);
                        const endVal = synth.getModValue(ModSetting.mstInsVolume, false, channel, instrumentIdx, true);
                        volumeStart *= ((startVal <= 0) ? ((startVal + Config.volumeRange / 2) / (Config.volumeRange / 2)) : this.instrumentVolumeToVolumeMult(startVal));
                        volumeEnd *= ((endVal <= 0) ? ((endVal + Config.volumeRange / 2) / (Config.volumeRange / 2)) : this.instrumentVolumeToVolumeMult(endVal));
                    }
                    if (synth.isModActive(ModSetting.mstSongVolume, true)) {
                        volumeStart *= (synth.getModValue(ModSetting.mstSongVolume, true, undefined, undefined, false)) / 100.0;
                        volumeEnd *= (synth.getModValue(ModSetting.mstSongVolume, true, undefined, undefined, true)) / 100.0;
                    }
                    if (i < carrierCount) {
                        const endPitch = basePitch + (pitch + intervalEnd + detuneEnd) * intervalScale + interval;
                        const pitchVolumeStart = Math.pow(2.0, -(startPitch - volumeReferencePitch) / pitchDamping);
                        const pitchVolumeEnd = Math.pow(2.0, -(endPitch - volumeReferencePitch) / pitchDamping);
                        volumeStart *= pitchVolumeStart;
                        volumeEnd *= pitchVolumeEnd;
                        totalCarrierVolumeStart += amplitudeCurveStart;
                        totalCarrierVolumeEnd += amplitudeCurveEnd;
                    }
                    else {
                        volumeStart *= Config.sineWaveLength * 1.5;
                        volumeEnd *= Config.sineWaveLength * 1.5;
                        sineVolumeBoostStart *= 1.0 - Math.min(1.0, amplitudeStart / 15);
                        sineVolumeBoostEnd *= 1.0 - Math.min(1.0, amplitudeEnd / 15);
                    }
                    const operatorEnvelope = Config.envelopes[instrument.operators[i].envelope];
                    volumeStart *= Synth.computeEnvelope(operatorEnvelope, secondsPerPart * decayTimeStart, beatsPerPart * partTimeStart, customVolumeStart);
                    volumeEnd *= Synth.computeEnvelope(operatorEnvelope, secondsPerPart * decayTimeEnd, beatsPerPart * partTimeEnd, customVolumeEnd);
                    tone.volumeStarts[i] = volumeStart;
                    tone.volumeDeltas[i] = (volumeEnd - volumeStart) / runLength;
                }
                let useFeedbackAmplitudeStart = instrument.feedbackAmplitude;
                let useFeedbackAmplitudeEnd = instrument.feedbackAmplitude;
                if (synth.isModActive(ModSetting.mstFMFeedback, false, channel, instrumentIdx)) {
                    useFeedbackAmplitudeStart *= synth.getModValue(ModSetting.mstFMFeedback, false, channel, instrumentIdx, false) / 15.0;
                    useFeedbackAmplitudeEnd *= synth.getModValue(ModSetting.mstFMFeedback, false, channel, instrumentIdx, true) / 15.0;
                }
                const feedbackAmplitudeStart = Config.sineWaveLength * 0.3 * useFeedbackAmplitudeStart / 15.0;
                const feedbackAmplitudeEnd = Config.sineWaveLength * 0.3 * useFeedbackAmplitudeEnd / 15.0;
                const feedbackEnvelope = Config.envelopes[instrument.feedbackEnvelope];
                let feedbackStart = feedbackAmplitudeStart * Synth.computeEnvelope(feedbackEnvelope, secondsPerPart * decayTimeStart, beatsPerPart * partTimeStart, customVolumeStart);
                let feedbackEnd = feedbackAmplitudeEnd * Synth.computeEnvelope(feedbackEnvelope, secondsPerPart * decayTimeEnd, beatsPerPart * partTimeEnd, customVolumeEnd);
                tone.feedbackMult = feedbackStart;
                tone.feedbackDelta = (feedbackEnd - tone.feedbackMult) / runLength;
                const volumeMult = baseVolume * instrumentVolumeMult;
                tone.volumeStart = filterVolumeStart * volumeMult * transitionVolumeStart * chordVolumeStart;
                const volumeEnd = filterVolumeEnd * volumeMult * transitionVolumeEnd * chordVolumeEnd;
                tone.volumeDelta = (volumeEnd - tone.volumeStart) / runLength;
                sineVolumeBoostStart *= (Math.pow(2.0, (2.0 - 1.4 * useFeedbackAmplitudeStart / 15.0)) - 1.0) / 3.0;
                sineVolumeBoostEnd *= (Math.pow(2.0, (2.0 - 1.4 * useFeedbackAmplitudeEnd / 15.0)) - 1.0) / 3.0;
                sineVolumeBoostStart *= 1.0 - Math.min(1.0, Math.max(0.0, totalCarrierVolumeStart - 1) / 2.0);
                sineVolumeBoostEnd *= 1.0 - Math.min(1.0, Math.max(0.0, totalCarrierVolumeEnd - 1) / 2.0);
                tone.volumeStart *= 1.0 + sineVolumeBoostStart * 3.0;
                tone.volumeDelta *= 1.0 + (sineVolumeBoostStart + sineVolumeBoostEnd) * 1.5;
            }
            else if (instrument.type == 8) {
                tone.volumeStart = transitionVolumeStart;
                let volumeEnd = transitionVolumeEnd;
                tone.volumeStart *= customVolumeStart;
                volumeEnd *= customVolumeEnd;
                tone.volumeDelta = (volumeEnd - tone.volumeStart) / runLength;
            }
            else {
                let detuneStart = instrument.detune / 25;
                let detuneEnd = instrument.detune / 25;
                if (synth.isModActive(ModSetting.mstDetune, false, channel, instrumentIdx)) {
                    detuneStart = synth.getModValue(ModSetting.mstDetune, false, channel, instrumentIdx, false) / 25;
                    detuneEnd = synth.getModValue(ModSetting.mstDetune, false, channel, instrumentIdx, true) / 25;
                }
                if (synth.isModActive(ModSetting.mstSongDetune, true)) {
                    detuneStart += synth.getModValue(ModSetting.mstSongDetune, true, null, null, false) / 25;
                    detuneEnd += synth.getModValue(ModSetting.mstSongDetune, true, null, null, true) / 25;
                }
                let pitch = tone.pitches[0];
                if (tone.pitchCount > 1) {
                    const arpeggio = Math.floor(instrument.arpTime / Config.ticksPerArpeggio);
                    if (chord.harmonizes) {
                        const intervalOffset = tone.pitches[1 + getArpeggioPitchIndex(tone.pitchCount - 1, instrument.fastTwoNoteArp, arpeggio)] - tone.pitches[0];
                        tone.intervalMult = Math.pow(2.0, intervalOffset / 12.0);
                        tone.intervalVolumeMult = Math.pow(2.0, -intervalOffset / pitchDamping);
                    }
                    else {
                        pitch = tone.pitches[getArpeggioPitchIndex(tone.pitchCount, instrument.fastTwoNoteArp, arpeggio)];
                    }
                }
                const startPitch = basePitch + (pitch + intervalStart + detuneStart) * intervalScale;
                const endPitch = basePitch + (pitch + intervalEnd + detuneEnd) * intervalScale;
                const startFreq = Instrument.frequencyFromPitch(startPitch);
                const pitchVolumeStart = Math.pow(2.0, -(startPitch - volumeReferencePitch) / pitchDamping);
                const pitchVolumeEnd = Math.pow(2.0, -(endPitch - volumeReferencePitch) / pitchDamping);
                let settingsVolumeMultStart = baseVolume * filterVolumeStart;
                let settingsVolumeMultEnd = baseVolume * filterVolumeEnd;
                if (instrument.type == 2) {
                    settingsVolumeMultStart *= Config.chipNoises[instrument.chipNoise].volume;
                    settingsVolumeMultEnd *= Config.chipNoises[instrument.chipNoise].volume;
                }
                if (instrument.type == 0 || instrument.type == 7) {
                    settingsVolumeMultStart *= Config.chipWaves[instrument.chipWave].volume;
                    settingsVolumeMultEnd *= Config.chipWaves[instrument.chipWave].volume;
                }
                if (instrument.type == 0 || instrument.type == 5 || instrument.type == 7) {
                    settingsVolumeMultStart *= Config.intervals[instrument.interval].volume;
                    settingsVolumeMultEnd *= Config.intervals[instrument.interval].volume;
                }
                if (instrument.type == 6) {
                    let pulseWidthModStart = instrument.pulseWidth / (Config.pulseWidthRange * 2);
                    let pulseWidthModEnd = instrument.pulseWidth / (Config.pulseWidthRange * 2);
                    if (synth.isModActive(ModSetting.mstPulseWidth, false, channel, instrumentIdx)) {
                        pulseWidthModStart = (synth.getModValue(ModSetting.mstPulseWidth, false, channel, instrumentIdx, false)) / (Config.pulseWidthRange * 2);
                        pulseWidthModEnd = (synth.getModValue(ModSetting.mstPulseWidth, false, channel, instrumentIdx, true)) / (Config.pulseWidthRange * 2);
                    }
                    const pulseEnvelope = Config.envelopes[instrument.pulseEnvelope];
                    const pulseWidthStart = pulseWidthModStart * Synth.computeEnvelope(pulseEnvelope, secondsPerPart * decayTimeStart, beatsPerPart * partTimeStart, customVolumeStart);
                    const pulseWidthEnd = pulseWidthModEnd * Synth.computeEnvelope(pulseEnvelope, secondsPerPart * decayTimeEnd, beatsPerPart * partTimeEnd, customVolumeEnd);
                    tone.pulseWidth = pulseWidthStart;
                    tone.pulseWidthDelta = (pulseWidthEnd - pulseWidthStart) / runLength;
                }
                tone.phaseDeltas[0] = startFreq * sampleTime;
                tone.volumeStart = transitionVolumeStart * chordVolumeStart * pitchVolumeStart * settingsVolumeMultStart * instrumentVolumeMult;
                let volumeEnd = transitionVolumeEnd * chordVolumeEnd * pitchVolumeEnd * settingsVolumeMultEnd * instrumentVolumeMult;
                if (filterEnvelope.type != 0 && (instrument.type != 6 || Config.envelopes[instrument.pulseEnvelope].type != 0)) {
                    tone.volumeStart *= customVolumeStart;
                    volumeEnd *= customVolumeEnd;
                }
                if (synth.isModActive(ModSetting.mstInsVolume, false, channel, instrumentIdx)) {
                    const startVal = synth.getModValue(ModSetting.mstInsVolume, false, channel, instrumentIdx, false);
                    const endVal = synth.getModValue(ModSetting.mstInsVolume, false, channel, instrumentIdx, true);
                    tone.volumeStart *= ((startVal <= 0) ? ((startVal + Config.volumeRange / 2) / (Config.volumeRange / 2)) : this.instrumentVolumeToVolumeMult(startVal));
                    volumeEnd *= ((endVal <= 0) ? ((endVal + Config.volumeRange / 2) / (Config.volumeRange / 2)) : this.instrumentVolumeToVolumeMult(endVal));
                }
                if (synth.isModActive(ModSetting.mstSongVolume, true)) {
                    tone.volumeStart *= (synth.getModValue(ModSetting.mstSongVolume, true, undefined, undefined, false)) / 100.0;
                    volumeEnd *= (synth.getModValue(ModSetting.mstSongVolume, true, undefined, undefined, true)) / 100.0;
                }
                tone.volumeDelta = (volumeEnd - tone.volumeStart) / runLength;
            }
            tone.phaseDeltaScale = Math.pow(2.0, ((intervalEnd - intervalStart) * intervalScale / 12.0) / runLength);
        }
        static getLFOAmplitude(instrument, secondsIntoBar) {
            let effect = 0;
            for (const vibratoPeriodSeconds of Config.vibratoTypes[instrument.vibratoType].periodsSeconds) {
                effect += Math.sin(Math.PI * 2 * secondsIntoBar / vibratoPeriodSeconds);
            }
            return effect;
        }
        static getInstrumentSynthFunction(instrument) {
            if (instrument.type == 1) {
                const fingerprint = instrument.algorithm + "_" + instrument.feedbackType;
                if (Synth.fmSynthFunctionCache[fingerprint] == undefined) {
                    const synthSource = [];
                    for (const line of Synth.fmSourceTemplate) {
                        if (line.indexOf("// CARRIER OUTPUTS") != -1) {
                            const outputs = [];
                            for (let j = 0; j < Config.algorithms[instrument.algorithm].carrierCount; j++) {
                                outputs.push("operator" + j + "Scaled");
                            }
                            synthSource.push(line.replace("/*operator#Scaled*/", outputs.join(" + ")));
                        }
                        else if (line.indexOf("// INSERT OPERATOR COMPUTATION HERE") != -1) {
                            for (let j = Config.operatorCount - 1; j >= 0; j--) {
                                for (const operatorLine of Synth.operatorSourceTemplate) {
                                    if (operatorLine.indexOf("/* + operator@Scaled*/") != -1) {
                                        let modulators = "";
                                        for (const modulatorNumber of Config.algorithms[instrument.algorithm].modulatedBy[j]) {
                                            modulators += " + operator" + (modulatorNumber - 1) + "Scaled";
                                        }
                                        const feedbackIndices = Config.feedbacks[instrument.feedbackType].indices[j];
                                        if (feedbackIndices.length > 0) {
                                            modulators += " + feedbackMult * (";
                                            const feedbacks = [];
                                            for (const modulatorNumber of feedbackIndices) {
                                                feedbacks.push("operator" + (modulatorNumber - 1) + "Output");
                                            }
                                            modulators += feedbacks.join(" + ") + ")";
                                        }
                                        synthSource.push(operatorLine.replace(/\#/g, j + "").replace("/* + operator@Scaled*/", modulators));
                                    }
                                    else {
                                        synthSource.push(operatorLine.replace(/\#/g, j + ""));
                                    }
                                }
                            }
                        }
                        else if (line.indexOf("#") != -1) {
                            for (let j = 0; j < Config.operatorCount; j++) {
                                synthSource.push(line.replace(/\#/g, j + ""));
                            }
                        }
                        else {
                            synthSource.push(line);
                        }
                    }
                    Synth.fmSynthFunctionCache[fingerprint] = new Function("synth", "data", "stereoBufferIndex", "stereoBufferLength", "runLength", "tone", "instrument", synthSource.join("\n"));
                }
                return Synth.fmSynthFunctionCache[fingerprint];
            }
            else if (instrument.type == 0) {
                return Synth.chipSynth;
            }
            else if (instrument.type == 7) {
                return Synth.chipSynth;
            }
            else if (instrument.type == 5) {
                return Synth.harmonicsSynth;
            }
            else if (instrument.type == 6) {
                return Synth.pulseWidthSynth;
            }
            else if (instrument.type == 2) {
                return Synth.noiseSynth;
            }
            else if (instrument.type == 3) {
                return Synth.spectrumSynth;
            }
            else if (instrument.type == 4) {
                return Synth.drumsetSynth;
            }
            else if (instrument.type == 8) {
                return Synth.modSynth;
            }
            else {
                throw new Error("Unrecognized instrument type: " + instrument.type);
            }
        }
        static chipSynth(synth, data, stereoBufferIndex, stereoBufferLength, runLength, tone, instrument) {
            var wave;
            var volumeScale;
            const isCustomWave = (instrument.type == 7);
            if (!isCustomWave) {
                wave = Config.chipWaves[instrument.chipWave].samples;
                volumeScale = 1.0;
            }
            else {
                wave = instrument.customChipWaveIntegral;
                volumeScale = 0.1;
            }
            const waveLength = +wave.length - 1;
            const intervalA = +Math.pow(2.0, (Config.intervals[instrument.interval].offset + Config.intervals[instrument.interval].spread) / 12.0);
            const intervalB = Math.pow(2.0, (Config.intervals[instrument.interval].offset - Config.intervals[instrument.interval].spread) / 12.0) * tone.intervalMult;
            const intervalSign = tone.intervalVolumeMult * Config.intervals[instrument.interval].sign;
            if (instrument.interval == 0 && !instrument.getChord().customInterval)
                tone.phases[1] = tone.phases[0];
            const deltaRatio = intervalB / intervalA;
            let phaseDeltaA = tone.phaseDeltas[0] * intervalA * waveLength;
            let phaseDeltaB = phaseDeltaA * deltaRatio;
            const phaseDeltaScale = +tone.phaseDeltaScale;
            let volume = +tone.volumeStart;
            const volumeDelta = +tone.volumeDelta;
            let phaseA = (tone.phases[0] % 1) * waveLength;
            let phaseB = (tone.phases[1] % 1) * waveLength;
            const isFirstOrder = tone.isFirstOrder;
            let filter1 = +tone.filter;
            let filter2 = isFirstOrder ? 1.0 : filter1;
            const filterScale1 = +tone.filterScale;
            const filterScale2 = isFirstOrder ? 1.0 : filterScale1;
            let filterResonance = tone.filterResonanceStart;
            let filterResonanceDelta = tone.filterResonanceDelta;
            let filterSample0 = +tone.filterSample0;
            let filterSample1 = +tone.filterSample1;
            const phaseAInt = phaseA | 0;
            const phaseBInt = phaseB | 0;
            const indexA = phaseAInt % waveLength;
            const indexB = phaseBInt % waveLength;
            const phaseRatioA = phaseA - phaseAInt;
            const phaseRatioB = phaseB - phaseBInt;
            let prevWaveIntegralA = wave[indexA];
            let prevWaveIntegralB = wave[indexB];
            prevWaveIntegralA += (wave[indexA + 1] - prevWaveIntegralA) * phaseRatioA;
            prevWaveIntegralB += (wave[indexB + 1] - prevWaveIntegralB) * phaseRatioB;
            const stopIndex = stereoBufferIndex + runLength;
            stereoBufferIndex += tone.stereoOffset;
            let stereoVolumeL = tone.stereoVolumeLStart;
            let stereoVolumeLDelta = tone.stereoVolumeLDelta;
            let stereoVolumeR = tone.stereoVolumeRStart;
            let stereoVolumeRDelta = tone.stereoVolumeRDelta;
            let stereoDelay = tone.stereoDelayStart;
            let stereoDelayDelta = tone.stereoDelayDelta;
            let delays;
            while (stereoBufferIndex < stopIndex) {
                phaseA += phaseDeltaA;
                phaseB += phaseDeltaB;
                const phaseAInt = phaseA | 0;
                const phaseBInt = phaseB | 0;
                const indexA = phaseAInt % waveLength;
                const indexB = phaseBInt % waveLength;
                let nextWaveIntegralA = wave[indexA];
                let nextWaveIntegralB = wave[indexB];
                const phaseRatioA = phaseA - phaseAInt;
                const phaseRatioB = phaseB - phaseBInt;
                nextWaveIntegralA += (wave[indexA + 1] - nextWaveIntegralA) * phaseRatioA;
                nextWaveIntegralB += (wave[indexB + 1] - nextWaveIntegralB) * phaseRatioB;
                let waveA = (nextWaveIntegralA - prevWaveIntegralA) / phaseDeltaA;
                let waveB = (nextWaveIntegralB - prevWaveIntegralB) / phaseDeltaB;
                prevWaveIntegralA = nextWaveIntegralA;
                prevWaveIntegralB = nextWaveIntegralB;
                const combinedWave = (waveA + waveB * intervalSign);
                const feedback = filterResonance + filterResonance / (1.0 - filter1);
                filterSample0 += filter1 * (combinedWave - filterSample0 + feedback * (filterSample0 - filterSample1));
                filterSample1 += filter2 * (filterSample0 - filterSample1);
                filter1 *= filterScale1;
                filter2 *= filterScale2;
                phaseDeltaA *= phaseDeltaScale;
                phaseDeltaB *= phaseDeltaScale;
                filterResonance += filterResonanceDelta;
                const output = filterSample1 * volume * volumeScale;
                volume += volumeDelta;
                delays = stereoDelay < 0 ? [0, 0, ((-stereoDelay) | 0) * 2, (-stereoDelay) % 1] : [(stereoDelay | 0) * 2, stereoDelay % 1, 0, 0];
                data[(stereoBufferIndex + delays[0]) % stereoBufferLength] += output * stereoVolumeL * (1 - delays[1]);
                data[(stereoBufferIndex + delays[0] + 2) % stereoBufferLength] += output * stereoVolumeL * delays[1];
                data[(stereoBufferIndex + delays[2] + 1) % stereoBufferLength] += output * stereoVolumeR * (1 - delays[3]);
                data[(stereoBufferIndex + delays[2] + 3) % stereoBufferLength] += output * stereoVolumeR * delays[3];
                stereoVolumeL += stereoVolumeLDelta;
                stereoVolumeR += stereoVolumeRDelta;
                stereoDelay += stereoDelayDelta;
                stereoBufferIndex += 2;
            }
            tone.phases[0] = phaseA / waveLength;
            tone.phases[1] = phaseB / waveLength;
            const epsilon = (1.0e-24);
            if (-epsilon < filterSample0 && filterSample0 < epsilon)
                filterSample0 = 0.0;
            if (-epsilon < filterSample1 && filterSample1 < epsilon)
                filterSample1 = 0.0;
            tone.filterSample0 = filterSample0;
            tone.filterSample1 = filterSample1;
        }
        static harmonicsSynth(synth, data, stereoBufferIndex, stereoBufferLength, runLength, tone, instrument) {
            const wave = instrument.harmonicsWave.getCustomWave();
            const waveLength = +wave.length - 1;
            const intervalA = +Math.pow(2.0, (Config.intervals[instrument.interval].offset + Config.intervals[instrument.interval].spread) / 12.0);
            const intervalB = Math.pow(2.0, (Config.intervals[instrument.interval].offset - Config.intervals[instrument.interval].spread) / 12.0) * tone.intervalMult;
            const intervalSign = tone.intervalVolumeMult * Config.intervals[instrument.interval].sign;
            if (instrument.interval == 0 && !instrument.getChord().customInterval)
                tone.phases[1] = tone.phases[0];
            const deltaRatio = intervalB / intervalA;
            let phaseDeltaA = tone.phaseDeltas[0] * intervalA * waveLength;
            let phaseDeltaB = phaseDeltaA * deltaRatio;
            const phaseDeltaScale = +tone.phaseDeltaScale;
            let volume = +tone.volumeStart;
            const volumeDelta = +tone.volumeDelta;
            let phaseA = (tone.phases[0] % 1) * waveLength;
            let phaseB = (tone.phases[1] % 1) * waveLength;
            const isFirstOrder = tone.isFirstOrder;
            let filter1 = +tone.filter;
            let filter2 = isFirstOrder ? 1.0 : filter1;
            const filterScale1 = +tone.filterScale;
            const filterScale2 = isFirstOrder ? 1.0 : filterScale1;
            let filterResonance = tone.filterResonanceStart;
            let filterResonanceDelta = tone.filterResonanceDelta;
            let filterSample0 = +tone.filterSample0;
            let filterSample1 = +tone.filterSample1;
            const phaseAInt = phaseA | 0;
            const phaseBInt = phaseB | 0;
            const indexA = phaseAInt % waveLength;
            const indexB = phaseBInt % waveLength;
            const phaseRatioA = phaseA - phaseAInt;
            const phaseRatioB = phaseB - phaseBInt;
            let prevWaveIntegralA = wave[indexA];
            let prevWaveIntegralB = wave[indexB];
            prevWaveIntegralA += (wave[indexA + 1] - prevWaveIntegralA) * phaseRatioA;
            prevWaveIntegralB += (wave[indexB + 1] - prevWaveIntegralB) * phaseRatioB;
            const stopIndex = stereoBufferIndex + runLength;
            stereoBufferIndex += tone.stereoOffset;
            let stereoVolumeL = tone.stereoVolumeLStart;
            let stereoVolumeLDelta = tone.stereoVolumeLDelta;
            let stereoVolumeR = tone.stereoVolumeRStart;
            let stereoVolumeRDelta = tone.stereoVolumeRDelta;
            let stereoDelay = tone.stereoDelayStart;
            let stereoDelayDelta = tone.stereoDelayDelta;
            let delays;
            while (stereoBufferIndex < stopIndex) {
                phaseA += phaseDeltaA;
                phaseB += phaseDeltaB;
                const phaseAInt = phaseA | 0;
                const phaseBInt = phaseB | 0;
                const indexA = phaseAInt % waveLength;
                const indexB = phaseBInt % waveLength;
                let nextWaveIntegralA = wave[indexA];
                let nextWaveIntegralB = wave[indexB];
                const phaseRatioA = phaseA - phaseAInt;
                const phaseRatioB = phaseB - phaseBInt;
                nextWaveIntegralA += (wave[indexA + 1] - nextWaveIntegralA) * phaseRatioA;
                nextWaveIntegralB += (wave[indexB + 1] - nextWaveIntegralB) * phaseRatioB;
                let waveA = (nextWaveIntegralA - prevWaveIntegralA) / phaseDeltaA;
                let waveB = (nextWaveIntegralB - prevWaveIntegralB) / phaseDeltaB;
                prevWaveIntegralA = nextWaveIntegralA;
                prevWaveIntegralB = nextWaveIntegralB;
                const combinedWave = (waveA + waveB * intervalSign);
                const feedback = filterResonance + filterResonance / (1.0 - filter1);
                filterSample0 += filter1 * (combinedWave - filterSample0 + feedback * (filterSample0 - filterSample1));
                filterSample1 += filter2 * (filterSample0 - filterSample1);
                filter1 *= filterScale1;
                filter2 *= filterScale2;
                phaseDeltaA *= phaseDeltaScale;
                phaseDeltaB *= phaseDeltaScale;
                filterResonance += filterResonanceDelta;
                const output = filterSample1 * volume;
                volume += volumeDelta;
                delays = stereoDelay < 0 ? [0, 0, ((-stereoDelay) | 0) * 2, (-stereoDelay) % 1] : [(stereoDelay | 0) * 2, stereoDelay % 1, 0, 0];
                data[(stereoBufferIndex + delays[0]) % stereoBufferLength] += output * stereoVolumeL * (1 - delays[1]);
                data[(stereoBufferIndex + delays[0] + 2) % stereoBufferLength] += output * stereoVolumeL * delays[1];
                data[(stereoBufferIndex + delays[2] + 1) % stereoBufferLength] += output * stereoVolumeR * (1 - delays[3]);
                data[(stereoBufferIndex + delays[2] + 3) % stereoBufferLength] += output * stereoVolumeR * delays[3];
                stereoVolumeL += stereoVolumeLDelta;
                stereoVolumeR += stereoVolumeRDelta;
                stereoDelay += stereoDelayDelta;
                stereoBufferIndex += 2;
            }
            tone.phases[0] = phaseA / waveLength;
            tone.phases[1] = phaseB / waveLength;
            const epsilon = (1.0e-24);
            if (-epsilon < filterSample0 && filterSample0 < epsilon)
                filterSample0 = 0.0;
            if (-epsilon < filterSample1 && filterSample1 < epsilon)
                filterSample1 = 0.0;
            tone.filterSample0 = filterSample0;
            tone.filterSample1 = filterSample1;
        }
        static pulseWidthSynth(synth, data, stereoBufferIndex, stereoBufferLength, runLength, tone, instrument) {
            let phaseDelta = tone.phaseDeltas[0];
            const phaseDeltaScale = +tone.phaseDeltaScale;
            let volume = +tone.volumeStart;
            const volumeDelta = +tone.volumeDelta;
            let phase = (tone.phases[0] % 1);
            let pulseWidth = tone.pulseWidth;
            const pulseWidthDelta = tone.pulseWidthDelta;
            const isFirstOrder = tone.isFirstOrder;
            let filter1 = +tone.filter;
            let filter2 = isFirstOrder ? 1.0 : filter1;
            const filterScale1 = +tone.filterScale;
            const filterScale2 = isFirstOrder ? 1.0 : filterScale1;
            let filterResonance = tone.filterResonanceStart;
            let filterResonanceDelta = tone.filterResonanceDelta;
            let filterSample0 = +tone.filterSample0;
            let filterSample1 = +tone.filterSample1;
            const stopIndex = stereoBufferIndex + runLength;
            stereoBufferIndex += tone.stereoOffset;
            let stereoVolumeL = tone.stereoVolumeLStart;
            let stereoVolumeLDelta = tone.stereoVolumeLDelta;
            let stereoVolumeR = tone.stereoVolumeRStart;
            let stereoVolumeRDelta = tone.stereoVolumeRDelta;
            let stereoDelay = tone.stereoDelayStart;
            let stereoDelayDelta = tone.stereoDelayDelta;
            let delays;
            while (stereoBufferIndex < stopIndex) {
                const sawPhaseA = phase % 1;
                const sawPhaseB = (phase + pulseWidth) % 1;
                let pulseWave = sawPhaseB - sawPhaseA;
                if (sawPhaseA < phaseDelta) {
                    var t = sawPhaseA / phaseDelta;
                    pulseWave += (t + t - t * t - 1) * 0.5;
                }
                else if (sawPhaseA > 1.0 - phaseDelta) {
                    var t = (sawPhaseA - 1.0) / phaseDelta;
                    pulseWave += (t + t + t * t + 1) * 0.5;
                }
                if (sawPhaseB < phaseDelta) {
                    var t = sawPhaseB / phaseDelta;
                    pulseWave -= (t + t - t * t - 1) * 0.5;
                }
                else if (sawPhaseB > 1.0 - phaseDelta) {
                    var t = (sawPhaseB - 1.0) / phaseDelta;
                    pulseWave -= (t + t + t * t + 1) * 0.5;
                }
                const feedback = filterResonance + filterResonance / (1.0 - filter1);
                filterSample0 += filter1 * (pulseWave - filterSample0 + feedback * (filterSample0 - filterSample1));
                filterSample1 += filter2 * (filterSample0 - filterSample1);
                filter1 *= filterScale1;
                filter2 *= filterScale2;
                phase += phaseDelta;
                phaseDelta *= phaseDeltaScale;
                pulseWidth += pulseWidthDelta;
                filterResonance += filterResonanceDelta;
                const output = filterSample1 * volume;
                volume += volumeDelta;
                delays = stereoDelay < 0 ? [0, 0, ((-stereoDelay) | 0) * 2, (-stereoDelay) % 1] : [(stereoDelay | 0) * 2, stereoDelay % 1, 0, 0];
                data[(stereoBufferIndex + delays[0]) % stereoBufferLength] += output * stereoVolumeL * (1 - delays[1]);
                data[(stereoBufferIndex + delays[0] + 2) % stereoBufferLength] += output * stereoVolumeL * delays[1];
                data[(stereoBufferIndex + delays[2] + 1) % stereoBufferLength] += output * stereoVolumeR * (1 - delays[3]);
                data[(stereoBufferIndex + delays[2] + 3) % stereoBufferLength] += output * stereoVolumeR * delays[3];
                stereoVolumeL += stereoVolumeLDelta;
                stereoVolumeR += stereoVolumeRDelta;
                stereoDelay += stereoDelayDelta;
                stereoBufferIndex += 2;
            }
            tone.phases[0] = phase;
            const epsilon = (1.0e-24);
            if (-epsilon < filterSample0 && filterSample0 < epsilon)
                filterSample0 = 0.0;
            if (-epsilon < filterSample1 && filterSample1 < epsilon)
                filterSample1 = 0.0;
            tone.filterSample0 = filterSample0;
            tone.filterSample1 = filterSample1;
        }
        static noiseSynth(synth, data, stereoBufferIndex, stereoBufferLength, runLength, tone, instrument) {
            let wave = instrument.getDrumWave();
            let phaseDelta = +tone.phaseDeltas[0];
            const phaseDeltaScale = +tone.phaseDeltaScale;
            let volume = +tone.volumeStart;
            const volumeDelta = +tone.volumeDelta;
            let phase = (tone.phases[0] % 1) * Config.chipNoiseLength;
            if (tone.phases[0] == 0) {
                phase = Math.random() * Config.chipNoiseLength;
            }
            let sample = +tone.sample;
            const isFirstOrder = tone.isFirstOrder;
            let filter1 = +tone.filter;
            let filter2 = isFirstOrder ? 1.0 : filter1;
            const filterScale1 = +tone.filterScale;
            const filterScale2 = isFirstOrder ? 1.0 : filterScale1;
            let filterResonance = tone.filterResonanceStart;
            let filterResonanceDelta = tone.filterResonanceDelta;
            let filterSample0 = +tone.filterSample0;
            let filterSample1 = +tone.filterSample1;
            const pitchRelativefilter = Math.min(1.0, tone.phaseDeltas[0] * Config.chipNoises[instrument.chipNoise].pitchFilterMult);
            const stopIndex = stereoBufferIndex + runLength;
            stereoBufferIndex += tone.stereoOffset;
            let stereoVolumeL = tone.stereoVolumeLStart;
            let stereoVolumeLDelta = tone.stereoVolumeLDelta;
            let stereoVolumeR = tone.stereoVolumeRStart;
            let stereoVolumeRDelta = tone.stereoVolumeRDelta;
            let stereoDelay = tone.stereoDelayStart;
            let stereoDelayDelta = tone.stereoDelayDelta;
            let delays;
            while (stereoBufferIndex < stopIndex) {
                const waveSample = wave[phase & 0x7fff];
                sample += (waveSample - sample) * pitchRelativefilter;
                const feedback = filterResonance + filterResonance / (1.0 - filter1);
                filterSample0 += filter1 * (sample - filterSample0 + feedback * (filterSample0 - filterSample1));
                filterSample1 += filter2 * (filterSample0 - filterSample1);
                phase += phaseDelta;
                filter1 *= filterScale1;
                filter2 *= filterScale2;
                phaseDelta *= phaseDeltaScale;
                filterResonance += filterResonanceDelta;
                const output = filterSample1 * volume;
                volume += volumeDelta;
                delays = stereoDelay < 0 ? [0, 0, ((-stereoDelay) | 0) * 2, (-stereoDelay) % 1] : [(stereoDelay | 0) * 2, stereoDelay % 1, 0, 0];
                data[(stereoBufferIndex + delays[0]) % stereoBufferLength] += output * stereoVolumeL * (1 - delays[1]);
                data[(stereoBufferIndex + delays[0] + 2) % stereoBufferLength] += output * stereoVolumeL * delays[1];
                data[(stereoBufferIndex + delays[2] + 1) % stereoBufferLength] += output * stereoVolumeR * (1 - delays[3]);
                data[(stereoBufferIndex + delays[2] + 3) % stereoBufferLength] += output * stereoVolumeR * delays[3];
                stereoVolumeL += stereoVolumeLDelta;
                stereoVolumeR += stereoVolumeRDelta;
                stereoDelay += stereoDelayDelta;
                stereoBufferIndex += 2;
            }
            tone.phases[0] = phase / Config.chipNoiseLength;
            tone.sample = sample;
            const epsilon = (1.0e-24);
            if (-epsilon < filterSample0 && filterSample0 < epsilon)
                filterSample0 = 0.0;
            if (-epsilon < filterSample1 && filterSample1 < epsilon)
                filterSample1 = 0.0;
            tone.filterSample0 = filterSample0;
            tone.filterSample1 = filterSample1;
        }
        static spectrumSynth(synth, data, stereoBufferIndex, stereoBufferLength, runLength, tone, instrument) {
            let wave = instrument.getDrumWave();
            let phaseDelta = tone.phaseDeltas[0] * (1 << 7);
            const phaseDeltaScale = +tone.phaseDeltaScale;
            let volume = +tone.volumeStart;
            const volumeDelta = +tone.volumeDelta;
            let sample = +tone.sample;
            const isFirstOrder = tone.isFirstOrder;
            let filter1 = +tone.filter;
            let filter2 = isFirstOrder ? 1.0 : filter1;
            const filterScale1 = +tone.filterScale;
            const filterScale2 = isFirstOrder ? 1.0 : filterScale1;
            let filterResonance = tone.filterResonanceStart;
            let filterResonanceDelta = tone.filterResonanceDelta;
            let filterSample0 = +tone.filterSample0;
            let filterSample1 = +tone.filterSample1;
            let phase = (tone.phases[0] % 1) * Config.chipNoiseLength;
            if (tone.phases[0] == 0)
                phase = Synth.findRandomZeroCrossing(wave) + phaseDelta;
            const pitchRelativefilter = Math.min(1.0, phaseDelta);
            const stopIndex = stereoBufferIndex + runLength;
            stereoBufferIndex += tone.stereoOffset;
            let stereoVolumeL = tone.stereoVolumeLStart;
            let stereoVolumeLDelta = tone.stereoVolumeLDelta;
            let stereoVolumeR = tone.stereoVolumeRStart;
            let stereoVolumeRDelta = tone.stereoVolumeRDelta;
            let stereoDelay = tone.stereoDelayStart;
            let stereoDelayDelta = tone.stereoDelayDelta;
            let delays;
            while (stereoBufferIndex < stopIndex) {
                const phaseInt = phase | 0;
                const index = phaseInt & 0x7fff;
                let waveSample = wave[index];
                const phaseRatio = phase - phaseInt;
                waveSample += (wave[index + 1] - waveSample) * phaseRatio;
                sample += (waveSample - sample) * pitchRelativefilter;
                const feedback = filterResonance + filterResonance / (1.0 - filter1);
                filterSample0 += filter1 * (sample - filterSample0 + feedback * (filterSample0 - filterSample1));
                filterSample1 += filter2 * (filterSample0 - filterSample1);
                phase += phaseDelta;
                filter1 *= filterScale1;
                filter2 *= filterScale2;
                phaseDelta *= phaseDeltaScale;
                filterResonance += filterResonanceDelta;
                const output = filterSample1 * volume;
                volume += volumeDelta;
                delays = stereoDelay < 0 ? [0, 0, ((-stereoDelay) | 0) * 2, (-stereoDelay) % 1] : [(stereoDelay | 0) * 2, stereoDelay % 1, 0, 0];
                data[(stereoBufferIndex + delays[0]) % stereoBufferLength] += output * stereoVolumeL * (1 - delays[1]);
                data[(stereoBufferIndex + delays[0] + 2) % stereoBufferLength] += output * stereoVolumeL * delays[1];
                data[(stereoBufferIndex + delays[2] + 1) % stereoBufferLength] += output * stereoVolumeR * (1 - delays[3]);
                data[(stereoBufferIndex + delays[2] + 3) % stereoBufferLength] += output * stereoVolumeR * delays[3];
                stereoVolumeL += stereoVolumeLDelta;
                stereoVolumeR += stereoVolumeRDelta;
                stereoDelay += stereoDelayDelta;
                stereoBufferIndex += 2;
            }
            tone.phases[0] = phase / Config.chipNoiseLength;
            tone.sample = sample;
            const epsilon = (1.0e-24);
            if (-epsilon < filterSample0 && filterSample0 < epsilon)
                filterSample0 = 0.0;
            if (-epsilon < filterSample1 && filterSample1 < epsilon)
                filterSample1 = 0.0;
            tone.filterSample0 = filterSample0;
            tone.filterSample1 = filterSample1;
        }
        static drumsetSynth(synth, data, stereoBufferIndex, stereoBufferLength, runLength, tone, instrument) {
            let wave = instrument.getDrumsetWave(tone.drumsetPitch);
            let phaseDelta = tone.phaseDeltas[0] / Instrument.drumsetIndexReferenceDelta(tone.drumsetPitch);
            const phaseDeltaScale = +tone.phaseDeltaScale;
            let volume = +tone.volumeStart;
            const volumeDelta = +tone.volumeDelta;
            let sample = +tone.sample;
            const isFirstOrder = tone.isFirstOrder;
            let filter1 = +tone.filter;
            let filter2 = isFirstOrder ? 1.0 : filter1;
            const filterScale1 = +tone.filterScale;
            const filterScale2 = isFirstOrder ? 1.0 : filterScale1;
            let filterResonance = tone.filterResonanceStart;
            let filterResonanceDelta = tone.filterResonanceDelta;
            let filterSample0 = +tone.filterSample0;
            let filterSample1 = +tone.filterSample1;
            let phase = (tone.phases[0] % 1) * Config.chipNoiseLength;
            if (tone.phases[0] == 0)
                phase = Synth.findRandomZeroCrossing(wave) + phaseDelta;
            const stopIndex = stereoBufferIndex + runLength;
            stereoBufferIndex += tone.stereoOffset;
            let stereoVolumeL = tone.stereoVolumeLStart;
            let stereoVolumeLDelta = tone.stereoVolumeLDelta;
            let stereoVolumeR = tone.stereoVolumeRStart;
            let stereoVolumeRDelta = tone.stereoVolumeRDelta;
            let stereoDelay = tone.stereoDelayStart;
            let stereoDelayDelta = tone.stereoDelayDelta;
            let delays;
            while (stereoBufferIndex < stopIndex) {
                const phaseInt = phase | 0;
                const index = phaseInt & 0x7fff;
                sample = wave[index];
                const phaseRatio = phase - phaseInt;
                sample += (wave[index + 1] - sample) * phaseRatio;
                const feedback = filterResonance + filterResonance / (1.0 - filter1);
                filterSample0 += filter1 * (sample - filterSample0 + feedback * (filterSample0 - filterSample1));
                filterSample1 += filter2 * (filterSample0 - filterSample1);
                phase += phaseDelta;
                filter1 *= filterScale1;
                filter2 *= filterScale2;
                phaseDelta *= phaseDeltaScale;
                filterResonance += filterResonanceDelta;
                const output = filterSample1 * volume;
                volume += volumeDelta;
                delays = stereoDelay < 0 ? [0, 0, ((-stereoDelay) | 0) * 2, (-stereoDelay) % 1] : [(stereoDelay | 0) * 2, stereoDelay % 1, 0, 0];
                data[(stereoBufferIndex + delays[0]) % stereoBufferLength] += output * stereoVolumeL * (1 - delays[1]);
                data[(stereoBufferIndex + delays[0] + 2) % stereoBufferLength] += output * stereoVolumeL * delays[1];
                data[(stereoBufferIndex + delays[2] + 1) % stereoBufferLength] += output * stereoVolumeR * (1 - delays[3]);
                data[(stereoBufferIndex + delays[2] + 3) % stereoBufferLength] += output * stereoVolumeR * delays[3];
                stereoVolumeL += stereoVolumeLDelta;
                stereoVolumeR += stereoVolumeRDelta;
                stereoDelay += stereoDelayDelta;
                stereoBufferIndex += 2;
            }
            tone.phases[0] = phase / Config.chipNoiseLength;
            tone.sample = sample;
            const epsilon = (1.0e-24);
            if (-epsilon < filterSample0 && filterSample0 < epsilon)
                filterSample0 = 0.0;
            if (-epsilon < filterSample1 && filterSample1 < epsilon)
                filterSample1 = 0.0;
            tone.filterSample0 = filterSample0;
            tone.filterSample1 = filterSample1;
        }
        static modSynth(synth, data, stereoBufferIndex, stereoBufferLength, runLength, tone, instrument) {
            if (!synth.song)
                return;
            let mod = Config.modCount - 1 - tone.pitches[0];
            let setting = instrument.modSettings[mod];
            synth.setModValue(tone.customVolumeStart, tone.customVolumeEnd, mod, instrument, setting);
            if (setting == ModSetting.mstResetArpeggio && synth.tick == 0 && tone.noteStart == synth.beat * Config.partsPerBeat + synth.part) {
                synth.song.channels[instrument.modChannels[mod]].instruments[instrument.modInstruments[mod]].arpTime = 0;
            }
            else if (setting == ModSetting.mstNextBar) {
                synth.wantToSkip = true;
            }
        }
        static findRandomZeroCrossing(wave) {
            let phase = Math.random() * Config.chipNoiseLength;
            let indexPrev = phase & 0x7fff;
            let wavePrev = wave[indexPrev];
            const stride = 16;
            for (let attemptsRemaining = 128; attemptsRemaining > 0; attemptsRemaining--) {
                const indexNext = (indexPrev + stride) & 0x7fff;
                const waveNext = wave[indexNext];
                if (wavePrev * waveNext <= 0.0) {
                    for (let i = 0; i < 16; i++) {
                        const innerIndexNext = (indexPrev + 1) & 0x7fff;
                        const innerWaveNext = wave[innerIndexNext];
                        if (wavePrev * innerWaveNext <= 0.0) {
                            const slope = innerWaveNext - wavePrev;
                            phase = indexPrev;
                            if (Math.abs(slope) > 0.00000001) {
                                phase += -wavePrev / slope;
                            }
                            phase = Math.max(0, phase) % Config.chipNoiseLength;
                            break;
                        }
                        else {
                            indexPrev = innerIndexNext;
                            wavePrev = innerWaveNext;
                        }
                    }
                    break;
                }
                else {
                    indexPrev = indexNext;
                    wavePrev = waveNext;
                }
            }
            return phase;
        }
        static instrumentVolumeToVolumeMult(instrumentVolume) {
            return (instrumentVolume == -Config.volumeRange / 2.0) ? 0.0 : Math.pow(2, Config.volumeLogScale * instrumentVolume);
        }
        static volumeMultToInstrumentVolume(volumeMult) {
            return (volumeMult <= 0.0) ? -Config.volumeRange / 2 : Math.min(Config.volumeRange, (Math.log(volumeMult) / Math.LN2) / Config.volumeLogScale);
        }
        static expressionToVolumeMult(expression) {
            return Math.pow(Math.max(0.0, expression) / 6.0, 1.5);
        }
        static volumeMultToExpression(volumeMult) {
            return Math.pow(Math.max(0.0, volumeMult), 1 / 1.5) * 6.0;
        }
        getSamplesPerTick() {
            if (this.song == null)
                return 0;
            let beatsPerMinute = this.song.getBeatsPerMinute();
            if (this.isModActive(ModSetting.mstTempo, true)) {
                beatsPerMinute = this.getModValue(ModSetting.mstTempo, true);
            }
            return this.getSamplesPerTickSpecificBPM(beatsPerMinute);
        }
        getSamplesPerTickSpecificBPM(beatsPerMinute) {
            const beatsPerSecond = beatsPerMinute / 60.0;
            const partsPerSecond = Config.partsPerBeat * beatsPerSecond;
            const tickPerSecond = Config.ticksPerPart * partsPerSecond;
            return this.samplesPerSecond / tickPerSecond;
        }
    }
    Synth.fmSynthFunctionCache = {};
    Synth.fmSourceTemplate = (`
const sineWave = beepbox.Config.sawWave;

let phaseDeltaScale = +tone.phaseDeltaScale;
// I'm adding 1000 to the phase to ensure that it's never negative even when modulated by other waves because negative numbers don't work with the modulus operator very well.
let operator#Phase       = +((tone.phases[#] % 1) + 1000) * beepbox.Config.sineWaveLength;
let operator#PhaseDelta  = +tone.phaseDeltas[#];
let operator#OutputMult  = +tone.volumeStarts[#];
const operator#OutputDelta = +tone.volumeDeltas[#];
let operator#Output      = +tone.feedbackOutputs[#];
let feedbackMult         = +tone.feedbackMult;
const feedbackDelta        = +tone.feedbackDelta;
let volume = +tone.volumeStart;
const volumeDelta = +tone.volumeDelta;

const isFirstOrder = tone.isFirstOrder;
let filter1 = +tone.filter;
let filter2 = isFirstOrder ? 1.0 : filter1;
const filterScale1 = +tone.filterScale;
const filterScale2 = isFirstOrder ? 1.0 : filterScale1;
let filterResonance = tone.filterResonanceStart;
let filterResonanceDelta = tone.filterResonanceDelta;
let filterSample0 = +tone.filterSample0;
let filterSample1 = +tone.filterSample1;

const stopIndex = stereoBufferIndex + runLength;
stereoBufferIndex += tone.stereoOffset;
let stereoVolumeL = tone.stereoVolumeLStart;
let stereoVolumeLDelta = tone.stereoVolumeLDelta;
let stereoVolumeR = tone.stereoVolumeRStart;
let stereoVolumeRDelta = tone.stereoVolumeRDelta;
let stereoDelay = tone.stereoDelayStart;
let stereoDelayDelta = tone.stereoDelayDelta;
let delays = [];
while (stereoBufferIndex < stopIndex) {
// INSERT OPERATOR COMPUTATION HERE
const fmOutput = (/*operator#Scaled*/); // CARRIER OUTPUTS

const feedback = filterResonance + filterResonance / (1.0 - filter1);
filterSample0 += filter1 * (fmOutput - filterSample0 + feedback * (filterSample0 - filterSample1));
filterSample1 += filter2 * (filterSample0 - filterSample1);

feedbackMult += feedbackDelta;
operator#OutputMult += operator#OutputDelta;
operator#Phase += operator#PhaseDelta;
operator#PhaseDelta *= phaseDeltaScale;
filter1 *= filterScale1;
filter2 *= filterScale2;
filterResonance += filterResonanceDelta;

const output = filterSample1 * volume;
volume += volumeDelta;

//const absStereoDelay: number = Math.abs(stereoDelay);
//const fracStereoDelay: number = absStereoDelay % 1;
//const floorStereoDelay: number = absStereoDelay | 0;

//delays = stereoDelay < 0 ? [0, 0, floorStereoDelay * 2, fracStereoDelay] : [floorStereoDelay * 2, fracStereoDelay, 0, 0];

// Optimized ver: can remove the above three declarations, but muddier conceptually. Still has that conditional, too...
delays = stereoDelay < 0 ? [0, 0, ((-stereoDelay) | 0) * 2, (-stereoDelay) % 1] : [(stereoDelay | 0) * 2, stereoDelay % 1, 0, 0];

data[(stereoBufferIndex + delays[0]) % stereoBufferLength] += output * stereoVolumeL * (1 - delays[1]);
data[(stereoBufferIndex + delays[0] + 2) % stereoBufferLength] += output * stereoVolumeL * delays[1];
data[(stereoBufferIndex + delays[2] + 1) % stereoBufferLength] += output * stereoVolumeR * (1 - delays[3]);
data[(stereoBufferIndex + delays[2] + 3) % stereoBufferLength] += output * stereoVolumeR * delays[3];

stereoVolumeL += stereoVolumeLDelta;
stereoVolumeR += stereoVolumeRDelta;
stereoDelay += stereoDelayDelta;

stereoBufferIndex += 2;
}

tone.phases[#] = operator#Phase / ` + Config.sineWaveLength + `;
tone.feedbackOutputs[#] = operator#Output;

const epsilon = (1.0e-24);
if (-epsilon < filterSample0 && filterSample0 < epsilon) filterSample0 = 0.0;
if (-epsilon < filterSample1 && filterSample1 < epsilon) filterSample1 = 0.0;
tone.filterSample0 = filterSample0;
tone.filterSample1 = filterSample1;
`).split("\n");
    Synth.operatorSourceTemplate = (`
const operator#PhaseMix = operator#Phase/* + operator@Scaled*/;
const operator#PhaseInt = operator#PhaseMix|0;
const operator#Index    = operator#PhaseInt & ` + Config.sineWaveMask + `;
const operator#Sample   = sineWave[operator#Index];
operator#Output       = operator#Sample + (sineWave[operator#Index + 1] - operator#Sample) * (operator#PhaseMix - operator#PhaseInt);
const operator#Scaled   = operator#OutputMult * operator#Output;
`).split("\n");

    const { a, button, div, h1, input } = HTML;
    const { svg, circle, rect, path } = SVG;
    document.head.appendChild(HTML.style({ type: "text/css" }, `
		body {
			color: ${ColorConfig.primaryText};
			background: ${ColorConfig.editorBackground};
		}
		h1 {
			font-weight: bold;
			font-size: 14px;
			line-height: 22px;
			text-align: initial;
			margin: 0;
		}
		a {
			font-weight: bold;
			font-size: 12px;
			line-height: 22px;
			white-space: nowrap;
			color: ${ColorConfig.linkAccent};
		}
		button {
			margin: 0;
			padding: 0;
			position: relative;
			border: none;
			border-radius: 5px;
			background: ${ColorConfig.uiWidgetBackground};
			color: ${ColorConfig.primaryText};
			cursor: pointer;
			font-size: 14px;
			font-family: inherit;
		}
		button:hover, button:focus {
			background: ${ColorConfig.uiWidgetFocus};
		}
		.playButton, .pauseButton {
			padding-left: 24px;
			padding-right: 6px;
		}
		.playButton::before {
			content: "";
			position: absolute;
			left: 6px;
			top: 50%;
			margin-top: -6px;
			width: 12px;
			height: 12px;
			pointer-events: none;
			background: ${ColorConfig.primaryText};
			-webkit-mask-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="-6 -6 12 12"><path d="M 6 0 L -5 6 L -5 -6 z" fill="gray"/></svg>');
			-webkit-mask-repeat: no-repeat;
			-webkit-mask-position: center;
			mask-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="-6 -6 12 12"><path d="M 6 0 L -5 6 L -5 -6 z" fill="gray"/></svg>');
			mask-repeat: no-repeat;
			mask-position: center;
		}
		.pauseButton::before {
			content: "";
			position: absolute;
			left: 6px;
			top: 50%;
			margin-top: -6px;
			width: 12px;
			height: 12px;
			pointer-events: none;
			background: ${ColorConfig.primaryText};
			-webkit-mask-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="-6 -6 12 12"><rect x="-5" y="-6" width="3" height="12" fill="gray"/><rect x="2"  y="-6" width="3" height="12" fill="gray"/></svg>');
			-webkit-mask-repeat: no-repeat;
			-webkit-mask-position: center;
			mask-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="-6 -6 12 12"><rect x="-5" y="-6" width="3" height="12" fill="gray"/><rect x="2"  y="-6" width="3" height="12" fill="gray"/></svg>');
			mask-repeat: no-repeat;
			mask-position: center;
		}
		
		input[type=range] {
			-webkit-appearance: none;
			appearance: none;
			height: 16px;
			margin: 0;
			cursor: pointer;
			background-color: ${ColorConfig.editorBackground};
			touch-action: pan-y;
		}
		input[type=range]:focus {
			outline: none;
		}
		input[type=range]::-webkit-slider-runnable-track {
			width: 100%;
			height: 4px;
			cursor: pointer;
			background: ${ColorConfig.uiWidgetBackground};
		}
		input[type=range]::-webkit-slider-thumb {
			height: 16px;
			width: 4px;
			border-radius: 2px;
			background: ${ColorConfig.primaryText};
			cursor: pointer;
			-webkit-appearance: none;
			margin-top: -6px;
		}
		input[type=range]:focus::-webkit-slider-runnable-track, input[type=range]:hover::-webkit-slider-runnable-track {
			background: ${ColorConfig.uiWidgetFocus};
		}
		input[type=range]::-moz-range-track {
			width: 100%;
			height: 4px;
			cursor: pointer;
			background: ${ColorConfig.uiWidgetBackground};
		}
		input[type=range]:focus::-moz-range-track, input[type=range]:hover::-moz-range-track  {
			background: ${ColorConfig.uiWidgetFocus};
		}
		input[type=range]::-moz-range-thumb {
			height: 16px;
			width: 4px;
			border-radius: 2px;
			border: none;
			background: ${ColorConfig.primaryText};
			cursor: pointer;
		}
		input[type=range]::-ms-track {
			width: 100%;
			height: 4px;
			cursor: pointer;
			background: ${ColorConfig.uiWidgetBackground};
			border-color: transparent;
		}
		input[type=range]:focus::-ms-track, input[type=range]:hover::-ms-track {
			background: ${ColorConfig.uiWidgetFocus};
		}
		input[type=range]::-ms-thumb {
			height: 16px;
			width: 4px;
			border-radius: 2px;
			background: ${ColorConfig.primaryText};
			cursor: pointer;
		}
	`));
    ColorConfig.setTheme("jummbox classic");
    let prevHash = null;
    let id = ((Math.random() * 0xffffffff) >>> 0).toString(16);
    let pauseButtonDisplayed = false;
    let animationRequest;
    let zoomEnabled = false;
    let timelineWidth = 1;
    let outVolumeHistoricTimer = 0;
    let outVolumeHistoricCap = 0;
    const synth = new Synth();
    let titleText = h1({ style: "flex-grow: 1; margin: 0 1px; margin-left: 10px; overflow: hidden;" }, "");
    let editLink = a({ target: "_top", style: "margin: 0 4px;" }, "✎ Edit");
    let copyLink = a({ href: "javascript:void(0)", style: "margin: 0 4px;" }, "⎘ Copy URL");
    let shareLink = a({ href: "javascript:void(0)", style: "margin: 0 4px;" }, "⤳ Share");
    let fullscreenLink = a({ target: "_top", style: "margin: 0 4px;" }, "⇱ Fullscreen");
    let draggingPlayhead = false;
    const playButton = button({ style: "width: 100%; height: 100%; max-height: 50px;" });
    const playButtonContainer = div({ style: "flex-shrink: 0; display: flex; padding: 2px; width: 80px; height: 100%; box-sizing: border-box; align-items: center;" }, playButton);
    const loopIcon = path({ d: "M 4 2 L 4 0 L 7 3 L 4 6 L 4 4 Q 2 4 2 6 Q 2 8 4 8 L 4 10 Q 0 10 0 6 Q 0 2 4 2 M 8 10 L 8 12 L 5 9 L 8 6 L 8 8 Q 10 8 10 6 Q 10 4 8 4 L 8 2 Q 12 2 12 6 Q 12 10 8 10 z" });
    const loopButton = button({ title: "loop", style: "background: none; flex: 0 0 12px; margin: 0 3px; width: 12px; height: 12px; display: flex;" }, svg({ width: 12, height: 12, viewBox: "0 0 12 12" }, loopIcon));
    const volumeIcon = svg({ style: "flex: 0 0 12px; margin: 0 1px; width: 12px; height: 12px;", viewBox: "0 0 12 12" }, path({ fill: ColorConfig.uiWidgetBackground, d: "M 1 9 L 1 3 L 4 3 L 7 0 L 7 12 L 4 9 L 1 9 M 9 3 Q 12 6 9 9 L 8 8 Q 10.5 6 8 4 L 9 3 z" }));
    const volumeSlider = input({ title: "volume", type: "range", value: 75, min: 0, max: 75, step: 1, style: "width: 12vw; max-width: 100px; margin: 0 1px;" });
    const zoomIcon = svg({ width: 12, height: 12, viewBox: "0 0 12 12" }, circle({ cx: "5", cy: "5", r: "4.5", "stroke-width": "1", stroke: "currentColor", fill: "none" }), path({ stroke: "currentColor", "stroke-width": "2", d: "M 8 8 L 11 11 M 5 2 L 5 8 M 2 5 L 8 5", fill: "none" }));
    const zoomButton = button({ title: "zoom", style: "background: none; flex: 0 0 12px; margin: 0 3px; width: 12px; height: 12px; display: flex;" }, zoomIcon);
    const timeline = svg({ style: "min-width: 0; min-height: 0; touch-action: pan-y pinch-zoom;" });
    const playhead = div({ style: `position: absolute; left: 0; top: 0; width: 2px; height: 100%; background: ${ColorConfig.playhead}; pointer-events: none;` });
    const timelineContainer = div({ style: "display: flex; flex-grow: 1; flex-shrink: 1; position: relative;" }, timeline, playhead);
    const visualizationContainer = div({ style: "display: flex; flex-grow: 1; flex-shrink: 1; height: 0; position: relative; align-items: center; overflow: hidden;" }, timelineContainer);
    const outVolumeBarBg = SVG.rect({ "pointer-events": "none", width: "90%", height: "50%", x: "5%", y: "25%", fill: ColorConfig.uiWidgetBackground });
    const outVolumeBar = SVG.rect({ "pointer-events": "none", height: "50%", width: "0%", x: "5%", y: "25%", fill: "url('#volumeGrad2')" });
    const outVolumeCap = SVG.rect({ "pointer-events": "none", width: "2px", height: "50%", x: "5%", y: "25%", fill: ColorConfig.uiWidgetFocus });
    const stop1 = SVG.stop({ "stop-color": "lime", offset: "60%" });
    const stop2 = SVG.stop({ "stop-color": "orange", offset: "90%" });
    const stop3 = SVG.stop({ "stop-color": "red", offset: "100%" });
    const gradient = SVG.linearGradient({ id: "volumeGrad2", gradientUnits: "userSpaceOnUse" }, stop1, stop2, stop3);
    const defs = SVG.defs({}, gradient);
    const volumeBarContainer = SVG.svg({ style: `touch-action: none; overflow: hidden; margin: auto;`, width: "160px", height: "10px", preserveAspectRatio: "none" }, defs, outVolumeBarBg, outVolumeBar, outVolumeCap);
    document.body.appendChild(visualizationContainer);
    document.body.appendChild(div({ style: `flex-shrink: 0; height: 20vh; min-height: 22px; max-height: 70px; display: flex; align-items: center;` }, playButtonContainer, loopButton, volumeIcon, volumeSlider, zoomButton, volumeBarContainer, titleText, editLink, copyLink, shareLink, fullscreenLink));
    function hashUpdatedExternally() {
        let myHash = location.hash;
        if (prevHash == myHash || myHash == "")
            return;
        prevHash = myHash;
        if (myHash.charAt(0) == "#") {
            myHash = myHash.substring(1);
        }
        fullscreenLink.setAttribute("href", location.href);
        for (const parameter of myHash.split("&")) {
            let equalsIndex = parameter.indexOf("=");
            if (equalsIndex != -1) {
                let paramName = parameter.substring(0, equalsIndex);
                let value = parameter.substring(equalsIndex + 1);
                switch (paramName) {
                    case "song":
                        synth.setSong(value);
                        synth.snapToStart();
                        if (synth.song) {
                            titleText.textContent = synth.song.title;
                        }
                        editLink.setAttribute("href", "../#" + value);
                        break;
                    case "loop":
                        synth.loopRepeatCount = (value != "1") ? 0 : -1;
                        renderLoopIcon();
                        break;
                }
            }
            else {
                synth.setSong(myHash);
                synth.snapToStart();
                editLink.setAttribute("href", "../#" + myHash);
            }
        }
        renderTimeline();
    }
    function onWindowResize() {
        renderTimeline();
    }
    function animate() {
        if (synth.playing) {
            animationRequest = requestAnimationFrame(animate);
            if (localStorage.getItem("playerId") != id) {
                onTogglePlay();
            }
            renderPlayhead();
            volumeUpdate();
        }
        if (pauseButtonDisplayed != synth.playing) {
            renderPlayButton();
        }
    }
    function volumeUpdate() {
        if (synth.song == null) {
            outVolumeCap.setAttribute("x", "5%");
            outVolumeBar.setAttribute("width", "0%");
            return;
        }
        outVolumeHistoricTimer--;
        if (outVolumeHistoricTimer <= 0) {
            outVolumeHistoricCap -= 0.03;
        }
        if (synth.song.outVolumeCap > outVolumeHistoricCap) {
            outVolumeHistoricCap = synth.song.outVolumeCap;
            outVolumeHistoricTimer = 50;
        }
        animateVolume(synth.song.outVolumeCap, outVolumeHistoricCap);
        if (!synth.playing) {
            outVolumeCap.setAttribute("x", "5%");
            outVolumeBar.setAttribute("width", "0%");
        }
    }
    function animateVolume(useOutVolumeCap, historicOutCap) {
        outVolumeBar.setAttribute("width", "" + Math.min(144, useOutVolumeCap * 144));
        outVolumeCap.setAttribute("x", "" + (8 + Math.min(144, historicOutCap * 144)));
    }
    function onTogglePlay() {
        if (synth.song != null) {
            if (animationRequest != null)
                cancelAnimationFrame(animationRequest);
            animationRequest = null;
            if (synth.playing) {
                synth.pause();
                volumeUpdate();
            }
            else {
                synth.play();
                localStorage.setItem("playerId", id);
                animate();
            }
        }
        renderPlayButton();
    }
    function onToggleLoop() {
        if (synth.loopRepeatCount == -1) {
            synth.loopRepeatCount = 0;
        }
        else {
            synth.loopRepeatCount = -1;
        }
        renderLoopIcon();
    }
    function onVolumeChange() {
        localStorage.setItem("volume", volumeSlider.value);
        setSynthVolume();
    }
    function onToggleZoom() {
        zoomEnabled = !zoomEnabled;
        renderZoomIcon();
        renderTimeline();
    }
    function onTimelineMouseDown(event) {
        draggingPlayhead = true;
        onTimelineMouseMove(event);
    }
    function onTimelineMouseMove(event) {
        event.preventDefault();
        onTimelineCursorMove(event.clientX || event.pageX);
    }
    function onTimelineTouchDown(event) {
        draggingPlayhead = true;
        onTimelineTouchMove(event);
    }
    function onTimelineTouchMove(event) {
        onTimelineCursorMove(event.touches[0].clientX);
    }
    function onTimelineCursorMove(mouseX) {
        if (draggingPlayhead && synth.song != null) {
            const boundingRect = visualizationContainer.getBoundingClientRect();
            synth.playhead = synth.song.barCount * (mouseX - boundingRect.left) / (boundingRect.right - boundingRect.left);
            synth.computeLatestModValues();
            renderPlayhead();
        }
    }
    function onTimelineCursorUp() {
        draggingPlayhead = false;
    }
    function setSynthVolume() {
        const volume = +volumeSlider.value;
        synth.volume = Math.min(1.0, Math.pow(volume / 50.0, 0.5)) * Math.pow(2.0, (volume - 75.0) / 25.0);
    }
    function renderPlayhead() {
        if (synth.song != null) {
            let pos = synth.playhead / synth.song.barCount;
            playhead.style.left = (timelineWidth * pos) + "px";
            const boundingRect = visualizationContainer.getBoundingClientRect();
            visualizationContainer.scrollLeft = pos * (timelineWidth - boundingRect.width);
        }
    }
    function renderTimeline() {
        timeline.innerHTML = "";
        if (synth.song == null)
            return;
        const boundingRect = visualizationContainer.getBoundingClientRect();
        let timelineHeight;
        let windowOctaves;
        let windowPitchCount;
        if (zoomEnabled) {
            timelineHeight = boundingRect.height;
            windowOctaves = Math.max(3, Math.min(Config.pitchOctaves, Math.round(timelineHeight / (12 * 2))));
            windowPitchCount = windowOctaves * 12 + 1;
            const semitoneHeight = (timelineHeight - 1) / windowPitchCount;
            const targetBeatWidth = Math.max(8, semitoneHeight * 4);
            timelineWidth = Math.max(boundingRect.width, targetBeatWidth * synth.song.barCount * synth.song.beatsPerBar);
        }
        else {
            timelineWidth = boundingRect.width;
            const targetSemitoneHeight = Math.max(1, timelineWidth / (synth.song.barCount * synth.song.beatsPerBar) / 6.0);
            timelineHeight = Math.min(boundingRect.height, targetSemitoneHeight * (Config.maxPitch + 1) + 1);
            windowOctaves = Math.max(3, Math.min(Config.pitchOctaves, Math.round(timelineHeight / (12 * targetSemitoneHeight))));
            windowPitchCount = windowOctaves * 12 + 1;
        }
        timelineContainer.style.width = timelineWidth + "px";
        timelineContainer.style.height = timelineHeight + "px";
        timeline.style.width = timelineWidth + "px";
        timeline.style.height = timelineHeight + "px";
        const barWidth = timelineWidth / synth.song.barCount;
        const partWidth = barWidth / (synth.song.beatsPerBar * Config.partsPerBeat);
        const wavePitchHeight = (timelineHeight - 1) / windowPitchCount;
        const drumPitchHeight = (timelineHeight - 1) / Config.drumCount;
        for (let bar = 0; bar < synth.song.barCount + 1; bar++) {
            const color = (bar == synth.song.loopStart || bar == synth.song.loopStart + synth.song.loopLength) ? ColorConfig.loopAccent : ColorConfig.uiWidgetBackground;
            timeline.appendChild(rect({ x: bar * barWidth - 1, y: 0, width: 2, height: timelineHeight, fill: color }));
        }
        for (let octave = 0; octave <= windowOctaves; octave++) {
            timeline.appendChild(rect({ x: 0, y: octave * 12 * wavePitchHeight, width: timelineWidth, height: wavePitchHeight + 1, fill: ColorConfig.tonic, opacity: 0.75 }));
        }
        for (let channel = synth.song.channels.length - 1 - synth.song.modChannelCount; channel >= 0; channel--) {
            const isNoise = synth.song.getChannelIsNoise(channel);
            const pitchHeight = isNoise ? drumPitchHeight : wavePitchHeight;
            const configuredOctaveScroll = synth.song.channels[channel].octave;
            const octavesToMove = (windowOctaves - 3) / 2;
            const newScrollableOctaves = Config.pitchOctaves - windowOctaves;
            const oldCenter = 5 / 2;
            const newCenter = newScrollableOctaves / 2;
            let distanceFromCenter = configuredOctaveScroll - oldCenter;
            if (Math.abs(distanceFromCenter) <= octavesToMove) {
                distanceFromCenter = 0;
            }
            else if (distanceFromCenter < 0) {
                distanceFromCenter += octavesToMove;
            }
            else {
                distanceFromCenter -= octavesToMove;
            }
            const newOctaveScroll = Math.max(0, Math.min(newScrollableOctaves, Math.round(newCenter + distanceFromCenter)));
            const offsetY = newOctaveScroll * pitchHeight * 12 + timelineHeight - pitchHeight * 0.5 - 0.5;
            for (let bar = 0; bar < synth.song.barCount; bar++) {
                const pattern = synth.song.getPattern(channel, bar);
                if (pattern == null)
                    continue;
                const offsetX = bar * barWidth;
                for (let i = 0; i < pattern.notes.length; i++) {
                    const note = pattern.notes[i];
                    for (const pitch of note.pitches) {
                        const d = drawNote(pitch, note.start, note.pins, (pitchHeight + 1) / 2, offsetX, offsetY, partWidth, pitchHeight);
                        const noteElement = path({ d: d, fill: ColorConfig.getChannelColor(synth.song, channel).primaryChannel });
                        if (isNoise)
                            noteElement.style.opacity = String(0.6);
                        timeline.appendChild(noteElement);
                    }
                }
            }
        }
        renderPlayhead();
    }
    function drawNote(pitch, start, pins, radius, offsetX, offsetY, partWidth, pitchHeight) {
        let d = `M ${offsetX + partWidth * (start + pins[0].time)} ${offsetY - pitch * pitchHeight + radius * (pins[0].volume / 6.0)} `;
        for (let i = 0; i < pins.length; i++) {
            const pin = pins[i];
            const x = offsetX + partWidth * (start + pin.time);
            const y = offsetY - pitchHeight * (pitch + pin.interval);
            const expression = pin.volume / 6.0;
            d += `L ${x} ${y - radius * expression} `;
        }
        for (let i = pins.length - 1; i >= 0; i--) {
            const pin = pins[i];
            const x = offsetX + partWidth * (start + pin.time);
            const y = offsetY - pitchHeight * (pitch + pin.interval);
            const expression = pin.volume / 6.0;
            d += `L ${x} ${y + radius * expression} `;
        }
        return d;
    }
    function renderPlayButton() {
        if (synth.playing) {
            playButton.classList.remove("playButton");
            playButton.classList.add("pauseButton");
            playButton.title = "Pause (Space)";
            playButton.innerText = "Pause";
        }
        else {
            playButton.classList.remove("pauseButton");
            playButton.classList.add("playButton");
            playButton.title = "Play (Space)";
            playButton.innerText = "Play";
        }
        pauseButtonDisplayed = synth.playing;
    }
    function renderLoopIcon() {
        loopIcon.setAttribute("fill", (synth.loopRepeatCount == -1) ? ColorConfig.linkAccent : ColorConfig.uiWidgetBackground);
    }
    function renderZoomIcon() {
        zoomIcon.style.color = zoomEnabled ? ColorConfig.linkAccent : ColorConfig.uiWidgetBackground;
    }
    function onKeyPressed(event) {
        switch (event.keyCode) {
            case 32:
                onTogglePlay();
                event.preventDefault();
                break;
            case 219:
                synth.prevBar();
                renderPlayhead();
                event.preventDefault();
                break;
            case 221:
                synth.nextBar();
                renderPlayhead();
                event.preventDefault();
                break;
        }
    }
    function onCopyClicked() {
        let nav;
        nav = navigator;
        if (nav.clipboard && nav.clipboard.writeText) {
            nav.clipboard.writeText(location.href).catch(() => {
                window.prompt("Copy to clipboard:", location.href);
            });
            return;
        }
        const textField = document.createElement("textarea");
        textField.innerText = location.href;
        document.body.appendChild(textField);
        textField.select();
        const succeeded = document.execCommand("copy");
        textField.remove();
        if (!succeeded)
            window.prompt("Copy this:", location.href);
    }
    function onShareClicked() {
        navigator.share({ url: location.href });
    }
    if (top !== self) {
        copyLink.style.display = "none";
        shareLink.style.display = "none";
    }
    else {
        fullscreenLink.style.display = "none";
        if (!("share" in navigator))
            shareLink.style.display = "none";
    }
    if (localStorage.getItem("volume") != null) {
        volumeSlider.value = localStorage.getItem("volume");
    }
    setSynthVolume();
    window.addEventListener("resize", onWindowResize);
    window.addEventListener("keydown", onKeyPressed);
    timeline.addEventListener("mousedown", onTimelineMouseDown);
    window.addEventListener("mousemove", onTimelineMouseMove);
    window.addEventListener("mouseup", onTimelineCursorUp);
    timeline.addEventListener("touchstart", onTimelineTouchDown);
    timeline.addEventListener("touchmove", onTimelineTouchMove);
    timeline.addEventListener("touchend", onTimelineCursorUp);
    timeline.addEventListener("touchcancel", onTimelineCursorUp);
    playButton.addEventListener("click", onTogglePlay);
    loopButton.addEventListener("click", onToggleLoop);
    volumeSlider.addEventListener("input", onVolumeChange);
    zoomButton.addEventListener("click", onToggleZoom);
    copyLink.addEventListener("click", onCopyClicked);
    shareLink.addEventListener("click", onShareClicked);
    window.addEventListener("hashchange", hashUpdatedExternally);
    hashUpdatedExternally();
    renderLoopIcon();
    renderZoomIcon();
    renderPlayButton();

    exports.Channel = Channel;
    exports.Config = Config;
    exports.Instrument = Instrument;
    exports.Note = Note;
    exports.Pattern = Pattern;
    exports.Synth = Synth;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

}({}));
//# sourceMappingURL=beepbox_player.js.map
