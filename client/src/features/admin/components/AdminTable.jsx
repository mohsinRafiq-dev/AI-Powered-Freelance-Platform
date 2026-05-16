import { Card } from '../../../components/ui/card';

/**
 * Consistent table wrapper for all admin pages
 */
export const AdminTable = ({ children, className = '' }) => {
  return (
    <div className={`rounded-xl border backdrop-blur-xl bg-white/70 border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] dark:bg-gray-800/40 dark:border-gray-700/30 dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] overflow-visible ${className}`}>
      <div className="overflow-x-auto overflow-y-visible">
        <table className="w-full relative">
          {children}
        </table>
      </div>
    </div>
  );
};

/**
 * Table header
 */
export const AdminTableHeader = ({ children }) => {
  return (
    <thead>
      <tr className="bg-gradient-to-r from-brand-light/60 to-brand/30 dark:from-gray-800/60 dark:to-gray-700/60">
        {children}
      </tr>
    </thead>
  );
};

/**
 * Table header cell
 */
export const AdminTableHeaderCell = ({ children, align = 'left', className = '' }) => {
  const alignClass = align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left';
  return (
    <th className={`px-6 py-4 ${alignClass} text-sm font-semibold text-brand-deepest dark:text-white ${className}`}>
      {children}
    </th>
  );
};

/**
 * Table body
 */
export const AdminTableBody = ({ children }) => {
  return <tbody className="relative">{children}</tbody>;
};

/**
 * Table row
 */
export const AdminTableRow = ({ children, index = 0, onClick, className = '' }) => {
  return (
    <tr
      onClick={onClick}
      className={`border-b border-brand-light/30 dark:border-gray-700/30 hover:bg-brand-light/20 dark:hover:bg-gray-800/30 transition-colors relative ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </tr>
  );
};

/**
 * Table cell
 */
export const AdminTableCell = ({ children, align = 'left', className = '', hasDropdown = false }) => {
  const alignClass = align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left';
  return (
    <td className={`px-6 py-4 ${alignClass} ${className}`} style={{ overflow: 'visible', position: 'relative' }}>
      {children}
    </td>
  );
};

/**
 * Empty state for table
 */
export const AdminTableEmpty = ({ icon: Icon, title, message }) => {
  return (
    <tr>
      <td colSpan="100" className="px-6 py-12">
        <div className="text-center">
          {Icon && <Icon className="w-16 h-16 text-gray-400 mx-auto mb-4" />}
          <h3 className="text-xl font-semibold text-brand-deepest dark:text-white mb-2">
            {title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {message}
          </p>
        </div>
      </td>
    </tr>
  );
};

// Attach subcomponents to AdminTable for compound component pattern
AdminTable.Header = AdminTableHeader;
AdminTable.HeaderCell = AdminTableHeaderCell;
AdminTable.Body = AdminTableBody;
AdminTable.Row = AdminTableRow;
AdminTable.Cell = AdminTableCell;
AdminTable.Empty = AdminTableEmpty;

export default AdminTable;
