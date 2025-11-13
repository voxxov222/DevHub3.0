
import React, { useRef, useState, useEffect } from 'react';
import type { WindowState, ViewType } from '../App';
import { CloseIcon, MinimizeIcon, MaximizeIcon, RestoreIcon } from './Icons';

interface WindowProps {
  state: WindowState;
  boundsRef: React.RefObject<HTMLElement>;
  children: React.ReactNode;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onFocus: () => void;
  onUpdate: (id: ViewType, position: {x: number, y: number}, size?: {width: number, height: number}) => void;
}

const MIN_WIDTH = 300;
const MIN_HEIGHT = 200;
const RESIZE_HANDLE_SIZE = 8;


export const Window: React.FC<WindowProps> = ({ state, boundsRef, children, onClose, onMinimize, onMaximize, onFocus, onUpdate }) => {
  const windowRef = useRef<HTMLDivElement>(null);
  const dragData = useRef({ isDragging: false, isResizing: false, startX: 0, startY: 0, startLeft: 0, startTop: 0, startWidth: 0, startHeight: 0, resizeDirection: '' });

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>, direction = '') => {
    e.preventDefault();
    onFocus();

    const { clientX, clientY } = e;
    const { x, y, width, height } = state;
    dragData.current = {
        isDragging: direction === '',
        isResizing: direction !== '',
        startX: clientX,
        startY: clientY,
        startLeft: x,
        startTop: y,
        startWidth: width,
        startHeight: height,
        resizeDirection: direction,
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    const { clientX, clientY } = e;
    const dx = clientX - dragData.current.startX;
    const dy = clientY - dragData.current.startY;
    const bounds = boundsRef.current?.getBoundingClientRect();

    if (dragData.current.isDragging && !state.isMaximized) {
        let newX = dragData.current.startLeft + dx;
        let newY = dragData.current.startTop + dy;

        if (bounds) {
          newX = Math.max(0, Math.min(newX, bounds.width - state.width));
          newY = Math.max(0, Math.min(newY, bounds.height - state.height));
        }
        
        onUpdate(state.id, { x: newX, y: newY });
    }

    if (dragData.current.isResizing && !state.isMaximized) {
        let newX = dragData.current.startLeft;
        let newY = dragData.current.startTop;
        let newWidth = dragData.current.startWidth;
        let newHeight = dragData.current.startHeight;
        
        // Horizontal resizing
        if (dragData.current.resizeDirection.includes('w')) {
          newWidth = Math.max(MIN_WIDTH, dragData.current.startWidth - dx);
          newX = dragData.current.startLeft + dx;
        } else if (dragData.current.resizeDirection.includes('e')) {
          newWidth = Math.max(MIN_WIDTH, dragData.current.startWidth + dx);
        }
        
        // Vertical resizing
        if (dragData.current.resizeDirection.includes('n')) {
          newHeight = Math.max(MIN_HEIGHT, dragData.current.startHeight - dy);
          newY = dragData.current.startTop + dy;
        } else if (dragData.current.resizeDirection.includes('s')) {
          newHeight = Math.max(MIN_HEIGHT, dragData.current.startHeight + dy);
        }

        if (bounds) {
            if (newX < 0) { newWidth += newX; newX = 0; }
            if (newY < 0) { newHeight += newY; newY = 0; }
            if (newX + newWidth > bounds.width) { newWidth = bounds.width - newX; }
            if (newY + newHeight > bounds.height) { newHeight = bounds.height - newY; }
        }

        onUpdate(state.id, { x: newX, y: newY }, { width: newWidth, height: newHeight });
    }
  };

  const handleMouseUp = () => {
    dragData.current = { ...dragData.current, isDragging: false, isResizing: false };
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };
  
  useEffect(() => {
    // Cleanup event listeners on component unmount
    return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);
  
  const resizeHandles = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'];
  
  return (
    <div
      ref={windowRef}
      onMouseDown={onFocus}
      className={`absolute bg-gray-900 rounded-lg shadow-2xl flex flex-col border border-gray-700 transition-all duration-100 ease-out
        ${dragData.current.isDragging || dragData.current.isResizing ? 'transition-none' : ''}
        ${state.isMaximized ? 'rounded-none border-none' : ''}
      `}
      style={{
        left: state.x,
        top: state.y,
        width: state.width,
        height: state.height,
        zIndex: state.zIndex,
      }}
    >
      <header
        onMouseDown={(e) => handleMouseDown(e)}
        onDoubleClick={onMaximize}
        className={`h-10 bg-gray-800 rounded-t-lg flex items-center justify-between px-4 cursor-grab active:cursor-grabbing ${state.isMaximized ? 'rounded-t-none' : ''}`}
      >
        <span className="font-bold text-white text-sm">{state.title}</span>
        <div className="flex items-center space-x-1">
            <button onClick={onMinimize} className="p-2 rounded-full hover:bg-gray-700"><MinimizeIcon className="w-4 h-4 text-gray-300"/></button>
            <button onClick={onMaximize} className="p-2 rounded-full hover:bg-gray-700">
                {state.isMaximized ? <RestoreIcon className="w-4 h-4 text-gray-300"/> : <MaximizeIcon className="w-4 h-4 text-gray-300"/>}
            </button>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-brand-danger"><CloseIcon className="w-4 h-4 text-gray-300"/></button>
        </div>
      </header>
      <div className="flex-grow p-1 bg-gray-800 rounded-b-lg overflow-auto">
        <div className="w-full h-full bg-gray-800 rounded-lg overflow-y-auto">
          {children}
        </div>
      </div>
      
      {!state.isMaximized && resizeHandles.map(dir => (
        <div 
          key={dir}
          onMouseDown={(e) => handleMouseDown(e, dir)}
          style={{
            position: 'absolute',
            top: dir.includes('n') ? -RESIZE_HANDLE_SIZE / 2 : dir.includes('s') ? undefined : 0,
            bottom: dir.includes('s') ? -RESIZE_HANDLE_SIZE / 2 : undefined,
            left: dir.includes('w') ? -RESIZE_HANDLE_SIZE / 2 : dir.includes('e') ? undefined : 0,
            right: dir.includes('e') ? -RESIZE_HANDLE_SIZE / 2 : undefined,
            width: dir.includes('n') || dir.includes('s') ? '100%' : `${RESIZE_HANDLE_SIZE}px`,
            height: dir.includes('w') || dir.includes('e') ? '100%' : `${RESIZE_HANDLE_SIZE}px`,
            cursor: `${dir}-resize`,
          }}
        />
      ))}
    </div>
  );
};
