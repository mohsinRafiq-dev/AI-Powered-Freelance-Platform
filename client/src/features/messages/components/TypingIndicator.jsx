import { Avatar } from '../../../components/ui/Avatar';

export const TypingIndicator = ({ user }) => {
  return (
    <div className="flex gap-3 items-end">
      <Avatar src={user?.avatar} alt={user?.name} className="w-10 h-10" />
      <div className="bg-gray-800 rounded-2xl rounded-tl-sm px-4 py-3">
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
};
