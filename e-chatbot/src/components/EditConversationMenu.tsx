import { Popover, PopoverButton, PopoverPanel} from '@headlessui/react';
import { Ellipsis } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useRef, useState, useLayoutEffect } from 'react';

interface EditConversationMenuProps {
  onDelete: () => void;
  onRename: () => void;
}

export const EditConversationMenu: React.FC<EditConversationMenuProps> = ({ onDelete, onRename }) => {
  const [panelStyle, setPanelStyle] = useState<React.CSSProperties>({});
  const buttonRef = useRef<HTMLButtonElement>(null);

  const updatePanelPosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPanelStyle({
        position: 'absolute',
        top: rect.bottom + 8,
        left: rect.left,
        zIndex: 9999,
      });
    }
  };

  useLayoutEffect(() => {
    updatePanelPosition();
    window.addEventListener('resize', updatePanelPosition);
    window.addEventListener('scroll', updatePanelPosition, true);
    return () => {
      window.removeEventListener('resize', updatePanelPosition);
      window.removeEventListener('scroll', updatePanelPosition, true);
    };
  }, []);

  return (
    <Popover>
      {({ open, close }) => (
        <>
          <PopoverButton
            ref={buttonRef}
            className="ml-2 text-gray-400 rounded-2xl hover:text-white focus:outline-none"
            onClick={(e) => e.stopPropagation()}
          >
            <Ellipsis className="w-5 h-5" />
          </PopoverButton>

          {open &&
            createPortal(
              <div
                style={panelStyle}
                className="w-32 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRename();
                    close();
                  }}
                  className="block w-full px-4 py-2 rounded-md text-left text-gray-700 hover:bg-gray-100"
                >
                  Đổi tên
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                    close();
                  }}
                  className="block w-full px-4 py-2 rounded-md text-left text-red-600 hover:bg-gray-100"
                >
                  Xóa
                </button>
              </div>,
              document.body
            )}
        </>
      )}
    </Popover>
  );
};
