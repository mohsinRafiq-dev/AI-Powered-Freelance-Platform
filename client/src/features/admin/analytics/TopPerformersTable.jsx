import { Avatar } from '../../../components/ui/Avatar';
import { Badge } from '../../../components/ui/badge';
import { Star, Award } from 'lucide-react';

const TopPerformersTable = ({ data = [], type }) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No data available
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-brand-light/30 dark:border-gray-700">
            <th className="text-left py-3 px-2 text-xs font-medium text-gray-600 dark:text-gray-400">
              Rank
            </th>
            <th className="text-left py-3 px-2 text-xs font-medium text-gray-600 dark:text-gray-400">
              User
            </th>
            <th className="text-right py-3 px-2 text-xs font-medium text-gray-600 dark:text-gray-400">
              {type === 'freelancer' ? 'Completed' : 'Posted'}
            </th>
            <th className="text-right py-3 px-2 text-xs font-medium text-gray-600 dark:text-gray-400">
              Rating
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((performer, index) => (
            <tr 
              key={performer.userId} 
              className="border-b border-brand-light/20 dark:border-gray-800 hover:bg-brand-light/10 dark:hover:bg-gray-800/50 transition-colors"
            >
              <td className="py-3 px-2">
                <div className="flex items-center">
                  {index === 0 && (
                    <Award className="w-4 h-4 text-yellow-500 mr-1" />
                  )}
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    #{index + 1}
                  </span>
                </div>
              </td>
              <td className="py-3 px-2">
                <div className="flex items-center space-x-2">
                  <Avatar
                    src={performer.avatar}
                    alt={performer.name}
                    size="sm"
                  />
                  <div>
                    <p className="text-sm font-medium text-brand-deepest dark:text-white">
                      {performer.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {performer.email}
                    </p>
                  </div>
                </div>
              </td>
              <td className="py-3 px-2 text-right">
                <Badge variant="blue">
                  {performer.completedJobs || performer.jobsPosted || performer.jobCount || 0}
                </Badge>
              </td>
              <td className="py-3 px-2 text-right">
                <div className="flex items-center justify-end space-x-1">
                  <Star className="w-3 h-3 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {performer.rating?.toFixed(1) || 'N/A'}
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TopPerformersTable;
