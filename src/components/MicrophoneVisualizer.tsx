
import { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import RecordPlugin from 'wavesurfer.js/dist/plugins/record.js';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AudioWaveform, Mic, MicOff } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const visualizerThemes = {
  classic: {
    waveColor: '#9b87f5',
    progressColor: '#7E69AB',
    cursorColor: 'transparent',
  },
  neon: {
    waveColor: '#33C3F0',
    progressColor: '#0EA5E9',
    cursorColor: 'transparent',
  },
  sunset: {
    waveColor: '#F97316',
    progressColor: '#D946EF',
    cursorColor: 'transparent',
  }
};

export const MicrophoneVisualizer = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const recordRef = useRef<any>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<keyof typeof visualizerThemes>('classic');

  useEffect(() => {
    if (!containerRef.current) return;

    wavesurferRef.current = WaveSurfer.create({
      container: containerRef.current,
      waveColor: visualizerThemes[currentTheme].waveColor,
      progressColor: visualizerThemes[currentTheme].progressColor,
      cursorColor: visualizerThemes[currentTheme].cursorColor,
      height: 200,
      barWidth: 2,
      barGap: 3,
      barRadius: 3,
    });

    recordRef.current = wavesurferRef.current.registerPlugin(RecordPlugin.create());

    return () => {
      wavesurferRef.current?.destroy();
    };
  }, []);

  useEffect(() => {
    if (!wavesurferRef.current) return;
    
    wavesurferRef.current.setOptions({
      waveColor: visualizerThemes[currentTheme].waveColor,
      progressColor: visualizerThemes[currentTheme].progressColor,
    });
  }, [currentTheme]);

  const startRecording = async () => {
    try {
      await recordRef.current.startRecording();
      setIsRecording(true);
      toast({
        title: "Recording started",
        description: "Your microphone is now active",
      });
    } catch (error) {
      toast({
        title: "Permission denied",
        description: "Please allow microphone access to use this feature",
        variant: "destructive",
      });
    }
  };

  const stopRecording = async () => {
    await recordRef.current.stopRecording();
    setIsRecording(false);
    toast({
      title: "Recording stopped",
      description: "Your microphone is now inactive",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card className="p-8 backdrop-blur-sm bg-white/80 border border-gray-200/50 shadow-xl rounded-xl">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-2xl font-semibold tracking-tight">Sound Wave Visualizer</h2>
                <p className="text-sm text-gray-500">Visualize your voice in real-time</p>
              </div>
              <AudioWaveform className="h-8 w-8 text-primary animate-pulse" />
            </div>
            
            <div ref={containerRef} className="w-full h-[200px] transition-all duration-500 ease-in-out" />
            
            <div className="flex items-center justify-between">
              <div className="space-x-2">
                <Button
                  onClick={isRecording ? stopRecording : startRecording}
                  variant={isRecording ? "destructive" : "default"}
                  className="transition-all duration-300"
                >
                  {isRecording ? (
                    <>
                      <MicOff className="mr-2 h-4 w-4" />
                      Stop Recording
                    </>
                  ) : (
                    <>
                      <Mic className="mr-2 h-4 w-4" />
                      Start Recording
                    </>
                  )}
                </Button>
              </div>
              
              <div className="flex gap-2">
                {(Object.keys(visualizerThemes) as (keyof typeof visualizerThemes)[]).map((theme) => (
                  <Button
                    key={theme}
                    variant={currentTheme === theme ? "default" : "outline"}
                    onClick={() => setCurrentTheme(theme)}
                    className="capitalize"
                  >
                    {theme}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
