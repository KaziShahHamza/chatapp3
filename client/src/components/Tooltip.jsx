export default function Tooltip({ text, disabled, children }) {
  if (!disabled) return children;

  return (
    <div className="relative group inline-block">
      <div className="pointer-events-none">
        {children}
      </div>

      <div
        className="
          absolute left-1/2 -translate-x-1/2 bottom-full mb-2
          hidden group-hover:block
          whitespace-nowrap
          bg-gray-900 text-white text-xs
          px-2 py-1 rounded
          z-50
        "
      >
        {text}
      </div>
    </div>
  );
}
