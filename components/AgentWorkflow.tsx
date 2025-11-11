import React from 'react';
import { TaskCard } from './TaskCard';
import type { Task } from '../types';
import { PlannerIcon } from './icons/PlannerIcon';

interface AgentWorkflowProps {
  tasks: Task[];
}

export const AgentWorkflow: React.FC<AgentWorkflowProps> = ({ tasks }) => {
  return (
    <div className="mt-10">
      <div className="flex items-center mb-6">
        <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-2 rounded-lg">
          <PlannerIcon />
        </div>
        <h2 className="ml-4 text-2xl font-bold text-gray-200">Planner's Blueprint</h2>
      </div>
      <div className="relative pl-8">
        {/* Vertical timeline bar */}
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-700" style={{ transform: 'translateX(15px)' }}></div>
        {tasks.map((task, index) => (
          <TaskCard key={task.id} task={task} isLast={index === tasks.length - 1} />
        ))}
      </div>
    </div>
  );
};
