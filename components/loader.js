import { LoaderCircle } from "lucide-react";

const CustomLoader = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#ffffff',
    }}>
      <LoaderCircle 
        size={50} 
        color="#0ab39c" 
        style={{
          animation: 'spin 1s linear infinite', 
        }}
      />

      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default CustomLoader;
