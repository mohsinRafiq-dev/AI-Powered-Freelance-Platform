import { RefreshCw, Download, Plus } from 'lucide-react';
import { Button } from '../../../components/ui/button';

/**
 * Consistent action buttons for admin pages
 */
export const AdminActions = ({ 
  onRefresh, 
  onExport, 
  onAdd,
  isRefreshing = false,
  isExporting = false,
  showAdd = false,
  addLabel = 'Add New',
  exportLabel = 'Export',
  refreshLabel = 'Refresh'
}) => {
  return (
    <div className="flex gap-3">
      <Button
        variant="outline"
        onClick={onRefresh}
        disabled={isRefreshing}
        glass
        className="flex items-center gap-2"
      >
        <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        <span className="hidden sm:inline">{refreshLabel}</span>
      </Button>

      {onExport && (
        <Button
          variant="outline"
          onClick={onExport}
          disabled={isExporting}
          glass
          className="flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">{exportLabel}</span>
        </Button>
      )}

      {showAdd && onAdd && (
        <Button
          variant="default"
          onClick={onAdd}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">{addLabel}</span>
        </Button>
      )}
    </div>
  );
};

export default AdminActions;
