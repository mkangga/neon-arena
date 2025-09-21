
import { useState, useEffect } from 'react';

const useKeyboardInput = (): Set<string> => {
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      setActiveKeys(prevKeys => new Set(prevKeys).add(event.key.toLowerCase()));
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      setActiveKeys(prevKeys => {
        const newKeys = new Set(prevKeys);
        newKeys.delete(event.key.toLowerCase());
        return newKeys;
      });
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return activeKeys;
};

export default useKeyboardInput;
