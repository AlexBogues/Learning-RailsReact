export default function Alert({ type = 'info', children }) {
  if (!children) return null;
  const colorClasses = type === 'error' ? 'text-red-600' : type === 'success' ? 'text-green-600' : 'text-gray-700';
  return (
    <p className={`${colorClasses} mt-3`}>
      {children}
    </p>
  );
}


