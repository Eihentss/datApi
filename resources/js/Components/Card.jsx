// resources/js/Components/Card.jsx
export const Card = ({ children, className = "" }) => (
    <div className={`bg-white rounded-2xl border border-slate-200 ${className}`}>
      {children}
    </div>
  );
  
  export const CardHeader = ({ children, className = "" }) => (
    <div className={`p-6 pb-4 ${className}`}>{children}</div>
  );
  
  export const CardTitle = ({ children, className = "" }) => (
    <h3 className={`text-xl font-semibold text-gray-800 ${className}`}>
      {children}
    </h3>
  );
  
  export const CardDescription = ({ children, className = "" }) => (
    <p className={`text-sm text-gray-600 mt-2 ${className}`}>{children}</p>
  );
  
  export const CardContent = ({ children, className = "" }) => (
    <div className={`p-6 pt-0 ${className}`}>{children}</div>
  );
  