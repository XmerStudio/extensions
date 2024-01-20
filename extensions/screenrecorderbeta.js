// XmerStudios® - TurboWarp Extensions - Default License - 2024

class ScreenRecorder {
  constructor() {
    this.soundlvl = 0;
    this.stream = null;
    "use strict";
    const icon =
      "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAuMDAgMC4wMCA1MDAuMDAgNTAwLjAwIj4KPHBhdGggc3Ryb2tlPSIjODAwMDAwIiBzdHJva2Utd2lkdGg9IjIuMDAiIGZpbGw9Im5vbmUiIHN0cm9rZS1saW5lY2FwPSJidXR0IiB2ZWN0b3ItZWZmZWN0PSJub24tc2NhbGluZy1zdHJva2UiIGQ9IgogIE0gMzgwLjI4IDI1MC4wMQogIEEgMTMwLjI4IDEzMC4yOCAwLjAgMCAwIDI1MC4wMCAxMTkuNzMKICBBIDEzMC4yOCAxMzAuMjggMC4wIDAgMCAxMTkuNzIgMjUwLjAxCiAgQSAxMzAuMjggMTMwLjI4IDAuMCAwIDAgMjUwLjAwIDM4MC4yOQogIEEgMTMwLjI4IDEzMC4yOCAwLjAgMCAwIDM4MC4yOCAyNTAuMDEKICBBIDEzMC4yOCAxMzAuMjggMC4wIDAgMCAyNTAuMDEgOTcuODYKICBBIDEzMC4yOCAxMzAuMjggMC4wIDAgMCA0MDIuMTYgMjUwLjAxCiAgWgogIE0gNDAyLjE2IDI1MC4wMQogIEEgMTUyLjE1IDE1Mi4xNSAwLjAgMCAxIDI1MC4wMSA0MDIuMTYKICBBIDE1Mi4xNSAxNTIuMTUgMC4wIDAgMSA5Ny44NiAyNTAuMDEKICBBIDE1Mi4xNSAxNTIuMTUgMC4wIDAgMSAyNTAuMDEgOTcuODYKICBBIDE1Mi4xNSAxNTIuMTUgMC4wIDAgMSA0MDIuMTYgMjUwLjAxCiAgWgogIE0gMzgwLjI4IDI1MC4wMQogIEEgMTMwLjI4IDEzMC4yOCAwLjAgMCAwIDI1MC4wMCAxMTkuNzMKICBBIDEzMC4yOCAxMzAuMjggMC4wIDAgMCAxMTkuNzIgMjUwLjAxCiAgQSAxMzAuMjggMTMwLjI4IDAuMCAwIDAgMjUwLjAwIDM4MC4yOQogIEEgMTMwLjI4IDEzMC4yOCAwLjAgMCAwIDM4MC4yOCAyNTAuMDEKICBaIgovPgo8Y2lyY2xlIGZpbGw9IiNmZjAwMDAiIGN4PSIyNTAuMDAiIGN5PSIyNTAuMDEiIHI9IjEzMC4yOCIvPgo8L3N2Zz4K";

    this.icon = icon;
  }

  measureSoundLevel(stream) {
    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);

    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    analyser.minDecibels = -90;
    analyser.maxDecibels = -10;

    source.connect(analyser);

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const getAverageVolume = function (array) {
      let sum = 0;
      for (let i = 0; i < array.length; i++) {
        sum += array[i];
      }
      let average = sum / array.length;
      return average;
    };

    const updateSoundLevel = function () {
      analyser.getByteFrequencyData(dataArray);
      let average = getAverageVolume(dataArray);
      let db = 20 * Math.log10(average / 255);
      db = Math.round(db);
      db = Math.max(0, Math.min(100, 50 - db));
      console.log(db);
      this.soundlvl = db;
      requestAnimationFrame(updateSoundLevel.bind(this));
    };

    updateSoundLevel.bind(this)();
  }

  requestPermission() {
    navigator.mediaDevices.getDisplayMedia({ audio: true }).then((stream) => {
      this.stream = stream;
      this.measureSoundLevel(stream);
      this.watchStreamStatus();
    });
  }

  watchStreamStatus() {
    if (this.stream) {
      this.stream.oninactive = () => {
        this.stream = null;
      };
    }
  }

  stopSharingScreen() {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }
  }

  checkPermission() {
    return !!this.stream;
  }

  getInfo() {
    return {
      id: 'screenrecorder',
      color1: '#ff1717',
      color2: '#a60f0f',
      color3: '#080808',
      blockIconURI: this.icon,
      name: 'Screen Recorder [BETA]',
      blocks: [
        {
          opcode: 'getSoundLevel',
          blockType: Scratch.BlockType.REPORTER,
          text: 'Screen Sound Level',
        },
        {
          opcode: 'requestPermission',
          blockType: Scratch.BlockType.COMMAND,
          text: 'Request Permission to Share Screen',
        },
        {
          opcode: 'stopSharingScreen',
          blockType: Scratch.BlockType.COMMAND,
          text: 'Stop Screen Recorder',
        },
      ],
    };
  }

  getSoundLevel() {
    return 100 - this.soundlvl;
  }
}

Scratch.extensions.register(new ScreenRecorder());
