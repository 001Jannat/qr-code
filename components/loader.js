import { LoaderCircle } from "lucide-react";
 
const CustomLoader = () => {
  return (
    <div>
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