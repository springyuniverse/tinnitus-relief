import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Slider } from './ui/slider';
import { Button } from './ui/button';
import { Volume2, VolumeX } from 'lucide-react';

const TinnitusRelief = () => {
  const [audioContext, setAudioContext] = useState(null);
  const [source, setSource] = useState(null);
  const [gainNode, setGainNode] = useState(null);
  const [analyser, setAnalyser] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [frequency, setFrequency] = useState(4000);
  const [volume, setVolume] = useState(0.1);
  const [soundType, setSoundType] = useState('sine');
  const [noiseBuffer, setNoiseBuffer] = useState(null);
  const [binauralBeatFreq, setBinauralBeatFreq] = useState(6);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  const commonTinnitusFreqs = [
    { name: "Low Pitch", freq: 2000 },
    { name: "Medium Low", freq: 3000 },
    { name: "Medium", freq: 4000 },
    { name: "Medium High", freq: 6000 },
    { name: "High Pitch", freq: 8000 }
  ];

  useEffect(() => {
    const context = new (window.AudioContext || window.webkitAudioContext)();
    const gain = context.createGain();
    const analyserNode = context.createAnalyser();
    
    gain.connect(analyserNode);
    analyserNode.connect(context.destination);
    gain.gain.value = volume;
    
    setAudioContext(context);
    setGainNode(gain);
    setAnalyser(analyserNode);

    createNoiseBuffers(context);

    return () => {
      cancelAnimationFrame(animationRef.current);
      if (context) context.close();
    };
  }, []);

  const createNoiseBuffers = (context) => {
    const bufferSize = context.sampleRate * 2;
    const brownBuffer = context.createBuffer(1, bufferSize, context.sampleRate);
    const pinkBuffer = context.createBuffer(1, bufferSize, context.sampleRate);
    const brownData = brownBuffer.getChannelData(0);
    const pinkData = pinkBuffer.getChannelData(0);
    
    let lastOut = 0;
    const b = [0, 0, 0, 0, 0]; // Pink noise filtering
    
    for (let i = 0; i < bufferSize; i++) {
      // Brown noise
      const white = Math.random() * 2 - 1;
      const brown = (lastOut + (0.02 * white)) / 1.02;
      lastOut = brown;
      brownData[i] = brown * 3.5;

      // Pink noise
      const w = Math.random() * 2 - 1;
      b[0] = 0.99886 * b[0] + w * 0.0555179;
      b[1] = 0.99332 * b[1] + w * 0.0750759;
      b[2] = 0.96900 * b[2] + w * 0.1538520;
      b[3] = 0.86650 * b[3] + w * 0.3104856;
      b[4] = 0.55000 * b[4] + w * 0.5329522;
      pinkData[i] = (b[0] + b[1] + b[2] + b[3] + b[4]) * 0.15;
    }
    
    setNoiseBuffer({ brown: brownBuffer, pink: pinkBuffer });
  };

  const createBinauralBeat = () => {
    const leftOsc = audioContext.createOscillator();
    const rightOsc = audioContext.createOscillator();
    const leftGain = audioContext.createGain();
    const rightGain = audioContext.createGain();
    const merger = audioContext.createChannelMerger(2);

    leftOsc.frequency.value = frequency;
    rightOsc.frequency.value = frequency + binauralBeatFreq;
    
    leftOsc.connect(leftGain);
    rightOsc.connect(rightGain);
    leftGain.connect(merger, 0, 0);
    rightGain.connect(merger, 0, 1);
    
    leftOsc.start();
    rightOsc.start();
    
    return {
      source: [leftOsc, rightOsc],
      output: merger
    };
  };

  const createNoise = (type) => {
    if (!noiseBuffer) return null;

    const noiseSource = audioContext.createBufferSource();
    noiseSource.buffer = noiseBuffer[type];
    noiseSource.loop = true;

    const filters = [];
    
    if (type === 'brown') {
      const lowpass = audioContext.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.value = 100;
      lowpass.Q.value = 1.0;

      const lowShelf = audioContext.createBiquadFilter();
      lowShelf.type = 'lowshelf';
      lowShelf.frequency.value = 80;
      lowShelf.gain.value = 10;

      filters.push(lowpass, lowShelf);
    }

    let lastNode = noiseSource;
    filters.forEach(filter => {
      lastNode.connect(filter);
      lastNode = filter;
    });

    return {
      source: noiseSource,
      output: lastNode
    };
  };

  const drawVisualization = () => {
    if (!analyser || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);
      analyser.getByteTimeDomainData(dataArray);
      
      ctx.fillStyle = 'rgb(200, 200, 200)';
      ctx.fillRect(0, 0, width, height);
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgb(0, 0, 0)';
      ctx.beginPath();
      
      const sliceWidth = width / bufferLength;
      let x = 0;
      
      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = v * height / 2;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
        
        x += sliceWidth;
      }
      
      ctx.lineTo(width, height / 2);
      ctx.stroke();
    };
    
    draw();
  };

  useEffect(() => {
    if (isPlaying) {
      drawVisualization();
    } else {
      cancelAnimationFrame(animationRef.current);
    }
  }, [isPlaying]);

  useEffect(() => {
    if (gainNode) {
      gainNode.gain.value = volume;
    }
  }, [volume, gainNode]);

  const toggleSound = () => {
    if (isPlaying) {
      if (Array.isArray(source)) {
        source.forEach(s => s.stop(0));
      } else {
        source?.stop?.(0);
      }
      setSource(null);
      setIsPlaying(false);
    } else {
      let newSource;
      
      switch (soundType) {
        case 'binaural':
          const binauralSetup = createBinauralBeat();
          newSource = binauralSetup.source;
          binauralSetup.output.connect(gainNode);
          break;
        
        case 'deepspace':
        case 'pink':
          const noiseSetup = createNoise(soundType === 'deepspace' ? 'brown' : 'pink');
          if (noiseSetup) {
            newSource = noiseSetup.source;
            noiseSetup.output.connect(gainNode);
            newSource.start(0);
          }
          break;
        
        default:
          newSource = audioContext.createOscillator();
          newSource.type = soundType;
          newSource.frequency.setValueAtTime(frequency, audioContext.currentTime);
          newSource.connect(gainNode);
          newSource.start(0);
      }
      
      setSource(newSource);
      setIsPlaying(true);
    }
  };

  return (
    <Card className="w-full lg:w-[600px]">
      <CardHeader>
        <CardTitle>Enhanced Tinnitus Sound Relief</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <canvas 
          ref={canvasRef}
          className="w-full h-32 bg-gray-100 rounded"
          width={600}
          height={128}
        />

        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm">Frequency: {frequency}Hz</span>
          </div>
          <Slider
            value={[frequency]}
            min={2000}
            max={8000}
            step={100}
            onValueChange={(val) => {
              setFrequency(val[0]);
              if (source && !['deepspace', 'pink', 'binaural'].includes(soundType)) {
                source.frequency.setValueAtTime(val[0], audioContext.currentTime);
              }
            }}
            disabled={['deepspace', 'pink'].includes(soundType)}
          />
        </div>

        {soundType === 'binaural' && (
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Binaural Beat: {binauralBeatFreq}Hz</span>
            </div>
            <Slider
              defaultValue={[binauralBeatFreq]}
              min={1}
              max={40}
              step={1}
              onValueChange={(val) => setBinauralBeatFreq(val[0])}
            />
          </div>
        )}

        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm">Volume</span>
          </div>
          <div className="flex items-center gap-2">
            <VolumeX className="w-4 h-4" />
            <Slider
              defaultValue={[volume]}
              min={0}
              max={0.5}
              step={0.01}
              onValueChange={(val) => setVolume(val[0])}
            />
            <Volume2 className="w-4 h-4" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {commonTinnitusFreqs.map((preset) => (
            <Button
              key={preset.freq}
              onClick={() => {
                if (isPlaying) toggleSound();
                setFrequency(preset.freq);
              }}
              variant="outline"
              size="sm"
            >
              {preset.name} ({preset.freq}Hz)
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <Button
            onClick={() => {
              if (isPlaying) toggleSound();
              setSoundType('sine');
            }}
            variant={soundType === 'sine' ? 'default' : 'outline'}
          >
            Sine Wave
          </Button>
          <Button
            onClick={() => {
              if (isPlaying) toggleSound();
              setSoundType('square');
            }}
            variant={soundType === 'square' ? 'default' : 'outline'}
          >
            Square Wave
          </Button>
          <Button
            onClick={() => {
              if (isPlaying) toggleSound();
              setSoundType('sawtooth');
            }}
            variant={soundType === 'sawtooth' ? 'default' : 'outline'}
          >
            Sawtooth
          </Button>
          <Button
            onClick={() => {
              if (isPlaying) toggleSound();
              setSoundType('deepspace');
            }}
            variant={soundType === 'deepspace' ? 'default' : 'outline'}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Deep Space
          </Button>
          <Button
            onClick={() => {
              if (isPlaying) toggleSound();
              setSoundType('pink');
            }}
            variant={soundType === 'pink' ? 'default' : 'outline'}
            className="bg-pink-600 hover:bg-pink-700"
          >
            Pink Noise
          </Button>
          <Button
            onClick={() => {
              if (isPlaying) toggleSound();
              setSoundType('binaural');
            }}
            variant={soundType === 'binaural' ? 'default' : 'outline'}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Binaural Beats
          </Button>
        </div>

        <Button 
          onClick={toggleSound} 
          className="w-full"
          variant={isPlaying ? 'destructive' : 'default'}
        >
          {isPlaying ? 'Stop' : 'Start'} Sound
        </Button>
      </CardContent>
    </Card>
  );
};

export default TinnitusRelief;
