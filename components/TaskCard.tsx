import React from 'react';
import type { Task } from '../types';
import { TaskStatus } from '../types';
import { WorkerIcon } from './icons/WorkerIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { CheckIcon } from './icons/CheckIcon';
import { DotIcon } from './icons/DotIcon';
import { FailedIcon } from './icons/FailedIcon';

interface TaskCardProps {
  task: Task;
  isLast: boolean;
}

const StatusIndicator: React.FC<{ status: TaskStatus }> = ({ status }) => {
  switch (status) {
    case TaskStatus.IN_PROGRESS:
      return (
        <>
          <SpinnerIcon />
          <span className="ml-2 font-semibold text-cyan-400">In Progress</span>
        </>
      );
    case TaskStatus.COMPLETED:
      return (
        <>
          <CheckIcon />
          <span className="ml-2 font-semibold text-green-400">Completed</span>
        </>
      );
    case TaskStatus.FAILED:
      return (
        <>
          <FailedIcon />
          <span className="ml-2 font-semibold text-red-400">Failed</span>
        </>
      );
    case TaskStatus.PENDING:
    default:
      return (
        <>
          <DotIcon />
          <span className="ml-2 font-semibold text-gray-400">Pending</span>
        </>
      );
  }
};

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const hasGrounding = task.result?.groundingChunks && task.result.groundingChunks.length > 0;

  return (
    <div className="mb-8 relative">
       {/* Dot on the timeline */}
       <div className={`absolute -left-8 top-1.5 w-4 h-4 rounded-full border-4 ${
         task.status === TaskStatus.COMPLETED ? 'bg-green-500 border-green-900' : 
         task.status === TaskStatus.IN_PROGRESS ? 'bg-cyan-500 border-cyan-900 animate-pulse-fast' :
         task.status === TaskStatus.FAILED ? 'bg-red-500 border-red-900' :
         'bg-gray-500 border-gray-800'
       }`}></div>
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-5 transition-all duration-300 hover:border-cyan-700 hover:shadow-2xl hover:shadow-cyan-900/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <WorkerIcon />
            <p className="ml-3 text-lg font-medium text-gray-300">{task.description}</p>
          </div>
          <div className="flex items-center text-sm">
            <StatusIndicator status={task.status} />
          </div>
        </div>

        {task.status === TaskStatus.COMPLETED && task.result && (
          <div className="mt-4 pt-4 border-t border-gray-700">
            <p className="text-gray-300 whitespace-pre-wrap">{task.result.text}</p>
            {hasGrounding && (
              <div className="mt-3">
                <h4 className="text-sm font-semibold text-gray-400 mb-1">Sources:</h4>
                <div className="flex flex-wrap gap-2">
                  {/* FIX: Filter grounding chunks to only include those with a valid maps uri, as it is now optional. */}
                  {task.result.groundingChunks
                    ?.filter(chunk => chunk.maps && chunk.maps.uri)
                    .map((chunk, index) => (
                    <a
                      key={index}
                      href={chunk.maps?.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs bg-gray-700 text-cyan-300 px-2 py-1 rounded-md hover:bg-gray-600 hover:text-cyan-200 transition-colors"
                    >
                      {chunk.maps?.title || 'Google Maps Link'}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
