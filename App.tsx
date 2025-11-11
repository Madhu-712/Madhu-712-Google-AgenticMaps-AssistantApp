import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { QueryInput } from './components/QueryInput';
import { AgentWorkflow } from './components/AgentWorkflow';
import { FinalAnswer } from './components/FinalAnswer';
import { generatePlan, executeTask, synthesizeFinalAnswer } from './services/geminiService';
import type { Task, Geolocation } from './types';
import { TaskStatus } from './types';

const App: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [finalAnswer, setFinalAnswer] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<Geolocation | null>(null);
  const [locationStatus, setLocationStatus] = useState<string>('Fetching location...');

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLocationStatus('Location acquired.');
      },
      (error) => {
        console.error("Geolocation error:", error);
        setLocationStatus('Could not get location. Using default.');
        // Default to a known location if permission is denied
        setUserLocation({ latitude: 37.7749, longitude: -122.4194 }); 
      }
    );
  }, []);

  const resetState = () => {
    setTasks([]);
    setFinalAnswer('');
    setError(null);
  };

  const handleQuerySubmit = useCallback(async (submittedQuery: string) => {
    if (!submittedQuery || isLoading || !userLocation) return;
    
    setQuery(submittedQuery);
    setIsLoading(true);
    resetState();

    try {
      // 1. Planner Agent: Generate plan
      const plannedTasks = await generatePlan(submittedQuery);
      setTasks(plannedTasks.map(task => ({ ...task, status: TaskStatus.PENDING })));

      // 2. Worker Agents: Execute tasks sequentially
      const completedTasks: Task[] = [];
      for (const task of plannedTasks) {
        setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: TaskStatus.IN_PROGRESS } : t));
        const result = await executeTask(task.description, userLocation);
        const completedTask = { ...task, status: TaskStatus.COMPLETED, result };
        completedTasks.push(completedTask);
        setTasks(prev => prev.map(t => t.id === task.id ? completedTask : t));
      }

      // 3. Synthesizer Agent: Generate final answer
      const finalResult = await synthesizeFinalAnswer(submittedQuery, completedTasks);
      setFinalAnswer(finalResult);

    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`Failed to process the request. ${errorMessage}`);
      setTasks(prev => prev.map(t => t.status === TaskStatus.IN_PROGRESS ? { ...t, status: TaskStatus.FAILED } : t));
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, userLocation]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <Header locationStatus={locationStatus} />
        <main className="mt-8">
          <QueryInput onSubmit={handleQuerySubmit} isLoading={isLoading} />
          
          {error && (
            <div className="mt-6 bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg" role="alert">
              <strong className="font-bold">Error:</strong>
              <span className="block sm:inline ml-2">{error}</span>
            </div>
          )}

          {tasks.length > 0 && <AgentWorkflow tasks={tasks} />}
          
          {finalAnswer && <FinalAnswer answer={finalAnswer} />}
          
          {isLoading && !finalAnswer && tasks.length === 0 && (
            <div className="text-center mt-8 text-lg text-cyan-400">
              Planner agent is thinking...
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
