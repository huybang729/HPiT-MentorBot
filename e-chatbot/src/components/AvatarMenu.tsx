import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

type AvatarMenuProps = {
  avatarUrl: string;
  username: string;
  onLogout: () => void;
};

export const AvatarMenu: React.FC<AvatarMenuProps> = ({ avatarUrl, username, onLogout }) => {
  return (
    <DropdownMenu.Root >
      <DropdownMenu.Trigger asChild>
        <button className="rounded-full border w-10 h-10 overflow-hidden">
          <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content
        className="bg-white shadow-lg rounded-md p-2 min-w-[150px] z-50"
        sideOffset={5}
      >
        <DropdownMenu.Label className="px-2 py-1 text-sm text-gray-500">
          {username}
        </DropdownMenu.Label>
        <DropdownMenu.Separator className="h-px bg-gray-200 my-1" />
        <DropdownMenu.Item
          className="px-2 py-1 hover:bg-red-100 text-red-500 cursor-pointer text-sm"
          onClick={onLogout}
        >
          Logout
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};