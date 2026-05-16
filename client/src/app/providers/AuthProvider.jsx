// AuthProvider has been removed - We now use Redux only
// This file is kept for backward compatibility but should be deleted
// All components should use useSelector and useDispatch from react-redux

export default function AuthProvider({ children }) {
  return children;
}
